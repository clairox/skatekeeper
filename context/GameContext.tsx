import { createContext, useContext, useEffect, useState } from 'react'
import history from '../lib/history'
import Spinner from '../components/ui/Spinner'
import { useRouter } from 'expo-router'
import useHistoryRecord from '../hooks/useHistoryRecord'

type GameContextValue = {
    gameId?: number
    state: GameState & { currentPlayer: Player }
    setupGame: (letters: string, players: Player[]) => Promise<void>
    onTrickSetSuccess: (trick: string) => Promise<void>
    onTrickSetFailure: () => Promise<void>
    onTrickCopySuccess: () => Promise<void>
    onTrickCopyFailure: () => Promise<void>
}
const GameContext = createContext<GameContextValue>({} as GameContextValue)

type GameProviderProps = React.PropsWithChildren<{ gameId?: number }>

export const GameProvider: React.FC<GameProviderProps> = ({
    gameId,
    children,
}) => {
    type LoadStatus = 'idle' | 'loading' | 'succeeded' | 'failed'
    const [recordStatus, setRecordStatus] = useState<LoadStatus>(
        gameId ? 'loading' : 'idle'
    )
    const [state, setState] = useState<GameState>({
        letters: '',
        players: [],
        activePlayers: [],
        turn: 0,
        currentTrick: null,
        setterId: null,
        winnerId: null,
    })

    const { init, update } = useHistoryRecord(state.id)

    const currentPlayer: Player = state.activePlayers[state.turn]

    const randomizeArrayOrder = <T,>(array: T[]): T[] => {
        let randomized = [...array]

        let currentIdx = randomized.length
        while (currentIdx > 0) {
            let randomIdx = Math.floor(Math.random() * currentIdx)
            currentIdx -= 1
            ;[randomized[currentIdx], randomized[randomIdx]] = [
                randomized[randomIdx],
                randomized[currentIdx],
            ]
        }

        return randomized
    }

    const calculateNextTurn = (): number => {
        if (state.turn + 1 >= state.activePlayers.length) {
            return 0
        }

        return state.turn + 1
    }

    const setupGame = async (
        letters: string,
        players: Player[]
    ): Promise<void> => {
        if (!letters) {
            throw new Error("'letters' must contain a value.")
        }

        if (players.length < 2) {
            throw new Error('At least 2 players required.')
        }

        const randomizedPlayers = randomizeArrayOrder(players)
        const setter = randomizedPlayers[0]

        console.log(`Letters: ${letters}`)
        console.log(
            `Added ${players.length} players: ${JSON.stringify(players.map(player => player.name))}`
        )
        console.log(`Starting game...`)

        try {
            const { id } = await init(letters.toUpperCase(), randomizedPlayers)

            setState({
                ...state,
                id,
                letters,
                players: randomizedPlayers,
                activePlayers: randomizedPlayers,
                setterId: setter.id,
            })
        } catch (error) {
            console.error(error)
        }
    }

    const onTrickSetSuccess = async (trick: string): Promise<void> => {
        if (!trick) {
            throw new Error("'trick' must contain a value.")
        }

        const nextTurn = calculateNextTurn()

        console.log(`${currentPlayer.name} has set the trick to ${trick}.`)

        await update({
            playerId: currentPlayer.id,
            type: 'set',
            status: 'success',
            trick,
            nextTurn,
        })

        setState({
            ...state,
            currentTrick: trick,
            turn: nextTurn,
        })
    }

    const onTrickSetFailure = async (): Promise<void> => {
        const nextTurn = calculateNextTurn()
        const setter = state.activePlayers[nextTurn]

        console.log(`${currentPlayer.name} failed to set the trick.`)

        await update({
            playerId: currentPlayer.id,
            type: 'set',
            status: 'failed',
            nextTurn,
        })

        setState({ ...state, setterId: setter.id, turn: nextTurn })
    }

    const onTrickCopySuccess = async (): Promise<void> => {
        const { activePlayers, setterId, currentTrick } = state
        const nextTurn = calculateNextTurn()
        const nextPlayer = activePlayers[nextTurn]
        const isRoundOver = nextPlayer.id === setterId

        console.log(`${currentPlayer.name} has copied the ${currentTrick}.`)

        await update({
            playerId: currentPlayer.id,
            type: 'copy',
            status: 'success',
            nextTurn,
            roundOver: isRoundOver,
        })

        setState({
            ...state,
            currentTrick: isRoundOver ? null : currentTrick,
            turn: nextTurn,
        })
    }

    const onTrickCopyFailure = async (): Promise<void> => {
        const { players, turn, letters, currentTrick, setterId } = state

        const points = currentPlayer.points + 1

        const shouldEliminate = points === letters.length

        const updatedPlayers = players.map(player => {
            if (player.id === currentPlayer.id) {
                return {
                    ...currentPlayer,
                    points,
                    isEliminated: shouldEliminate ? true : false,
                }
            }

            return player
        })

        const updatedActivePlayers = updatedPlayers.filter(
            player => !player.isEliminated
        )

        let nextTurn = 0
        if (shouldEliminate && turn < updatedActivePlayers.length) {
            nextTurn = turn
        } else if (!shouldEliminate && turn + 1 < updatedActivePlayers.length) {
            nextTurn = turn + 1
        } else {
            nextTurn = 0
        }

        const isGameOver = updatedActivePlayers.length === 1
        const winner = isGameOver ? updatedActivePlayers[0] : null

        const isRoundOver = updatedActivePlayers[nextTurn].id === setterId

        console.log(
            `${currentPlayer.name} has failed to copy the ${currentTrick}.`
        )
        console.log(`${currentPlayer.name}: ${letters.slice(0, points)}`)

        if (shouldEliminate) {
            console.log(`${currentPlayer.name} has been eliminated.`)
        }

        if (winner) {
            console.log(`The winner is ${winner.name}.`)
        }

        await update({
            playerId: currentPlayer.id,
            playerEliminated: shouldEliminate,
            type: 'copy',
            status: 'failed',
            nextTurn,
            players: updatedPlayers,
            activePlayers: updatedActivePlayers,
            winnerId: winner?.id,
            roundOver: isRoundOver,
        })

        setState({
            ...state,
            players: updatedPlayers,
            activePlayers: updatedActivePlayers,
            winnerId: winner?.id ?? null,
            currentTrick: isRoundOver ? null : currentTrick,
            turn: nextTurn,
        })
    }

    useEffect(() => {
        if (gameId) {
            const fetchRecord = async () => {
                const record = await history.getRecord(gameId)
                if (!record) {
                    // TODO: Warn user that something went wrong
                    setRecordStatus('failed')
                    return
                }

                if (record.completed || record.data.winnerId) {
                    // TODO: Warn user that game is already complete
                    setRecordStatus('failed')
                    return
                }

                const gameData = record.data
                const currentRound = gameData.rounds[gameData.rounds.length - 1]

                setState({
                    id: record.id,
                    letters: gameData.letters ?? '',
                    players: gameData.players,
                    activePlayers: gameData.players.filter(
                        player => !player.isEliminated
                    ),
                    turn: gameData.turn,
                    currentTrick: currentRound.trick ?? null,
                    setterId: currentRound.setterId ?? null,
                    winnerId: null,
                })
                setRecordStatus('succeeded')
            }

            fetchRecord()
        }
    }, [gameId])

    const router = useRouter()

    if (recordStatus === 'failed') {
        router.back()
    }

    if (recordStatus === 'loading') {
        return <Spinner />
    }

    return (
        <GameContext.Provider
            value={{
                gameId,
                state: {
                    ...state,
                    currentPlayer: state.activePlayers[state.turn],
                },
                setupGame,
                onTrickSetSuccess,
                onTrickSetFailure,
                onTrickCopySuccess,
                onTrickCopyFailure,
            }}
        >
            {children}
        </GameContext.Provider>
    )
}

export const useGameContext = () => useContext(GameContext)
