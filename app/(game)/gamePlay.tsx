import {
    Button,
    NativeSyntheticEvent,
    StyleSheet,
    Text,
    TextInput,
    TextInputSubmitEditingEventData,
    View,
} from 'react-native'
import { useGame } from '../../context/GameContext'
import { useCallback, useEffect, useRef, useState } from 'react'
import LettersDisplay from '../../components/LettersDisplay'
import { useRouter } from 'expo-router'

const GamePlayPhase = () => {
    const router = useRouter()

    const {
        letters,
        currentPlayer,
        activePlayers,
        nextTurn,
        addPoint,
        eliminatePlayer,
        setCompleted,
    } = useGame()

    const [trick, setTrick] = useState('')
    const [setter, setSetter] = useState(currentPlayer)

    const reset = useCallback(() => {
        setTrick('')
    }, [])

    useEffect(() => {
        if (!trick && setter.id !== currentPlayer.id) {
            setSetter(currentPlayer)
        } else if (setter.id === currentPlayer.id) {
            reset()
        }
    }, [trick, currentPlayer, activePlayers, setter, reset])

    useEffect(() => {
        if (activePlayers.length === 1) {
            setCompleted(true)
            router.push(`/gameOver?winner=${activePlayers[0].id}`)
        }
    }, [activePlayers, router, setCompleted])

    const onTrickSetSuccess = (
        event: NativeSyntheticEvent<TextInputSubmitEditingEventData>
    ) => {
        event.preventDefault()
        setTrick(event.nativeEvent.text)

        nextTurn()
    }

    const onTrickSetFailed = () => {
        nextTurn()
    }

    const onTrickCopySuccess = () => {
        nextTurn()
    }

    const onTrickCopyFailed = () => {
        const totalPoints = addPoint(currentPlayer.id)
        if (totalPoints === letters.length) {
            eliminatePlayer(currentPlayer.id)
            return
        }

        nextTurn()
    }

    if (trick) {
        return (
            <>
                <Text>Trick to copy: {trick}</Text>
                <Text>{`${currentPlayer.name} it's your turn!`}</Text>
                <LettersDisplay
                    letters={letters}
                    totalPoints={currentPlayer.points}
                />
                <View style={[styles.actionRow, styles.actionButtonRow]}>
                    <Button title="Missed" onPress={onTrickCopyFailed} />
                    <Button title="Landed" onPress={onTrickCopySuccess} />
                </View>
            </>
        )
    }

    return (
        <>
            <Text>{setter.name} sets the trick!</Text>
            <LettersDisplay
                letters={letters}
                totalPoints={currentPlayer.points}
            />
            <ActionRow
                onTrickSetSuccess={onTrickSetSuccess}
                onTrickSetFailed={onTrickSetFailed}
            />
        </>
    )
}

type ActionRowProps = {
    onTrickSetSuccess: (
        event: NativeSyntheticEvent<TextInputSubmitEditingEventData>
    ) => void
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
                onSubmitEditing={onTrickSetSuccess}
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

export default GamePlayPhase

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
