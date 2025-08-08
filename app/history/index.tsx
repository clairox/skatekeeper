import { FlatList, StyleSheet } from 'react-native'
import history from '../../lib/history'
import { useEffect, useState } from 'react'
import { Link } from 'expo-router'
import StyledText from '../../components/ui/StyledText'

const localStringOptions: Intl.DateTimeFormatOptions = {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
}

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
                    const dateTimeString = new Date(
                        record.createdAt
                    ).toLocaleString('en-US', localStringOptions)
                    return {
                        id: record.id,
                        title: `${dateTimeString}${record.completed ? '' : ' - Incomplete'}`,
                    }
                })}
                renderItem={({ item }) => {
                    return (
                        <Link href={`./${item.id}`}>
                            <StyledText style={styles.text}>
                                {item.title}
                            </StyledText>
                        </Link>
                    )
                }}
                keyExtractor={item => item.id.toString()}
                contentContainerStyle={styles.container}
            />
        )
    }

    return <StyledText>Nothing here</StyledText>
}

export default GameHistory

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        gap: 20,
        marginVertical: 30,
    },
    text: {
        fontSize: 14,
        textAlign: 'left',
    },
})
