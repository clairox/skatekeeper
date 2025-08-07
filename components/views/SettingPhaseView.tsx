import { useEffect, useRef, useState } from 'react'
import { useGameActions } from '../../context/GameContext'
import {
    BackHandler,
    Button,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native'
import LettersDisplay from '../LettersDisplay'

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
        <>
            <Text>{currentPlayer.name} sets the trick!</Text>
            <LettersDisplay
                letters={letters}
                totalPoints={currentPlayer.points}
            />
            <ActionRow onSetSuccess={onSetSuccess} onSetFailed={onSetFailure} />
        </>
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
            <Button title="Missed" onPress={onSetFailed} />
            <Button
                title="Landed"
                onPress={() => setActionRow(actionInputRow.current)}
            />
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
            <Button title="x" onPress={close} />
        </View>
    )
}

export default SettingPhaseView

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
    actionInputRow: {
        gap: 10,
    },
    trickInput: {
        width: '100%',
        borderWidth: 1,
    },
})
