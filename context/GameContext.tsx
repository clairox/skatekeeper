import {
    createContext,
    useContext,
    useEffect,
    useReducer,
    useState,
} from 'react'
import history from '../lib/history'
import Spinner from '../components/ui/Spinner'
import { useRouter } from 'expo-router'
import { gameReducer } from '../lib/gameReducer'

type GameContextValue = {
    gameId?: number
    state: GameState & { currentPlayer: Player }
    setupGame: (letters: string, players: Player[]) => void
    onTrickSetSuccess: (trick: string) => void
    onTrickSetFailure: () => void
    onTrickCopySuccess: () => void
    onTrickCopyFailure: () => void
    reset: () => Promise<void>
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
    const [state, dispatch] = useReducer(gameReducer, {
        letters: '',
        players: [],
        activePlayers: [],
        turn: 0,
        currentTrick: null,
        setterId: null,
        winnerId: null,
    })

    const setupGame = async (
        letters: string,
        players: Player[]
    ): Promise<void> => {
        dispatch({ type: 'SETUP_GAME', payload: { letters, players } })
    }

    const onTrickSetSuccess = async (trick: string): Promise<void> => {
        dispatch({ type: 'TRICK_SET_SUCCESS', payload: { trick } })
    }

    const onTrickSetFailure = async (): Promise<void> => {
        dispatch({ type: 'TRICK_SET_FAILURE' })
    }

    const onTrickCopySuccess = async (): Promise<void> => {
        dispatch({ type: 'TRICK_COPY_SUCCESS' })
    }

    const onTrickCopyFailure = async (): Promise<void> => {
        dispatch({ type: 'TRICK_COPY_FAILURE' })
    }

    const reset = async (): Promise<void> => {
        dispatch({ type: 'RESET' })
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

                dispatch({
                    type: 'LOAD_GAME',
                    payload: {
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
                    },
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
                reset,
            }}
        >
            {children}
        </GameContext.Provider>
    )
}

export const useGameContext = () => useContext(GameContext)
