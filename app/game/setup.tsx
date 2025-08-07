import { useRouter } from 'expo-router'
import { useState } from 'react'
import InitLettersStep from '../../components/views/InitLettersStep'
import AddPlayersStep from '../../components/views/AddPlayersStep'
import RPSAnimationStep from '../../components/views/RPSAnimationStep'
import { useGameActions } from '../../context/GameContext'

const GameSetupPhase = () => {
    const router = useRouter()

    const { initGame } = useGameActions()

    const [letters, setLetters] = useState<string | null>(null)
    const [players, setPlayers] = useState<Player[]>([])

    const [step, setStep] = useState<'letters' | 'players' | 'shuffling'>(
        'letters'
    )

    const onSetupComplete = async () => {
        if (!letters || players.length === 0) {
            throw new Error('Could not initialize game: Missing values')
        }

        try {
            await initGame(letters, players)
            router.push('./play')
        } catch (err) {
            console.error(err)
        }
    }

    switch (step) {
        case 'letters':
            return (
                <InitLettersStep
                    setLetters={setLetters}
                    next={() => setStep('players')}
                />
            )
        case 'players':
            return (
                <AddPlayersStep
                    players={players}
                    setPlayers={setPlayers}
                    next={() => setStep('shuffling')}
                />
            )
        case 'shuffling':
            return (
                <RPSAnimationStep
                    players={players}
                    setPlayers={setPlayers}
                    next={onSetupComplete}
                />
            )
        default:
            router.push('/')
    }
}

export default GameSetupPhase
