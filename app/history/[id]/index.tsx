import { Link, useLocalSearchParams, useRouter } from 'expo-router'
import { useEffect, useState } from 'react'
import history from '../../../lib/history'
import { FlatList, View } from 'react-native'
import StyledText from '../../../components/ui/StyledText'
import { formatDate } from '../../../utils/helpers'
import OverflowMenu from '../../../components/ui/OverflowMenu'

const HistoryEntryPage = () => {
    const router = useRouter()
    const { id } = useLocalSearchParams() as { id: string }

    const [record, setRecord] = useState<HistoryRecord | null>(null)

    const deleteRecord = async (): Promise<void> => {
        await history.deleteRecord(parseInt(id))
        router.replace('/history')
    }

    useEffect(() => {
        const fetchRecord = async () => {
            try {
                const result = await history.getRecord(parseInt(id))
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
                <OverflowMenu
                    options={[{ title: 'Delete', onPress: deleteRecord }]}
                />
                <StyledText>{formatDate(record.createdAt)}</StyledText>
                {record.data.winnerId != null && (
                    <StyledText>
                        Winner:{' '}
                        {
                            record.data.players.find(
                                player => player.id === record.data.winnerId
                            )!.name
                        }
                    </StyledText>
                )}
                <StyledText>Players:</StyledText>
                <FlatList
                    data={record.data.players}
                    renderItem={({ item }) => {
                        return <StyledText>{item.name}</StyledText>
                    }}
                    keyExtractor={item => item.id.toString()}
                />
                <Link href={`./${id}/recap`}>
                    <StyledText>{'Go to recap ->'}</StyledText>
                </Link>
            </View>
        )
    }

    return <View></View>
}

export default HistoryEntryPage
