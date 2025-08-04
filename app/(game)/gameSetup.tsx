import { useRouter } from 'expo-router'
import { useState } from 'react'
import InitLettersStep from '../../components/views/InitLettersStep'
import AddPlayersStep from '../../components/views/AddPlayersStep'
import ShuffleStep from '../../components/views/ShufflePlayersStep'

const GameSetupPhase = () => {
    const router = useRouter()

    const [step, setStep] = useState<'letters' | 'players' | 'shuffling'>(
        'letters'
    )

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
