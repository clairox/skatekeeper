import { createContext, PropsWithChildren, useContext, useState } from 'react'
import { createStore, StoreApi, useStore } from 'zustand'

type GameState = {
    letters: string
    players: Player[]
    turn: number
    actions: GameStateActions
}

type GameStateActions = {
    initLetters: (newLetters: string) => void
    initPlayers: (players: Player[]) => void
    eliminatePlayer: (id: number) => void
    shufflePlayers: () => void
    addPoint: (id: number) => number
    nextTurn: () => void
}

type GameStateStoreApi = StoreApi<GameState>

const GameStoreContext = createContext<GameStateStoreApi>(
    {} as GameStateStoreApi
)

type GameStoreProviderProps = PropsWithChildren

export const GameStoreProvider: React.FC<GameStoreProviderProps> = ({
    children,
}) => {
    const [store] = useState(() =>
        createStore<GameState>((set, get) => ({
            letters: '',
            turn: 0,
            players: [],
            actions: {
                initLetters: letters => {
                    set({ letters: letters.toUpperCase() })
                    console.log(
                        `Letters initialized to ${letters.toUpperCase()}.`
                    )
                },
                initPlayers: players => {
                    set({ players })
                    console.log(`Player list initialized.`)
                },
                eliminatePlayer: id =>
                    set(state => ({
                        players: state.players.map((player, idx) => {
                            if (idx > 0) {
                                set({ turn: state.turn - 1 })
                            }
                            if (player.id === id) {
                                return { ...player, isEliminated: true }
                            }

                            return player
                        }),
                    })),
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
                addPoint: id => {
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

                    return newPoints
                },
                nextTurn: () => {
                    const nextTurn = get().turn + 1
                    const activePlayers = get().players.filter(
                        player => !player.isEliminated
                    )

                    set(() => ({
                        turn: nextTurn >= activePlayers.length ? 0 : nextTurn,
                    }))
                },
            },
        }))
    )

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

export const useActivePlayers = () => {
    const players = useGameStore(state => state.players)
    return players.filter(player => !player.isEliminated)
}
export const useEliminatedPlayers = () => {
    const players = useGameStore(state => state.players)
    return players.filter(player => player.isEliminated)
}

export const useGameActions = () => useGameStore(state => state.actions)
