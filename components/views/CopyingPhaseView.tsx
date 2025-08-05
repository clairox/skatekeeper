import { Button, StyleSheet, Text, View } from 'react-native'
import {
    useActivePlayers,
    useGameActions,
    useIsLoading,
    useTurn,
} from '../../context/GameStoreContext'
import LettersDisplay from '../LettersDisplay'
import { memo, useEffect, useMemo, useState } from 'react'
import { useGameRecordContext } from '../../context/GameRecordContext'

type CopyingPhaseViewProps = {
    letters: string
    currentPlayer: Player
    setter: Player
    trick: string
    done: () => Promise<void>
}

const CopyingPhaseView: React.FC<CopyingPhaseViewProps> = ({
    letters,
    currentPlayer,
    setter,
    trick,
    done,
}) => {
    const gameRecord = useGameRecordContext()

    const { nextTurn, addPoint, eliminatePlayer, setIsLoading } =
        useGameActions()

    const onCopySuccess = async () => {
        console.log(`${currentPlayer.name} has copied the trick.`)
        await gameRecord
            .currentRound()
            .getPlayer(currentPlayer.id)
            .setTrickCopySuccess()
        await nextTurn()
    }

    const onCopyFailed = async () => {
        setIsLoading(true)

        const points = await addPoint(currentPlayer.id)
        console.log(
            `${currentPlayer.name} has failed to copy the trick: ${letters.slice(0, points)}`
        )

        if (points === letters.length) {
            await eliminatePlayer(currentPlayer.id)
            console.log(`${currentPlayer.name} has been eliminated.`)
        } else {
            await nextTurn()
        }

        setIsLoading(false)
    }

    useEffect(() => {
        if (currentPlayer.id === setter.id) {
            done()
        }
    }, [currentPlayer, setter, done])

    useEffect(() => {
        console.log(`Current copier: ${currentPlayer.name}`)
    }, [currentPlayer, setter])

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

export default memo(CopyingPhaseView)
