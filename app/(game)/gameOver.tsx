import { Button, Text } from 'react-native'
import LettersDisplay from '../../components/LettersDisplay'
import { useRouter } from 'expo-router'
import { useLetters, usePlayers } from '../../context/GameStoreContext'
import { useEffect } from 'react'
import { useSearchParams } from 'expo-router/build/hooks'

const GameOverPhase = () => {
    const router = useRouter()
    const searchParams = useSearchParams()

    const letters = useLetters()
    const players = usePlayers()

    const winner: Player | undefined = players.find(
        player => player.id.toString() === searchParams.get('winner')
    )

    if (!winner) {
        throw Error('An unexpected error has occurred: No winner found')
    }

    const playAgain = () => {
        router.replace(`/gameSetup?key=${Date.now().toString()}`)
    }

    useEffect(() => {
        console.log(`${winner.name} has won`)
    }, [winner])

    return (
        <>
            <Text>{winner.name} is the winner!</Text>
            <LettersDisplay letters={letters} totalPoints={winner.points} />
            <Button title="Play again" onPress={playAgain} />
            <Button title="Home" onPress={() => router.push('/')} />
        </>
    )
}

export default GameOverPhase
