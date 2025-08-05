import {
    createContext,
    PropsWithChildren,
    useContext,
    useEffect,
    useRef,
} from 'react'
import history from '../lib/history'

type GetPlayerReturn = {
    setTrickCopySuccess: () => Promise<void>
    setTrickCopyFailed: () => Promise<void>
    eliminate: () => Promise<void>
}

type CurrentRoundReturn = {
    completed: boolean
    getTrick: () => string | null
    setTrick: (trick: string, setterId: number) => Promise<void>
    getPlayer: (id: number) => GetPlayerReturn
    complete: () => Promise<void>
}
type GameRecordContextValue = {
    record: GameRecord
    setLetters: (letters: string) => Promise<void>
    setPlayers: (players: Player[]) => Promise<void>
    setTurn: (turn: number) => Promise<void>
    setWinnerId: (id: number) => Promise<void>
    initRound: () => Promise<void>
    currentRound: () => CurrentRoundReturn
}

const GameRecordContext = createContext<GameRecordContextValue>(
    {} as GameRecordContextValue
)

type GameRecordProviderProps = PropsWithChildren<{
    historyIdx?: number
}>

export const GameRecordProvider: React.FC<GameRecordProviderProps> = ({
    children,
    historyIdx,
}) => {
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

    const saveHistory = async () => {
        const idx = await (historyIdx ??
            history.getRecords().then(records => records.length + 1))
        history.saveRecord(idx, gameRecord.current)
    }

    const setLetters = async (letters: string) => {
        gameRecord.current.letters = letters
        await saveHistory()
    }

    const setPlayers = async (players: Player[]) => {
        gameRecord.current.players = players
        await saveHistory()
    }

    const setTurn = async (turn: number) => {
        gameRecord.current.turn = turn
        await saveHistory()
    }

    const setWinnerId = async (id: number) => {
        gameRecord.current.winnerId = id
        await saveHistory()
    }

    const initRound = async () => {
        const rounds = gameRecord.current.rounds

        const newRound: GameRecordRound = {
            activePlayers: gameRecord.current.players.filter(
                player => !player.isEliminated
            ),
            eliminatedPlayers: gameRecord.current.players.filter(
                player => player.isEliminated
            ),
            completed: false,
        }

        gameRecord.current.rounds = [...rounds, newRound]
        await saveHistory()
    }

    const currentRound = (): CurrentRoundReturn => {
        const rounds = gameRecord.current.rounds
        const roundCount = rounds.length

        if (gameRecord.current.rounds.length === 0) {
            return {
                completed: false,
                getTrick: () => null,
                setTrick: async () => {},
                getPlayer: () => ({
                    setTrickCopySuccess: async () => {},
                    setTrickCopyFailed: async () => {},
                    eliminate: async () => {},
                }),
                complete: async () => {},
            }
        }

        const current = gameRecord.current.rounds[roundCount - 1]

        const getTrick = () => current.trick ?? null

        const setTrick = async (trick: string, setterId: number) => {
            gameRecord.current.rounds[roundCount - 1] = {
                ...current,
                trick,
                setterId,
            }

            await saveHistory()
        }

        const getPlayer = (id: number): GetPlayerReturn => {
            const players = current.activePlayers

            const setTrickCopySuccess = async () => {
                gameRecord.current.rounds[roundCount - 1].activePlayers =
                    players.map(player => {
                        if (player.id === id) {
                            return { ...player, copied: true }
                        }

                        return player
                    })
            }

            const setTrickCopyFailed = async () => {
                gameRecord.current.rounds[roundCount - 1].activePlayers =
                    players.map(player => {
                        if (player.id === id) {
                            return {
                                ...player,
                                copied: false,
                                points: player.points + 1,
                            }
                        }

                        return player
                    })

                gameRecord.current.players = gameRecord.current.players.map(
                    player => {
                        if (player.id === id) {
                            return { ...player, points: player.points + 1 }
                        }

                        return player
                    }
                )

                await saveHistory()
            }

            const eliminate = async () => {
                const playerToEliminate = players.find(
                    player => player.id === id
                )
                if (!playerToEliminate) {
                    throw new Error(`Player with id ${id} does not exist.`)
                }

                gameRecord.current.rounds[roundCount - 1].activePlayers =
                    players.filter(player => player.id !== playerToEliminate.id)

                gameRecord.current.rounds[
                    roundCount - 1
                ].eliminatedPlayers.push({
                    ...playerToEliminate,
                    isEliminated: true,
                })

                gameRecord.current.players = gameRecord.current.players.map(
                    player => {
                        if (player.id === playerToEliminate.id) {
                            return { ...player, isEliminated: true }
                        }
                        return player
                    }
                )

                await saveHistory()
            }

            return {
                setTrickCopySuccess,
                setTrickCopyFailed,
                eliminate,
            }
        }

        const complete = async () => {
            gameRecord.current.rounds[roundCount - 1].completed = true

            await saveHistory()
        }

        return {
            completed: current.completed,
            getTrick,
            setTrick,
            getPlayer,
            complete,
        }
    }

    return (
        <GameRecordContext.Provider
            value={{
                record: gameRecord.current,
                setLetters,
                setPlayers,
                setTurn,
                setWinnerId,
                initRound,
                currentRound,
            }}
        >
            {children}
        </GameRecordContext.Provider>
    )
}

export const useGameRecordContext = () => {
    const ctx = useContext(GameRecordContext)
    if (!ctx) {
        throw new Error('Missing GameRecordContext')
    }

    return ctx
}
