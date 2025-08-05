import AsyncStorage from '@react-native-async-storage/async-storage'

const STORAGE_KEY = '@skatekeeper:history'

const getStoredHistory = async () => {
    const value = await AsyncStorage.getItem(STORAGE_KEY)
    if (value) {
        return JSON.parse(value)
    }

    return []
}

const setStoredHistory = async (value: GameRecord[]) => {
    try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(value))
    } catch (error) {
        console.error(`There was an error setting history: ${error}`)
    }
}

const getRecord = async (idx: number): Promise<GameRecord> => {
    const history = await getStoredHistory()
    return history[idx]
}

const newRecord = async (): Promise<GameRecord> => {
    const history = await getStoredHistory()
    history.push({
        turn: 0,
        players: [],
        rounds: [],
    })
    await setStoredHistory(history)

    const recordCount = history.length
    return history[recordCount - 1]
}

const saveRecord = async (idx: number, record: GameRecord): Promise<void> => {
    const history = await getStoredHistory()
    history[idx] = record
    await setStoredHistory(history)
    // console.log(JSON.stringify(history[idx], null, 4))
}

const getRecords = async (): Promise<GameRecord[]> => {
    return await getStoredHistory()
}

export default {
    getRecord,
    newRecord,
    saveRecord,
    getRecords,
}
