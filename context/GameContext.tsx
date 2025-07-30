import {
    createContext,
    PropsWithChildren,
    useCallback,
    useContext,
    useMemo,
    useState,
} from 'react'

const DEFAULT_LETTERS = 'SKATE'

// TODO: Save game data to history

type GameContextValue = {
    players: Player[]
    currentPlayer: Player
    activePlayers: Player[]
    setPlayers: (players: Player[]) => void
    setActivePlayers: (players: Player[]) => void
    addPlayer: (name: string) => void
    eliminatePlayer: (id: number) => void
    addPoint: (id: number) => number | undefined
    turn: number
    nextTurn: () => void
    letters: string
    initLetters: (letters: string) => void
    completed: boolean
    setCompleted: (completed: boolean) => void
    initGame: () => void
}

const GameContext = createContext<GameContextValue>({
    players: [],
    currentPlayer: {} as Player,
    activePlayers: [],
    setPlayers: () => {},
    setActivePlayers: () => {},
    addPlayer: () => {},
    eliminatePlayer: () => {},
    addPoint: () => undefined,
    turn: 0,
    nextTurn: () => {},
    initLetters: () => {},
    letters: DEFAULT_LETTERS,
    completed: false,
    setCompleted: () => {},
    initGame: () => {},
})

type GameProviderProps = PropsWithChildren

export const GameProvider: React.FC<GameProviderProps> = ({ children }) => {
    const [players, setPlayers] = useState<Player[]>([])
    const [activePlayers, setActivePlayers] = useState<Player[]>([])

    const [turn, setTurn] = useState(0)

    const [letters, setLetters] = useState(DEFAULT_LETTERS)

    const [completed, setCompleted] = useState(false)

    const [idCounter, setIdCounter] = useState(0)

    const currentPlayer = useMemo(
        () => activePlayers[turn],
        [activePlayers, turn]
    )

    const incrementIdCounter = () => setIdCounter(prev => prev + 1)

    const getActivePlayer = useCallback(
        (id: number): Player | undefined => {
            return activePlayers.find(player => player.id === id)
        },
        [activePlayers]
    )

    const addPlayer = useCallback(
        (name: string) => {
            const newPlayer: Player = {
                id: idCounter,
                name,
                points: 0,
                isEliminated: false,
            }

            setPlayers(prev => [...prev, newPlayer])
            incrementIdCounter()
        },
        [idCounter]
    )

    const eliminatePlayer = useCallback(
        (id: number) => {
            const player = getActivePlayer(id)
            if (!player) {
                return
            }

            setPlayers(prev => {
                return prev.map(_player => {
                    if (_player.id === id) {
                        return { ..._player, isEliminated: true }
                    }

                    return _player
                })
            })

            setActivePlayers(prev => {
                const updatedActivePlayers = prev.filter(
                    _player => _player.id !== id
                )
                if (turn >= updatedActivePlayers.length) {
                    setTurn(0)
                }

                return updatedActivePlayers
            })
        },
        [getActivePlayer, turn]
    )

    const addPoint = useCallback(
        (id: number): number | undefined => {
            const player = getActivePlayer(id)
            if (!player) {
                return undefined
            }

            const points = player.points + 1
            const updatedPlayer = { ...player, points }

            setActivePlayers(prev => {
                const updatedActivePlayers = prev.map(_player => {
                    if (_player.id === id) {
                        return updatedPlayer
                    }

                    return _player
                })
                return updatedActivePlayers
            })

            return points
        },
        [setActivePlayers, getActivePlayer]
    )

    const nextTurn = useCallback(() => {
        setTurn(prev => {
            const _turn = prev + 1
            if (_turn >= activePlayers.length) {
                return 0
            }

            return _turn
        })
    }, [activePlayers.length])

    const initLetters = useCallback((newLetters: string) => {
        setLetters(newLetters.toUpperCase())
    }, [])

    const initGame = useCallback(() => {
        setPlayers([])
        setActivePlayers([])
        setTurn(0)
        setLetters(DEFAULT_LETTERS)
        setCompleted(false)
        setIdCounter(0)
    }, [])

    return (
        <GameContext.Provider
            value={{
                players,
                currentPlayer,
                activePlayers,
                setPlayers,
                setActivePlayers,
                addPlayer,
                eliminatePlayer,
                addPoint,
                turn,
                nextTurn,
                letters,
                initLetters,
                completed,
                setCompleted,
                initGame,
            }}
        >
            {children}
        </GameContext.Provider>
    )
}

export const useGame = () => useContext(GameContext)
