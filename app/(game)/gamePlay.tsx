import { useEffect } from 'react'
import {
    useActivePlayers,
    useCurrentTrick,
    useLetters,
    useTurn,
    useWinnerId,
} from '../../context/GameContext'
import SettingPhaseView from '../../components/views/SettingPhaseView'
import CopyingPhaseView from '../../components/views/CopyingPhaseView'
import { useRouter } from 'expo-router'

const GamePlayPhase = () => {
    const router = useRouter()

    const letters = useLetters()
    const currentTrick = useCurrentTrick()
    const turn = useTurn()
    const players = useActivePlayers()
    const winnerId = useWinnerId()

    const currentPlayer = players[turn]

    useEffect(() => {
        if (winnerId != null) {
            router.push('/gameOver')
        }
    }, [winnerId, router])

    if (currentTrick) {
        return (
            <CopyingPhaseView
                letters={letters}
                currentPlayer={currentPlayer}
                currentTrick={currentTrick}
            />
        )
    }

    return <SettingPhaseView letters={letters} currentPlayer={currentPlayer} />
}

export default GamePlayPhase
