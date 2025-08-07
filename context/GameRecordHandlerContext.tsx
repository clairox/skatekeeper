import {
    createContext,
    PropsWithChildren,
    useContext,
    useEffect,
    useRef,
} from 'react'
import history from '../lib/history'

const GameRecordHandlerContext = createContext<GameRecordHandler>(
    {} as GameRecordHandler
)

type GameRecordHandlerProviderProps = PropsWithChildren<{
    historyId?: number
}>

export const GameRecordHandlerProvider: React.FC<
    GameRecordHandlerProviderProps
> = ({ children, historyId }) => {
    const gameRecord = useRef<GameRecord>({} as GameRecord)

    useEffect(() => {
        const init = async () => {
            const result = await (historyId
                ? (history.getRecord(historyId) ?? history.newRecord())
                : history.newRecord())

            gameRecord.current = result!
        }

        init()
        console.log('Initializing record...')
    }, [historyId])

    const saveHistory = async (): Promise<void> => {
        const idx = await (historyId ??
            history.getRecords().then(records => records.length - 1))
        history.saveRecord(idx, gameRecord.current)
    }

    const initRound = (): GameRecordRound => {
        const prevRecord = gameRecord.current
        const activePlayers = prevRecord.data.players.filter(
            player => !player.isEliminated
        )
        const eliminatedPlayers = prevRecord.data.players.filter(
            player => player.isEliminated
        )
        const currentTurn = prevRecord.data.turn

        return {
            activePlayers,
            eliminatedPlayers,
            setterId: activePlayers[currentTurn].id,
            completed: false,
        }
    }

    const getCurrentRound = (): { data: GameRecordRound; idx: number } => {
        const roundCount = gameRecord.current.data.rounds.length
        return {
            data: gameRecord.current.data.rounds[roundCount - 1],
            idx: roundCount - 1,
        }
    }

    const setGameRecord = (data: Partial<GameRecord>): void => {
        gameRecord.current = { ...gameRecord.current, ...data }
    }

    const setGameRecordData = (data: Partial<GameRecordData>): void => {
        gameRecord.current.data = { ...gameRecord.current.data, ...data }
    }

    const setGameRecordRound = (
        idx: number,
        data: Partial<GameRecordRound>
    ): void => {
        const prevRound = gameRecord.current.data.rounds[idx]
        gameRecord.current.data.rounds[idx] = { ...prevRound, ...data }
    }

    const init = async (letters: string, players: Player[]): Promise<void> => {
        setGameRecordData({ letters, players, turn: 0, rounds: [] })
        const rounds = [...gameRecord.current.data.rounds, initRound()]
        setGameRecordData({ rounds })
        await saveHistory()
    }

    const update = async (data: UpdateGameRecord): Promise<void> => {
        const { data: currentRound, idx } = getCurrentRound()

        const {
            type,
            status,
            nextTurn,
            trick,
            players,
            activePlayers,
            playerEliminated,
            winnerId,
            roundOver,
        } = data

        setGameRecordData({ turn: nextTurn })

        switch (`${type},${status}`) {
            case 'set,success':
                setGameRecordRound(idx, { trick })
                break
            case 'set,failed':
                const setterId = currentRound.activePlayers[nextTurn].id
                setGameRecordRound(idx, { setterId })
                break
            case 'copy,success':
                break
            case 'copy,failed':
                if (!players || !activePlayers) {
                    throw new Error(
                        `Invalid data: ${JSON.stringify(data, null, 4)}`
                    )
                }

                setGameRecordData({ players })
                setGameRecordRound(idx, { activePlayers })

                if (playerEliminated) {
                    const eliminatedPlayers = players.filter(
                        player => player.isEliminated
                    )
                    setGameRecordRound(idx, { eliminatedPlayers })
                }
                break
            default:
                throw new Error(
                    `Invalid data: ${JSON.stringify(data, null, 4)}`
                )
        }

        if (roundOver) {
            setGameRecordRound(idx, { completed: true })

            const gameOver = winnerId != null
            if (!gameOver) {
                const rounds = [...gameRecord.current.data.rounds, initRound()]
                setGameRecordData({ rounds })
            }
        }

        if (winnerId != null) {
            setGameRecordData({ winnerId })
            setGameRecord({ completed: true, completedAt: new Date() })
        }

        await saveHistory()
    }

    const value = { init, update }

    return (
        <GameRecordHandlerContext.Provider value={value}>
            {children}
        </GameRecordHandlerContext.Provider>
    )
}

export const useGameRecordHandlerContext = () => {
    const ctx = useContext(GameRecordHandlerContext)
    if (!ctx) {
        throw new Error('Missing GameRecordHandlerContext')
    }

    return ctx
}
