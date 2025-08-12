import { useState } from 'react'
import { useGameContext } from '../../context/GameContext'
import LetterProgress from '../ui/LetterProgress'
import Text from '../ui/Text'
import CompactView from '../ui/CompactView'
import { StyleSheet, View } from 'react-native'
import TextButton from '../ui/TextButton'
import CloseableTextInput from '../ui/CloseableTextInput'

const TrickSetView = () => {
    const {
        state: { letters, currentPlayer },
        onTrickSetSuccess,
        onTrickSetFailure,
    } = useGameContext()

    const [trickLanded, setTrickLanded] = useState(false)

    return (
        <CompactView>
            <Text>{currentPlayer.name} sets the trick!</Text>
            <LetterProgress
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
                    <TextButton onPress={onTrickSetFailure}>Missed</TextButton>
                    <TextButton onPress={() => setTrickLanded(true)}>
                        Landed
                    </TextButton>
                </View>
            )}
        </CompactView>
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
