import AsyncStorage from '@react-native-async-storage/async-storage'

const STORAGE_KEY = '@skatekeeper:history'

AsyncStorage.clear()

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

const addRecord = async (data: AddHistoryValues): Promise<HistoryRecord> => {
    const history = await getStoredHistory()
    const id = history.length > 0 ? history[history.length - 1].id + 1 : 0
    history.push({ ...data, id })
    await setStoredHistory(history)

    return history[history.length - 1]
}

const updateRecord = async (
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
    addRecord,
    updateRecord,
    getRecords,
    deleteRecord,
    deleteIncompleteRecords,
    clearHistory,
}
