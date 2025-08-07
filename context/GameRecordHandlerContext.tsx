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
    historyIdx?: number
}>

export const GameRecordHandlerProvider: React.FC<
    GameRecordHandlerProviderProps
> = ({ children, historyIdx }) => {
    const gameRecord = useRef<GameRecord>({} as GameRecord)

    useEffect(() => {
        const init = async () => {
            const result = await (historyIdx
                ? history.getRecord(historyIdx)
                : history.newRecord())

            gameRecord.current = result
        }

        init()
        console.log('Initializing record...')
    }, [historyIdx])

    const saveHistory = async (): Promise<void> => {
        const idx = await (historyIdx ??
            history.getRecords().then(records => records.length - 1))
        history.saveRecord(idx, gameRecord.current)
    }

    const initRound = (): GameRecordRound => {
        const prevRecord = gameRecord.current
        const activePlayers = prevRecord.players.filter(
            player => !player.isEliminated
        )
        const eliminatedPlayers = prevRecord.players.filter(
            player => player.isEliminated
        )
        const currentTurn = prevRecord.turn

        return {
            activePlayers,
            eliminatedPlayers,
            setterId: activePlayers[currentTurn].id,
            completed: false,
        }
    }

    const getCurrentRound = (): { data: GameRecordRound; idx: number } => {
        const roundCount = gameRecord.current.rounds.length
        return {
            data: gameRecord.current.rounds[roundCount - 1],
            idx: roundCount - 1,
        }
    }

    const setGameRecord = (data: Partial<GameRecord>): void => {
        gameRecord.current = { ...gameRecord.current, ...data }
    }

    const setGameRecordRound = (
        idx: number,
        data: Partial<GameRecordRound>
    ): void => {
        const prevRound = gameRecord.current.rounds[idx]
        gameRecord.current.rounds[idx] = { ...prevRound, ...data }
    }

    const init = async (letters: string, players: Player[]): Promise<void> => {
        setGameRecord({ letters, players, turn: 0, rounds: [] })
        const rounds = [...gameRecord.current.rounds, initRound()]
        setGameRecord({ rounds })
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

        setGameRecord({ turn: nextTurn })

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

                setGameRecord({ players })
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
                const rounds = [...gameRecord.current.rounds, initRound()]
                setGameRecord({ rounds })
            }
        }

        if (winnerId != null) {
            setGameRecord({ winnerId })
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
