import { View } from 'react-native'
import LettersDisplay from '../../components/ui/LettersDisplay'
import { useRouter } from 'expo-router'
import { useLetters, usePlayers, useWinnerId } from '../../context/GameContext'
import StyledView from '../../components/ui/StyledView'
import StyledText from '../../components/ui/StyledText'
import { MenuTextButton } from '../../components/ui/MenuButton'

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
            <View style={{ gap: 20 }}>
                <MenuTextButton onPress={playAgain}>Play again</MenuTextButton>
                <MenuTextButton onPress={() => router.dismissTo('/')}>
                    Home
                </MenuTextButton>
            </View>
        </StyledView>
    )
}

export default GameOverPhase
