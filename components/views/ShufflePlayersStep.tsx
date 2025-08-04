import { useCallback, useEffect, useState } from 'react'
import { Text } from 'react-native'
import { useGame } from '../../context/GameContext'
import { useGameActions, usePlayers } from '../../context/GameStoreContext'

const DELAY = 250

type ShufflePlayersStepProps = StepProps

const ShufflePlayersStep: React.FC<ShufflePlayersStepProps> = ({ next }) => {
    const players = usePlayers()
    const { shufflePlayers } = useGameActions()

    const [done, setDone] = useState(false)

    useEffect(() => {
        if (!done) {
            shufflePlayers()
            setDone(true)

            setTimeout(() => {
                next()
            }, DELAY)
        }
    }, [shufflePlayers, done, next])

    return (
        <>
            {players.map(player => (
                <Text key={player.name}>{player.name}</Text>
            ))}
            <Text>Ro-sham-bo!</Text>
        </>
    )
}

export default ShufflePlayersStep
