import { useEffect } from 'react'
import { Text } from 'react-native'

const DELAY = 250

type ShufflePlayersStepProps = {
    players: Player[]
    setPlayers: (players: Player[]) => void
    next: () => void
}

const RPSAnimationStep: React.FC<ShufflePlayersStepProps> = ({
    players,
    next,
}) => {
    useEffect(() => {
        setTimeout(() => {
            next()
        }, DELAY)
    }, [next])

    return (
        <>
            {players.map(player => (
                <Text key={player.name}>{player.name}</Text>
            ))}
            <Text>Ro-sham-bo!</Text>
        </>
    )
}

export default RPSAnimationStep
