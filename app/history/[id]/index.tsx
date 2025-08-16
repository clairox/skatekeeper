import { Link, useLocalSearchParams, useRouter } from 'expo-router'
import { useEffect, useState } from 'react'
import history from '../../../lib/history'
import { FlatList, View } from 'react-native'
import Text from '../../../components/ui/Text'
import { formatDate } from '../../../utils/helpers'
import PageHeader from '../../../components/ui/PageHeader'

const HistoryEntryPage = () => {
    const router = useRouter()
    const { id } = useLocalSearchParams() as { id: string }

    const [record, setRecord] = useState<HistoryRecord | null>(null)
    const continueGame = (): void => {
        router.push({ pathname: '/game', params: { id } })
    }

    const deleteRecord = async (): Promise<void> => {
        await history.deleteRecord(id)
        router.replace('/history')
    }

    const menuOptions = record?.completed
        ? [{ title: 'Delete', callback: deleteRecord }]
        : [
              { title: 'Continue game', callback: continueGame },
              { title: 'Delete', callback: deleteRecord },
          ]

    useEffect(() => {
        const fetchRecord = async () => {
            try {
                const result = await history.getRecord(id)
                if (!result) {
                    throw new Error(`Record with id ${id} does not exist.`)
                }

                setRecord({
                    ...result,
                    createdAt: new Date(result.createdAt),
                    completedAt: result.completedAt
                        ? new Date(result.completedAt)
                        : null,
                })
            } catch (err) {
                throw new Error(`An unexpected error has occurred: ${err}`)
            }
        }

        fetchRecord()
    }, [id])

    if (record) {
        return (
            <View>
                <PageHeader options={menuOptions} />
                <Text>
                    {formatDate(record.createdAt)}
                    {!record.completed && ' - Incomplete'}
                </Text>
                {record.data.winnerId != null && (
                    <Text>
                        Winner:{' '}
                        {
                            record.data.players.find(
                                player => player.id === record.data.winnerId
                            )!.name
                        }
                    </Text>
                )}
                <Text>Players:</Text>
                <FlatList
                    data={record.data.players}
                    renderItem={({ item }) => {
                        return <Text>{item.name}</Text>
                    }}
                    keyExtractor={item => item.id.toString()}
                />
                <Link href={`./${id}/recap`}>
                    <Text>{'Go to recap ->'}</Text>
                </Link>
            </View>
        )
    }

    return <View></View>
}

export default HistoryEntryPage
