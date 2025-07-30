import { Button, Text } from 'react-native'
import { useGame } from '../../context/GameContext'
import LettersDisplay from '../../components/LettersDisplay'
import { useRouter } from 'expo-router'

const GameOverPhase = () => {
    const router = useRouter()

    const { activePlayers, letters } = useGame()

    const winner: Player | undefined = activePlayers[0]

    if (!winner) {
        throw Error('An unexpected error has occurred: No winner found')
    }

    return (
        <>
            <Text>{winner.name} is the winner!</Text>
            <LettersDisplay letters={letters} totalPoints={winner.points} />
            <Button
                title="Play again"
                onPress={() => router.push('/gameSetup')}
            />
            <Button title="Home" onPress={() => router.push('/')} />
        </>
    )
}

export default GameOverPhase
