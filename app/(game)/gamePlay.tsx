import { Text, View } from 'react-native'
import { useGame } from '../../context/GameContext'

const GamePlayPhase = () => {
    const { letters } = useGame()
    return (
        <View>
            <Text>{letters}</Text>
        </View>
    )
}

export default GamePlayPhase
