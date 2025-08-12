import { StyleSheet, View } from 'react-native'
import { useGameContext } from '../../context/GameContext'
import LetterProgress from '../ui/LetterProgress'
import Text from '../ui/Text'
import CompactView from '../ui/CompactView'
import TextButton from '../ui/TextButton'

const TrickCopyView = () => {
    const {
        state: { letters, currentPlayer, currentTrick },
        onTrickCopySuccess,
        onTrickCopyFailure,
    } = useGameContext()

    return (
        <CompactView>
            <Text>Trick to copy: {currentTrick}</Text>
            <Text>{`${currentPlayer.name} it's your turn!`}</Text>
            <LetterProgress
                letters={letters}
                totalPoints={currentPlayer.points}
            />
            <View style={styles.buttonRow}>
                <TextButton onPress={onTrickCopyFailure}>Missed</TextButton>
                <TextButton onPress={onTrickCopySuccess}>Landed</TextButton>
            </View>
        </CompactView>
    )
}

export default TrickCopyView

const styles = StyleSheet.create({
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 40,
    },
})
