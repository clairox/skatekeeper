import { useEffect, useRef, useState } from 'react'
import { useGameActions } from '../../context/GameStoreContext'
import { Button, StyleSheet, Text, TextInput, View } from 'react-native'
import LettersDisplay from '../LettersDisplay'

type SettingPhaseProps = {
    letters: string
    currentPlayer: Player
    setTrick: (trick: string) => Promise<void>
    setSetter: (setter: Player) => void
}

const SettingPhaseView: React.FC<SettingPhaseProps> = ({
    letters,
    currentPlayer,
    setTrick,
    setSetter,
}) => {
    const { nextTurn } = useGameActions()

    const onSetSuccess = async (trick: string) => {
        await setTrick(trick)
        console.log(`The trick has been set to ${trick}.`)

        await nextTurn()
    }

    const onSetFailed = async () => {
        console.log(`Trick was not set.`)
        await nextTurn()
    }

    useEffect(() => {
        setSetter(currentPlayer)
        console.log(`Current setter: ${currentPlayer.name}`)
    }, [currentPlayer, setSetter])

    return (
        <>
            <Text>{currentPlayer.name} sets the trick!</Text>
            <LettersDisplay
                letters={letters}
                totalPoints={currentPlayer.points}
            />
            <ActionRow
                onTrickSetSuccess={onSetSuccess}
                onTrickSetFailed={onSetFailed}
            />
        </>
    )
}

type ActionRowProps = {
    onTrickSetSuccess: (trick: string) => void
    onTrickSetFailed: () => void
}

const ActionRow: React.FC<ActionRowProps> = ({
    onTrickSetSuccess,
    onTrickSetFailed,
}) => {
    const [actionRow, setActionRow] = useState(<></>)

    const actionButtonRow = useRef(
        <View style={[styles.actionRow, styles.actionButtonRow]}>
            <Button title="Missed" onPress={onTrickSetFailed} />
            <Button
                title="Landed"
                onPress={() => setActionRow(actionInputRow.current)}
            />
        </View>
    )

    const actionInputRow = useRef(
        <View style={[styles.actionRow, styles.actionInputRow]}>
            <TextInput
                onSubmitEditing={event => {
                    const trick = event.nativeEvent.text
                    if (!trick) {
                        return
                    }

                    onTrickSetSuccess(trick)
                }}
                autoFocus
                style={styles.trickInput}
            />
            <Button
                title="x"
                onPress={() => setActionRow(actionButtonRow.current)}
            />
        </View>
    )

    useEffect(() => {
        setActionRow(actionButtonRow.current)
    }, [])

    return actionRow
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
