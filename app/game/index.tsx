import { useLocalSearchParams } from 'expo-router'
import { GameProvider } from '../../context/GameContext'
import Game from '../../components/game/Game'

const GamePage = () => {
    const { id, refreshKey } = useLocalSearchParams() as Record<string, string>

    console.log('Initializing game:', refreshKey)

    return (
        <GameProvider gameId={parseInt(id)} key={refreshKey}>
            <Game />
        </GameProvider>
    )
}

export default GamePage
