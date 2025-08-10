import { useEffect, useRef, useState } from 'react'
import { useGameActions } from '../../context/GameContext'
import { BackHandler, StyleSheet, TextInput, View } from 'react-native'
import LettersDisplay from '../ui/LettersDisplay'
import StyledText from '../ui/StyledText'
import StyledView from '../ui/StyledView'
import { MenuTextButton } from '../ui/MenuButton'

type SettingPhaseProps = {
    letters: string
    currentPlayer: Player
}

const SettingPhaseView: React.FC<SettingPhaseProps> = ({
    letters,
    currentPlayer,
}) => {
    const { onPlayerSetSuccess, onPlayerSetFailure } = useGameActions()

    const onSetSuccess = async (trick: string) => {
        try {
            await onPlayerSetSuccess(trick)
        } catch (err) {
            console.error(err)
        }
    }

    const onSetFailure = async () => {
        try {
            await onPlayerSetFailure()
        } catch (err) {
            console.error(err)
        }
    }

    return (
        <StyledView>
            <StyledText>{currentPlayer.name} sets the trick!</StyledText>
            <LettersDisplay
                letters={letters}
                totalPoints={currentPlayer.points}
            />
            <ActionRow onSetSuccess={onSetSuccess} onSetFailed={onSetFailure} />
        </StyledView>
    )
}

type ActionRowProps = {
    onSetSuccess: (trick: string) => void
    onSetFailed: () => void
}

const ActionRow: React.FC<ActionRowProps> = ({ onSetSuccess, onSetFailed }) => {
    const [actionRow, setActionRow] = useState(<></>)

    const actionButtonRow = useRef(
        <View style={[styles.actionRow, styles.actionButtonRow]}>
            <MenuTextButton onPress={onSetFailed}>Missed</MenuTextButton>
            <MenuTextButton
                onPress={() => setActionRow(actionInputRow.current)}
            >
                Landed
            </MenuTextButton>
        </View>
    )

    const actionInputRow = useRef(
        <ActionInputRow
            onSetSuccess={onSetSuccess}
            close={() => setActionRow(actionButtonRow.current)}
        />
    )

    useEffect(() => {
        setActionRow(actionButtonRow.current)
    }, [])

    return actionRow
}

type ActionInputRowProps = {
    onSetSuccess: (trick: string) => void
    close: () => void
}

const ActionInputRow: React.FC<ActionInputRowProps> = ({
    onSetSuccess,
    close,
}) => {
    useEffect(() => {
        const onBackPress = () => {
            close()
            return true
        }
        const backHandler = BackHandler.addEventListener(
            'hardwareBackPress',
            onBackPress
        )

        return () => backHandler.remove()
    }, [close])

    return (
        <View style={[styles.actionRow, styles.actionInputRow]}>
            <TextInput
                onSubmitEditing={event => {
                    const trick = event.nativeEvent.text
                    if (!trick) {
                        return
                    }

                    onSetSuccess(trick)
                }}
                autoFocus
                style={styles.trickInput}
            />
            <MenuTextButton onPress={close}>x</MenuTextButton>
        </View>
    )
}

export default SettingPhaseView

const styles = StyleSheet.create({
    actionRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    actionButtonRow: {
        gap: 40,
    },
    actionInputRow: {
        gap: 10,
    },
    trickInput: {
        width: '80%',
        borderWidth: 1,
    },
})
