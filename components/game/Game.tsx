import { useEffect } from 'react'
import { useGameContext } from '../../context/GameContext'
import GameResults from './GameResults'
import GameSession from './GameSession'
import GameSetup from './GameSetup'
import { useRouter } from 'expo-router'
import { BackHandler } from 'react-native'

const Game = () => {
    const router = useRouter()

    const {
        state: { letters, players, winnerId },
    } = useGameContext()

    const isGameSetup = letters && players.length >= 2

    useEffect(() => {
        const onBackPress = () => {
            router.dismissTo('/')
            return true
        }
        const backHandler = BackHandler.addEventListener(
            'hardwareBackPress',
            onBackPress
        )

        return () => backHandler.remove()
    }, [router])

    if (!isGameSetup) {
        return <GameSetup />
    }

    if (winnerId != null) {
        return <GameResults />
    }

    return <GameSession />
}

export default Game
