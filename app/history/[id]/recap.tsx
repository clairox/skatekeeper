import { useLocalSearchParams, useRouter } from 'expo-router'
import { useEffect, useState } from 'react'
import { View, StyleSheet, FlatList, Button } from 'react-native'
import history from '../../../lib/history'
import StyledText from '../../../components/ui/StyledText'
import LettersDisplay from '../../../components/ui/LettersDisplay'

const HistoryEntryRecapPage = () => {
    const router = useRouter()
    const { id } = useLocalSearchParams() as { id: string }

    const [rounds, setRounds] = useState<HistoryRound[]>([])
    const [letters, setLetters] = useState('')

    useEffect(() => {
        const fetchRounds = async () => {
            try {
                const result = await history.getRecord(parseInt(id))
                if (!result) {
                    throw new Error(`Record with id ${id} does not exist.`)
                }

                setRounds(result.data.rounds)
                setLetters(result.data.letters!)
            } catch (err) {
                throw new Error(`An unexpected error has occurred: ${err}`)
            }
        }

        fetchRounds()
    }, [id])

    return (
        <View style={styles.container}>
            <FlatList
                data={rounds}
                keyExtractor={(item, index) =>
                    index.toString() + (item.trick ?? 'inc')
                }
                renderItem={({ item: round, index }) => (
                    <View style={styles.roundContainer}>
                        <View style={styles.roundHeader}>
                            <StyledText
                                style={styles.roundHeaderText}
                            >{`${index + 1}: ${Boolean(round.trick && round.completed) ? round.trick : 'Incomplete'}`}</StyledText>
                            {!round.completed && (
                                <Button
                                    title="Continue"
                                    onPress={() =>
                                        router.push({
                                            pathname: '/game',
                                            params: { id },
                                        })
                                    }
                                />
                            )}
                        </View>
                        {round.activePlayers.map((player, idx) => {
                            return (
                                <View key={`${id}${player.id}`}>
                                    <StyledText>
                                        {player.name}
                                        {player.id === round.setterId &&
                                            ' - Setter'}
                                    </StyledText>
                                    <LettersDisplay
                                        letters={letters}
                                        totalPoints={player.points}
                                    />
                                </View>
                            )
                        })}
                        {round.eliminatedPlayers.map((player, idx) => {
                            return (
                                <View key={`${id}${player.id}`}>
                                    <StyledText>
                                        {player.name} - Eliminated
                                    </StyledText>
                                    <LettersDisplay
                                        letters={letters}
                                        totalPoints={player.points}
                                    />
                                </View>
                            )
                        })}
                    </View>
                )}
            ></FlatList>
        </View>
    )
}

export default HistoryEntryRecapPage

const styles = StyleSheet.create({
    container: {
        marginBottom: 80,
    },
    roundContainer: {
        justifyContent: 'flex-start',
        borderBottomWidth: 1,
        textAlign: 'left',
    },
    roundHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    roundHeaderText: {
        fontSize: 26,
        textAlign: 'left',
        textDecorationLine: 'underline',
    },
})
