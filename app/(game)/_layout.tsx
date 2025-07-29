import { GameProvider } from '../../context/GameContext'
import MultiPlatformSafeAreaView from '../../components/MultiPlatformSafeAreaView'
import { Slot } from 'expo-router'

const GameLayout = () => {
    return (
        <GameProvider>
            <MultiPlatformSafeAreaView>
                <Slot />
            </MultiPlatformSafeAreaView>
        </GameProvider>
    )
}

export default GameLayout
