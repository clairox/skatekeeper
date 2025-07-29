import { useCallback, useEffect, useState } from 'react'
import { Text } from 'react-native'
import { useGame } from '../../context/GameContext'

const DELAY = 2500

type ShufflePlayersStepProps = StepProps

const ShufflePlayersStep: React.FC<ShufflePlayersStepProps> = ({ next }) => {
    const { currentPlayers: players, setCurrentPlayers: setPlayers } = useGame()

    const [done, setDone] = useState(false)

    const shufflePlayers = useCallback(() => {
        let shuffledPlayers = [...players]

        let currentIdx = shuffledPlayers.length
        while (currentIdx > 0) {
            let randomIdx = Math.floor(Math.random() * currentIdx)
            currentIdx -= 1
            ;[shuffledPlayers[currentIdx], shuffledPlayers[randomIdx]] = [
                shuffledPlayers[randomIdx],
                shuffledPlayers[currentIdx],
            ]
        }

        setPlayers(shuffledPlayers)
    }, [players, setPlayers])

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
