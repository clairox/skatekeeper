import { FlatList, StyleSheet, View } from 'react-native'
import history from '../../lib/history'
import { useEffect, useMemo, useState } from 'react'
import { Link } from 'expo-router'
import StyledText from '../../components/ui/StyledText'
import { formatDate } from '../../utils/helpers'
import OverflowMenu from '../../components/ui/OverflowMenu'

const HistoryPage = () => {
    const [records, setRecords] = useState<HistoryRecord[]>([])
    const [hideIncomplete, setHideIncomplete] = useState(true)
    const filteredRecords = useMemo(() => {
        if (hideIncomplete) {
            return records.filter(record => record.completed)
        }

        return records
    }, [records, hideIncomplete])

    const toggleHideIncomplete = (): void => {
        setHideIncomplete(prev => !prev)
    }

    const deleteIncompleteRecords = async (): Promise<void> => {
        await history.deleteIncompleteRecords()
        fetchRecords()
    }

    const clearHistory = async (): Promise<void> => {
        await history.clearHistory()
        fetchRecords()
    }

    const fetchRecords = async () => {
        setRecords(await history.getRecords())
    }

    useEffect(() => {
        fetchRecords()
    }, [])

    if (records.length > 0) {
        return (
            <View style={styles.container}>
                <OverflowMenu
                    options={[
                        {
                            title: hideIncomplete
                                ? 'Show incomplete'
                                : 'Hide incomplete',
                            onPress: toggleHideIncomplete,
                        },
                        {
                            title: 'Delete all incomplete',
                            onPress: deleteIncompleteRecords,
                        },
                        {
                            title: 'Clear history',
                            onPress: clearHistory,
                        },
                    ]}
                />
                <FlatList
                    data={filteredRecords.map(record => {
                        const dateTimeString = formatDate(
                            new Date(record.createdAt)
                        )
                        return {
                            id: record.id,
                            title: `${dateTimeString}${record.completed ? '' : ' - Incomplete'}`,
                        }
                    })}
                    renderItem={({ item }) => {
                        return (
                            <Link href={`./history/${item.id}`}>
                                <View style={{ height: 40 }}>
                                    <StyledText style={styles.text}>
                                        {item.title}
                                    </StyledText>
                                </View>
                            </Link>
                        )
                    }}
                    keyExtractor={item => item.id.toString() + item.title}
                    contentContainerStyle={styles.listContent}
                    style={styles.list}
                />
            </View>
        )
    }

    return (
        <View style={styles.container}>
            <OverflowMenu
                options={[
                    {
                        title: hideIncomplete
                            ? 'Show Incomplete'
                            : 'Hide Incomplete',
                        onPress: toggleHideIncomplete,
                    },
                    {
                        title: 'Clear History',
                        onPress: clearHistory,
                    },
                ]}
            />
            <StyledText>Nothing here</StyledText>
        </View>
    )
}

export default HistoryPage

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
