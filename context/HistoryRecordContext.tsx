import {
    createContext,
    PropsWithChildren,
    useContext,
    useEffect,
    useRef,
} from 'react'
import history from '../lib/history'

const HistoryRecordContext = createContext<HistoryRecordHandler>(
    {} as HistoryRecordHandler
)

type HistoryRecordProviderProps = PropsWithChildren<{
    recordId?: number
}>

export const HistoryRecordProvider: React.FC<HistoryRecordProviderProps> = ({
    children,
    recordId,
}) => {
    const record = useRef<HistoryRecord>({} as HistoryRecord)

    useEffect(() => {
        const init = async () => {
            const result = await (recordId
                ? (history.getRecord(recordId) ?? history.newRecord())
                : history.newRecord())

            record.current = result!
        }

        init()
        console.log('Initializing record...')
    }, [recordId])

    const saveHistory = async (): Promise<void> => {
        const idx = await (recordId ??
            history.getRecords().then(records => records.length - 1))
        history.saveRecord(idx, record.current)
    }

    const initRound = (): HistoryRound => {
        const prevRecord = record.current
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

    const getCurrentRound = (): { data: HistoryRound; idx: number } => {
        const roundCount = record.current.data.rounds.length
        return {
            data: record.current.data.rounds[roundCount - 1],
            idx: roundCount - 1,
        }
    }

    const setRecord = (data: Partial<HistoryRecord>): void => {
        record.current = { ...record.current, ...data }
    }

    const setRecordData = (data: Partial<HistoryData>): void => {
        record.current.data = { ...record.current.data, ...data }
    }

    const setRecordRound = (idx: number, data: Partial<HistoryRound>): void => {
        const prevRound = record.current.data.rounds[idx]
        record.current.data.rounds[idx] = { ...prevRound, ...data }
    }

    const init = async (letters: string, players: Player[]): Promise<void> => {
        setRecordData({ letters, players, turn: 0, rounds: [] })
        const rounds = [...record.current.data.rounds, initRound()]
        setRecordData({ rounds })
        await saveHistory()
    }

    const update = async (data: UpdateHistoryValues): Promise<void> => {
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

        setRecordData({ turn: nextTurn })

        switch (`${type},${status}`) {
            case 'set,success':
                setRecordRound(idx, { trick })
                break
            case 'set,failed':
                const setterId = currentRound.activePlayers[nextTurn].id
                setRecordRound(idx, { setterId })
                break
            case 'copy,success':
                break
            case 'copy,failed':
                if (!players || !activePlayers) {
                    throw new Error(
                        `Invalid data: ${JSON.stringify(data, null, 4)}`
                    )
                }

                setRecordData({ players })
                setRecordRound(idx, { activePlayers })

                if (playerEliminated) {
                    const eliminatedPlayers = players.filter(
                        player => player.isEliminated
                    )
                    setRecordRound(idx, { eliminatedPlayers })
                }
                break
            default:
                throw new Error(
                    `Invalid data: ${JSON.stringify(data, null, 4)}`
                )
        }

        if (roundOver) {
            setRecordRound(idx, { completed: true })

            const gameOver = winnerId != null
            if (!gameOver) {
                const rounds = [...record.current.data.rounds, initRound()]
                setRecordData({ rounds })
            }
        }

        if (winnerId != null) {
            setRecordData({ winnerId })
            setRecord({ completed: true, completedAt: new Date() })
        }

        await saveHistory()
    }

    const value = { init, update }

    return (
        <HistoryRecordContext.Provider value={value}>
            {children}
        </HistoryRecordContext.Provider>
    )
}

export const useHistoryRecordContext = () => {
    const ctx = useContext(HistoryRecordContext)
    if (!ctx) {
        throw new Error('Missing HistoryRecordContext')
    }

    return ctx
}
