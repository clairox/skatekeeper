import {
    createContext,
    PropsWithChildren,
    useCallback,
    useContext,
    useState,
} from 'react'

const DEFAULT_LETTERS = 'SKATE'

type GameContextValue = {
    addPlayer: (name: string) => void
    completed: boolean
    currentPlayers: Player[]
    initLetters: (letters: string) => void
    letters: string
    nextTurn: () => void
    setCompleted: (completed: boolean) => void
    setCurrentPlayers: (players: Player[]) => void
    turn: number
}

const GameContext = createContext<GameContextValue>({
    addPlayer: () => {},
    completed: false,
    currentPlayers: [],
    initLetters: () => {},
    letters: DEFAULT_LETTERS,
    nextTurn: () => {},
    setCompleted: () => {},
    setCurrentPlayers: () => {},
    turn: 0,
})

type GameProviderProps = PropsWithChildren

export const GameProvider: React.FC<GameProviderProps> = ({ children }) => {
    const [currentPlayers, setCurrentPlayers] = useState<Player[]>([])
    const [letters, setLetters] = useState(DEFAULT_LETTERS)
    const [completed, setCompleted] = useState(false)
    const [turn, setTurn] = useState(0)

    const initLetters = useCallback((newLetters: string) => {
        setLetters(newLetters.toUpperCase())
    }, [])

    const addPlayer = useCallback((name: string) => {
        const newPlayer: Player = {
            name,
            points: 0,
            isEliminated: false,
        }

        setCurrentPlayers(prev => [...prev, newPlayer])
    }, [])

    const nextTurn = useCallback(() => {
        setTurn(prev => prev + 1)
    }, [])

    return (
        <GameContext.Provider
            value={{
                addPlayer,
                completed,
                currentPlayers,
                initLetters,
                letters,
                nextTurn,
                setCompleted,
                setCurrentPlayers,
                turn,
            }}
        >
            {children}
        </GameContext.Provider>
    )
}

export const useGame = () => useContext(GameContext)
