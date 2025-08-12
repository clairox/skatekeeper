import { useState } from 'react'
import PlayersSetup from '../screens/PlayersSetupScreen'
import LettersSetup from '../screens/LettersSetupScreen'
import { useGameContext } from '../../context/GameContext'

const GameSetup = () => {
    const { setupGame } = useGameContext()

    const [letters, setLetters] = useState('')
    const [players, setPlayers] = useState<Player[]>([])

    const addPlayer = (name: string) => {
        setPlayers(current => {
            let id = 0

            if (current.length > 0) {
                const prevPlayer = current[current.length - 1]
                id = prevPlayer.id + 1
            }

            const newPlayer = {
                id,
                name,
                points: 0,
                isEliminated: false,
            }

            return [...current, newPlayer]
        })
    }

    const steps = [
        <LettersSetup
            setLetters={setLetters}
            done={() => setCurrentStep(1)}
            key="lettersStep"
        />,
        <PlayersSetup
            players={players}
            addPlayer={addPlayer}
            done={() => {
                if (!letters || !players) {
                    // TODO: Alert user that something is missing
                    return
                }

                setupGame(letters, players)
            }}
            key="playersStep"
        />,
    ]

    const [currentStep, setCurrentStep] = useState(0)

    return steps[currentStep]
}

export default GameSetup
