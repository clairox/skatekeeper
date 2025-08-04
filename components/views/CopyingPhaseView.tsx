import { Button, StyleSheet, Text, View } from 'react-native'
import { useGameActions } from '../../context/GameStoreContext'
import LettersDisplay from '../LettersDisplay'
import { useEffect } from 'react'

type CopyingPhaseViewProps = {
    letters: string
    currentPlayer: Player
    setter: Player
    trick: string
    done: () => void
}

const CopyingPhaseView: React.FC<CopyingPhaseViewProps> = ({
    letters,
    currentPlayer,
    setter,
    trick,
    done,
}) => {
    const { nextTurn, addPoint, eliminatePlayer } = useGameActions()

    const onCopySuccess = () => {
        console.log(`${currentPlayer.name} has copied the trick.`)
        nextTurn()
    }

    const onCopyFailed = () => {
        const points = addPoint(currentPlayer.id)
        console.log(
            `${currentPlayer.name} has failed to copy the trick: ${letters.slice(0, points)}`
        )
        if (points === letters.length) {
            eliminatePlayer(currentPlayer.id)
            console.log(`${currentPlayer.name} has been eliminated.`)
        }
        nextTurn()
    }

    useEffect(() => {
        if (currentPlayer.id === setter.id) {
            done()
        }
    }, [currentPlayer, setter, done])

    useEffect(() => {
        console.log(`Current copier: ${currentPlayer.name}`)
    }, [currentPlayer.id, currentPlayer.name])

    return (
        <>
            <Text>Trick to copy: {trick}</Text>
            <Text>{`${currentPlayer.name} it's your turn!`}</Text>
            <LettersDisplay
                letters={letters}
                totalPoints={currentPlayer.points}
            />
            <View style={[styles.actionRow, styles.actionButtonRow]}>
                <Button title="Missed" onPress={onCopyFailed} />
                <Button title="Landed" onPress={onCopySuccess} />
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
