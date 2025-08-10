import { createContext, PropsWithChildren, useContext, useRef } from 'react'
import { createGameStore, GameState } from '../store'
import { StoreApi, useStore } from 'zustand'
import { useHistoryRecordContext } from './HistoryRecordContext'

type GameStore = StoreApi<GameState>
const GameContext = createContext<GameStore>({} as GameStore)

type GameProviderProps = PropsWithChildren
export const GameProvider: React.FC<GameProviderProps> = ({ children }) => {
    const recordHandler = useHistoryRecordContext()
    const storeRef = useRef<GameStore>({} as GameStore)
    if (Object.keys(storeRef.current).length === 0) {
        storeRef.current = createGameStore(recordHandler)
    }

    return (
        <GameContext.Provider value={storeRef.current}>
            {children}
        </GameContext.Provider>
    )
}

function useGameStore<T>(selector: (state: GameState) => T): T {
    const store = useContext(GameContext)
    if (!store) {
        throw new Error('Missing GameStoreContext')
    }

    return useStore(store, selector)
}

export const useLetters = () => useGameStore(state => state.letters)
export const usePlayers = () => useGameStore(state => state.players)
export const useActivePlayers = () => useGameStore(state => state.activePlayers)
export const useSetterId = () => useGameStore(state => state.setterId)
export const useCurrentTrick = () => useGameStore(state => state.currentTrick)
export const useTurn = () => useGameStore(state => state.turn)
export const useWinnerId = () => useGameStore(state => state.winnerId)

export const useEliminatedPlayers = () => {
    const players = useGameStore(state => state.players)
    return players.filter(player => player.isEliminated)
}

export const useGameActions = () => useGameStore(state => state.actions)
