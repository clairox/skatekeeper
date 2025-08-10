import AsyncStorage from '@react-native-async-storage/async-storage'

const STORAGE_KEY = '@skatekeeper:history'

const getStoredHistory = async (): Promise<HistoryRecord[]> => {
    const value = await AsyncStorage.getItem(STORAGE_KEY)
    if (value) {
        return JSON.parse(value)
    }

    return []
}

const setStoredHistory = async (value: HistoryRecord[]) => {
    try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(value))
    } catch (error) {
        console.error(`There was an error setting history: ${error}`)
    }
}

const getRecord = async (id: number): Promise<HistoryRecord | undefined> => {
    const history = (await getStoredHistory()) as HistoryRecord[]
    return history.find(record => record.id === id)
}

const newRecord = async (): Promise<HistoryRecord> => {
    const history = (await getStoredHistory()) as HistoryRecord[]
    history.push({
        id: history.length,
        completed: false,
        data: {
            turn: 0,
            players: [],
            rounds: [],
        },
        createdAt: new Date(),
        completedAt: null,
    })
    await setStoredHistory(history)

    const recordCount = history.length
    return history[recordCount - 1]
}

const saveRecord = async (
    idx: number,
    record: HistoryRecord
): Promise<void> => {
    const history = await getStoredHistory()
    history[idx] = record
    await setStoredHistory(history)
}

const getRecords = async (): Promise<HistoryRecord[]> => {
    return await getStoredHistory()
}

const deleteRecord = async (id: number): Promise<void> => {
    const history = await getStoredHistory()
    await setStoredHistory(history.filter(record => record.id !== id))
}

const deleteIncompleteRecords = async (): Promise<void> => {
    const history = await getStoredHistory()
    await setStoredHistory(history.filter(record => record.completed))
}

const clearHistory = async (): Promise<void> => {
    await setStoredHistory([])
}

export default {
    getRecord,
    newRecord,
    saveRecord,
    getRecords,
    deleteRecord,
    deleteIncompleteRecords,
    clearHistory,
}
