import { FlatList, StyleSheet, View } from 'react-native'
import history from '../../lib/history'
import { useEffect, useMemo, useState } from 'react'
import { Link } from 'expo-router'
import Text from '../../components/ui/primitives/Text'
import { formatDate } from '../../utils/helpers'
import PageHeader from '../../components/ui/PageHeader'

const HistoryPage = () => {
    const [records, setRecords] = useState<HistoryRecord[]>([])
    const [hideIncomplete, setHideIncomplete] = useState(true)
    const filteredRecords = useMemo(() => {
        if (hideIncomplete) {
            return records.filter(record => record.completed)
        }

        return records
    }, [records, hideIncomplete])

    const fetchRecords = async () => {
        setRecords(await history.getRecords())
    }

    useEffect(() => {
        fetchRecords()
    }, [])

    const options = [
        {
            title: hideIncomplete ? 'Show incomplete' : 'Hide incomplete',
            callback: () => {
                setHideIncomplete(prevHideIncomplete => !prevHideIncomplete)
            },
        },
        {
            title: 'Delete all incomplete',
            callback: async () => {
                await history.deleteIncompleteRecords()
                fetchRecords()
            },
        },
        {
            title: 'Clear history',
            callback: async () => {
                await history.clearHistory()
                fetchRecords()
            },
        },
    ]

    return (
        <View style={styles.container}>
            <PageHeader options={options} />
            {records.length > 0 ? (
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
                                    <Text style={styles.text}>
                                        {item.title}
                                    </Text>
                                </View>
                            </Link>
                        )
                    }}
                    keyExtractor={item => item.id.toString() + item.title}
                    contentContainerStyle={styles.listContent}
                    style={styles.list}
                />
            ) : (
                <Text>Nothing here</Text>
            )}
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
