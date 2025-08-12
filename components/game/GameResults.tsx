import CompactView from '../ui/CompactView'
import Text from '../ui/Text'
import LettersDisplay from '../ui/LettersDisplay'
import { View } from 'react-native'
import { MenuTextButton } from '../ui/MenuButton'
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
            <LettersDisplay letters={letters} totalPoints={winner.points} />
            <View style={{ gap: 20 }}>
                <MenuTextButton onPress={playAgain}>Play again</MenuTextButton>
                <MenuTextButton onPress={() => router.dismissTo('/')}>
                    Home
                </MenuTextButton>
            </View>
        </CompactView>
    )
}

export default GameResults
