import { useEffect, useRef } from 'react'
import history from '../lib/history'

const useHistoryRecord = (id?: string) => {
    const record = useRef<HistoryRecord | null>(null)

    useEffect(() => {
        if (id) {
            const fetchRecord = async () => {
                record.current = (await history.getRecord(id)) ?? null
            }

            fetchRecord()
        }
    }, [id])

    const saveHistory = async (): Promise<void> => {
        if (!record.current) {
            throw new Error('Cannot call saveHistory() record.current is null.')
        }

        history.updateRecord(id!, record.current)
    }

    const initRound = (): HistoryRound => {
        if (!record.current) {
            throw new Error(
                'Cannot call initRound() if record.current is null.'
            )
        }

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

    const getRecord = (): HistoryRecord => {
        if (!record.current) {
            throw new Error(
                'Cannot call getRecord() if record.current is null.'
            )
        }

        return record.current
    }

    const getCurrentRound = (): { data: HistoryRound; idx: number } => {
        if (!record.current) {
            throw new Error(
                'Cannot call getCurrentRound() if record.current is null.'
            )
        }

        const roundCount = record.current.data.rounds.length
        return {
            data: record.current.data.rounds[roundCount - 1],
            idx: roundCount - 1,
        }
    }

    const setRecord = (data: Partial<HistoryRecord>): void => {
        if (!record.current) {
            throw new Error(
                'Cannot call setRecord() if record.current is null.'
            )
        }

        record.current = { ...record.current, ...data }
    }

    const setRecordData = (data: Partial<HistoryData>): void => {
        if (!record.current) {
            throw new Error(
                'Cannot call setRecordData() if record.current is null.'
            )
        }

        record.current.data = { ...record.current.data, ...data }
    }

    const setRecordRound = (idx: number, data: Partial<HistoryRound>): void => {
        if (!record.current) {
            throw new Error(
                'Cannot call setRecordRound() if record.current is null.'
            )
        }

        const prevRound = record.current.data.rounds[idx]
        record.current.data.rounds[idx] = { ...prevRound, ...data }
    }
    const init = async (
        letters: string,
        players: Player[]
    ): Promise<HistoryRecord> => {
        console.log('Initializing record...')
        const newRecord = await history.addRecord({
            completed: false,
            data: {
                letters,
                turn: 0,
                players,
                rounds: [
                    {
                        activePlayers: players,
                        eliminatedPlayers: [],
                        completed: false,
                    },
                ],
            },
            createdAt: new Date(),
            completedAt: null,
        })

        record.current = newRecord
        return newRecord
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
                const rounds = [...getRecord().data.rounds, initRound()]
                setRecordData({ rounds })
            }
        }

        if (winnerId != null) {
            setRecordData({ winnerId })
            setRecord({ completed: true, completedAt: new Date() })
        }

        await saveHistory()
    }

    return { init, update }
}

export default useHistoryRecord
