import { Button, StyleSheet, View } from 'react-native'
import { useGameActions } from '../../context/GameContext'
import LettersDisplay from '../LettersDisplay'
import StyledText from '../ui/StyledText'
import StyledView from '../ui/StyledView'

type CopyingPhaseViewProps = {
    letters: string
    currentPlayer: Player
    currentTrick: string
}

const CopyingPhaseView: React.FC<CopyingPhaseViewProps> = ({
    letters,
    currentPlayer,
    currentTrick,
}) => {
    const { onPlayerCopySuccess, onPlayerCopyFailure } = useGameActions()

    const onCopySuccess = async () => {
        try {
            await onPlayerCopySuccess()
        } catch (err) {
            console.error(err)
        }
    }

    const onCopyFailure = async () => {
        try {
            await onPlayerCopyFailure()
        } catch (err) {
            console.error(err)
        }
    }

    return (
        <StyledView>
            <StyledText>Trick to copy: {currentTrick}</StyledText>
            <StyledText>{`${currentPlayer.name} it's your turn!`}</StyledText>
            <LettersDisplay
                letters={letters}
                totalPoints={currentPlayer.points}
            />
            <View style={[styles.actionRow, styles.actionButtonRow]}>
                <Button title="Missed" onPress={onCopyFailure} />
                <Button title="Landed" onPress={onCopySuccess} />
            </View>
        </StyledView>
    )
}

const styles = StyleSheet.create({
    actionRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    actionButtonRow: {
        gap: 40,
    },
})

export default CopyingPhaseView
