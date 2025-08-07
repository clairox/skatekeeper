import { FlatList, StyleSheet, Text } from 'react-native'
import history from '../../lib/history'
import { useEffect, useState } from 'react'
import { Link } from 'expo-router'

const GameHistory = () => {
    const [records, setRecords] = useState<GameRecord[]>([])

    useEffect(() => {
        const fetchRecords = async () => {
            setRecords(await history.getRecords())
        }

        fetchRecords()
    }, [])

    if (records.length > 0) {
        return (
            <FlatList
                data={records.map(record => {
                    return {
                        id: record.id,
                        title: `${new Date(record.createdAt).toDateString()} ${new Date(record.createdAt).toTimeString()}${record.completed ? '' : ' - Incomplete'}`,
                    }
                })}
                renderItem={({ item }) => {
                    return (
                        <Link href={`./${item.id}`}>
                            <Text style={styles.text}>{item.title}</Text>
                        </Link>
                    )
                }}
                keyExtractor={item => item.id.toString()}
                contentContainerStyle={styles.container}
            />
        )
    }

    return <Text>Nothing here</Text>
}

export default GameHistory

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        gap: 20,
        marginVertical: 30,
    },
    text: {
        fontSize: 20,
    },
})
