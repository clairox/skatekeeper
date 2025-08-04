import MultiPlatformSafeAreaView from '../../components/MultiPlatformSafeAreaView'
import { Slot } from 'expo-router'
import { GameStoreProvider } from '../../context/GameStoreContext'

const GameLayout = () => {
    return (
        <GameStoreProvider>
            <MultiPlatformSafeAreaView>
                <Slot />
            </MultiPlatformSafeAreaView>
        </GameStoreProvider>
    )
}

export default GameLayout
