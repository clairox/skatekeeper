import { Button, FlatList, StyleSheet, View } from 'react-native'
import history from '../../lib/history'
import { useEffect, useMemo, useState } from 'react'
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
    const [hideIncomplete, setHideIncomplete] = useState(true)
    const filteredRecords = useMemo(() => {
        if (hideIncomplete) {
            return records.filter(record => record.completed)
        }

        return records
    }, [records, hideIncomplete])

    const toggleHideIncomplete = () => {
        setHideIncomplete(prev => !prev)
    }

    useEffect(() => {
        const fetchRecords = async () => {
            setRecords(await history.getRecords())
        }

        fetchRecords()
    }, [])

    if (records.length > 0) {
        return (
            <View style={styles.container}>
                <Button
                    title={
                        hideIncomplete ? 'Show Incomplete' : 'Hide Incomplete'
                    }
                    onPress={toggleHideIncomplete}
                />
                <FlatList
                    data={filteredRecords.map(record => {
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
                                <View style={{ height: 40 }}>
                                    <StyledText style={styles.text}>
                                        {item.title}
                                    </StyledText>
                                </View>
                            </Link>
                        )
                    }}
                    keyExtractor={item => item.id.toString()}
                    contentContainerStyle={styles.listContent}
                    style={styles.list}
                />
            </View>
        )
    }

    return <StyledText>Nothing here</StyledText>
}

export default GameHistory

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        gap: 14,
        marginBottom: 80,
        width: '100%',
    },
    listContent: {
        justifyContent: 'center',
        gap: 0,
        paddingTop: 10,
        width: '100%',
    },
    list: {
        paddingHorizontal: 10,
        width: '100%',
    },
    text: {
        fontSize: 16,
        textAlign: 'left',
    },
})
