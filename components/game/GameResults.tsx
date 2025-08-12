import CompactView from '../ui/CompactView'
import Text from '../ui/Text'
import LetterProgress from '../ui/LetterProgress'
import { View } from 'react-native'
import TextButton from '../ui/TextButton'
import { useRouter } from 'expo-router'
import { useGameContext } from '../../context/GameContext'

const GameResults = () => {
    const router = useRouter()

    const {
        state: { winnerId, activePlayers, letters },
    } = useGameContext()

    if (winnerId == null) {
        throw new Error('An unexpected error has occurred: No winner found')
    }

    const winner: Player | undefined = activePlayers.find(
        player => player.id === winnerId
    )

    if (!winner) {
        throw new Error('An unexpected error has occurred: No winner found')
    }

    const playAgain = async () => {
        router.replace('/game?refreshKey=' + Date.now().toString())
    }

    return (
        <CompactView>
            <Text>{winner.name} is the winner!</Text>
            <LetterProgress letters={letters} totalPoints={winner.points} />
            <View style={{ gap: 20 }}>
                <TextButton onPress={playAgain}>Play again</TextButton>
                <TextButton onPress={() => router.dismissTo('/')}>
                    Home
                </TextButton>
            </View>
        </CompactView>
    )
}

export default GameResults
