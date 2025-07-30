import { useRouter } from 'expo-router'
import { useEffect, useState } from 'react'
import InitLettersStep from '../../components/views/InitPlayersStep'
import AddPlayersStep from '../../components/views/AddPlayersStep'
import ShuffleStep from '../../components/views/ShufflePlayersStep'
import { useGame } from '../../context/GameContext'

const GameSetupPhase = () => {
    const router = useRouter()

    const { initGame } = useGame()

    const [step, setStep] = useState<'letters' | 'players' | 'shuffling'>(
        'letters'
    )

    useEffect(() => {
        initGame()
    }, [initGame])

    switch (step) {
        case 'letters':
            return <InitLettersStep next={() => setStep('players')} />
        case 'players':
            return <AddPlayersStep next={() => setStep('shuffling')} />
        case 'shuffling':
            return <ShuffleStep next={() => router.push('gamePlay')} />
        default:
            router.push('/')
    }
}

export default GameSetupPhase
