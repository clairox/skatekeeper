import { Button } from 'react-native'
import LettersDisplay from '../../components/LettersDisplay'
import { useRouter } from 'expo-router'
import { useLetters, usePlayers, useWinnerId } from '../../context/GameContext'
import StyledView from '../../components/ui/StyledView'
import StyledText from '../../components/ui/StyledText'

const GameOverPhase = () => {
    const router = useRouter()

    const letters = useLetters()
    const players = usePlayers()
    const winnerId = useWinnerId()

    if (winnerId == null) {
        throw new Error('An unexpected error has occurred: No winner found')
    }

    const winner: Player | undefined = players.find(
        player => player.id === winnerId
    )

    if (!winner) {
        throw new Error('An unexpected error has occurred: No winner found')
    }

    const playAgain = () => {
        router.replace(`./setup?key=${Date.now().toString()}`)
    }

    return (
        <StyledView>
            <StyledText>{winner.name} is the winner!</StyledText>
            <LettersDisplay letters={letters} totalPoints={winner.points} />
            <Button title="Play again" onPress={playAgain} />
            <Button title="Home" onPress={() => router.dismissTo('/')} />
        </StyledView>
    )
}

export default GameOverPhase
