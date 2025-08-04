import { useEffect, useMemo, useState } from 'react'
import {
    useActivePlayers,
    useLetters,
    useTurn,
} from '../../context/GameStoreContext'
import SettingPhaseView from '../../components/views/SettingPhaseView'
import CopyingPhaseView from '../../components/views/CopyingPhaseView'
import { useRouter } from 'expo-router'

const GamePlayPhase = () => {
    const router = useRouter()

    const letters = useLetters()
    const players = useActivePlayers()
    const turn = useTurn()

    const currentPlayer = useMemo(() => players[turn], [players, turn])

    const [trick, setTrick] = useState<string | null>(null)
    const [setter, setSetter] = useState<Player>(currentPlayer)

    const isTrickSet = useMemo(() => Boolean(trick), [trick])

    const setNewTrick = (newTrick: string) => {
        if (newTrick.length === 0) {
            throw new Error('Trick must contain a value.')
        }

        setTrick(newTrick)
    }

    const onCopyingPhaseDone = () => {
        setTrick(null)
    }

    useEffect(() => {
        console.log('Starting game...')
    }, [])

    useEffect(() => {
        if (players.length === 1) {
            const winner = players[0]
            router.push(`/gameOver?winner=${winner.id}`)
        }
    }, [players, router])

    if (!isTrickSet) {
        return (
            <SettingPhaseView
                letters={letters}
                currentPlayer={currentPlayer}
                setTrick={setNewTrick}
                setSetter={setSetter}
            />
        )
    } else {
        return (
            <CopyingPhaseView
                letters={letters}
                currentPlayer={currentPlayer}
                setter={setter}
                trick={trick as string}
                done={onCopyingPhaseDone}
            />
        )
    }
}

export default GamePlayPhase
