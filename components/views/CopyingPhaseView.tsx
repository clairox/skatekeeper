import { Button, StyleSheet, Text, View } from 'react-native'
import { useGameActions } from '../../context/GameContext'
import LettersDisplay from '../LettersDisplay'

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

    return (
        <>
            <Text>Trick to copy: {currentTrick}</Text>
            <Text>{`${currentPlayer.name} it's your turn!`}</Text>
            <LettersDisplay
                letters={letters}
                totalPoints={currentPlayer.points}
            />
            <View style={[styles.actionRow, styles.actionButtonRow]}>
                <Button title="Missed" onPress={onPlayerCopyFailure} />
                <Button title="Landed" onPress={onPlayerCopySuccess} />
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    actionRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
    },
    actionButtonRow: {
        gap: 40,
    },
})

export default CopyingPhaseView
