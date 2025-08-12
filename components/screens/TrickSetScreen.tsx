import { useState } from 'react'
import { useGameContext } from '../../context/GameContext'
import LettersDisplay from '../ui/LettersDisplay'
import Text from '../ui/Text'
import StyledView from '../ui/StyledView'
import { StyleSheet, View } from 'react-native'
import { MenuTextButton } from '../ui/MenuButton'
import CloseableTextInput from '../ui/CloseableTextInput'

const TrickSetView = () => {
    const {
        state: { letters, currentPlayer },
        onTrickSetSuccess,
        onTrickSetFailure,
    } = useGameContext()

    const [trickLanded, setTrickLanded] = useState(false)

    return (
        <StyledView>
            <Text>{currentPlayer.name} sets the trick!</Text>
            <LettersDisplay
                letters={letters}
                totalPoints={currentPlayer.points}
            />
            {trickLanded ? (
                <CloseableTextInput
                    onSubmitEditing={event => {
                        const trick = event.nativeEvent.text
                        if (!trick) {
                            return
                        }

                        onTrickSetSuccess(trick)
                    }}
                    onClose={() => setTrickLanded(false)}
                    autoFocus
                />
            ) : (
                <View style={styles.buttonRow}>
                    <MenuTextButton onPress={onTrickSetFailure}>
                        Missed
                    </MenuTextButton>
                    <MenuTextButton onPress={() => setTrickLanded(true)}>
                        Landed
                    </MenuTextButton>
                </View>
            )}
        </StyledView>
    )
}

export default TrickSetView

const styles = StyleSheet.create({
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 40,
    },
})
