import {
    createContext,
    PropsWithChildren,
    useContext,
    useEffect,
    useState,
} from 'react'
import { createStore, StoreApi, useStore } from 'zustand'
import { useGameRecordContext } from './GameRecordContext'

type GameState = {
    letters: string
    players: Player[]
    turn: number
    loading: boolean
    actions: GameStateActions
}

type GameStateActions = {
    initLetters: (newLetters: string) => Promise<void>
    initPlayers: (players: Player[]) => Promise<void>
    eliminatePlayer: (id: number) => Promise<void>
    shufflePlayers: () => void
    addPoint: (id: number) => Promise<number>
    nextTurn: () => Promise<void>
    setIsLoading: (value: boolean) => void
}

type GameStateStoreApi = StoreApi<GameState>

const GameStoreContext = createContext<GameStateStoreApi>(
    {} as GameStateStoreApi
)

type GameStoreProviderProps = PropsWithChildren

export const GameStoreProvider: React.FC<GameStoreProviderProps> = ({
    children,
}) => {
    const gameRecord = useGameRecordContext()

    const [store] = useState(() =>
        createStore<GameState>((set, get) => ({
            letters: '',
            turn: 0,
            players: [],
            loading: false,
            actions: {
                initLetters: async letters => {
                    set({ letters: letters.toUpperCase() })
                    console.log(
                        `Letters initialized to ${letters.toUpperCase()}.`
                    )

                    await gameRecord.setLetters(letters.toUpperCase())
                },
                initPlayers: async players => {
                    set({ players })
                    console.log(`Player list initialized.`)

                    await gameRecord.setPlayers(players)
                },
                eliminatePlayer: async id => {
                    set(state => ({
                        players: state.players.map((player, idx) => {
                            if (player.id === id) {
                                return {
                                    ...player,
                                    isEliminated: true,
                                }
                            }

                            return player
                        }),
                    }))
                    await gameRecord.currentRound().getPlayer(id).eliminate()

                    const turn = get().turn
                    const players = get().players.filter(
                        player => !player.isEliminated
                    )
                    if (turn >= players.length) {
                        set({ turn: 0 })
                        await gameRecord.setTurn(0)
                    }
                },
                shufflePlayers: () =>
                    set(state => {
                        console.log('Shuffling players...')

                        let shuffledPlayers = [...state.players]

                        let currentIdx = shuffledPlayers.length
                        while (currentIdx > 0) {
                            let randomIdx = Math.floor(
                                Math.random() * currentIdx
                            )
                            currentIdx -= 1
                            ;[
                                shuffledPlayers[currentIdx],
                                shuffledPlayers[randomIdx],
                            ] = [
                                shuffledPlayers[randomIdx],
                                shuffledPlayers[currentIdx],
                            ]
                        }

                        return { players: shuffledPlayers }
                    }),
                addPoint: async id => {
                    const players = get().players
                    const points = players.find(
                        player => player.id === id
                    )?.points

                    if (points == null) {
                        throw new Error(`Player with id ${id} does not exist`)
                    }

                    const newPoints = points + 1

                    set(state => ({
                        players: state.players.map(player => {
                            if (player.id === id) {
                                return { ...player, points: newPoints }
                            }

                            return player
                        }),
                    }))

                    await gameRecord
                        .currentRound()
                        .getPlayer(id)
                        .setTrickCopyFailed()

                    return newPoints
                },
                nextTurn: async () => {
                    let nextTurn = get().turn + 1
                    const activePlayers = get().players.filter(
                        player => !player.isEliminated
                    )

                    if (nextTurn >= activePlayers.length) {
                        set({ turn: 0 })
                        console.log('turn@nextTurn:', 0)
                        await gameRecord.setTurn(0)
                    } else {
                        set({ turn: nextTurn })
                        console.log('turn@nextTurn:', nextTurn)
                        await gameRecord.setTurn(nextTurn)
                    }
                },
                setIsLoading: value => set({ loading: value }),
            },
        }))
    )

    useEffect(() => {
        console.log('Initializing game store...')
    }, [])

    return (
        <GameStoreContext.Provider value={store}>
            {children}
        </GameStoreContext.Provider>
    )
}

function useGameStore<T>(selector: (state: GameState) => T): T {
    const store = useContext(GameStoreContext)
    if (!store) {
        throw new Error('Missing GameStoreContext')
    }

    return useStore(store, selector)
}

export const useLetters = () => useGameStore(state => state.letters)
export const usePlayers = () => useGameStore(state => state.players)
export const useTurn = () => useGameStore(state => state.turn)
export const useIsLoading = () => useGameStore(state => state.loading)

export const useActivePlayers = () => {
    const players = useGameStore(state => state.players)
    return players.filter(player => !player.isEliminated)
}
export const useEliminatedPlayers = () => {
    const players = useGameStore(state => state.players)
    return players.filter(player => player.isEliminated)
}

export const useGameActions = () => useGameStore(state => state.actions)
