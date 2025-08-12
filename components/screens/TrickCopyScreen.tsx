import { StyleSheet, View } from 'react-native'
import { useGameContext } from '../../context/GameContext'
import LettersDisplay from '../ui/LettersDisplay'
import Text from '../ui/Text'
import StyledView from '../ui/StyledView'
import { MenuTextButton } from '../ui/MenuButton'

const TrickCopyView = () => {
    const {
        state: { letters, currentPlayer, currentTrick },
        onTrickCopySuccess,
        onTrickCopyFailure,
    } = useGameContext()

    return (
        <StyledView>
            <Text>Trick to copy: {currentTrick}</Text>
            <Text>{`${currentPlayer.name} it's your turn!`}</Text>
            <LettersDisplay
                letters={letters}
                totalPoints={currentPlayer.points}
            />
            <View style={styles.buttonRow}>
                <MenuTextButton onPress={onTrickCopyFailure}>
                    Missed
                </MenuTextButton>
                <MenuTextButton onPress={onTrickCopySuccess}>
                    Landed
                </MenuTextButton>
            </View>
        </StyledView>
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
