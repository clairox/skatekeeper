import { useEffect, useMemo, useState } from 'react'
import {
    useActivePlayers,
    useIsLoading,
    useLetters,
    useTurn,
} from '../../context/GameStoreContext'
import SettingPhaseView from '../../components/views/SettingPhaseView'
import CopyingPhaseView from '../../components/views/CopyingPhaseView'
import { useRouter } from 'expo-router'
import { useGameRecordContext } from '../../context/GameRecordContext'

const GamePlayPhase = () => {
    const router = useRouter()

    const gameRecord = useGameRecordContext()

    const letters = useLetters()
    const players = useActivePlayers()
    const turn = useTurn()
    const loading = useIsLoading()

    const [currentPlayer, setCurrentPlayer] = useState(players[turn])

    useEffect(() => {
        if (!loading) {
            setCurrentPlayer(players[turn])
        }
    }, [players, turn, loading])

    const [trick, setTrick] = useState<string | null>(null)
    const [setter, setSetter] = useState<Player>(currentPlayer)

    const isTrickSet = useMemo(() => Boolean(trick), [trick])

    const setNewTrick = async (newTrick: string) => {
        if (newTrick.length === 0) {
            throw new Error('Trick must contain a value.')
        }

        await gameRecord.currentRound().setTrick(newTrick, setter.id)
        setTrick(newTrick)
    }

    const onCopyingPhaseDone = async () => {
        // await gameRecord.currentRound().complete()
        // setTrick(null)
    }

    useEffect(() => {
        console.log('Starting game...')
    }, [])

    useEffect(() => {
        if (currentPlayer.id === setter.id) {
            const done = async () => {
                await gameRecord.currentRound().complete()
                setTrick(null)
            }

            done()
        }
    }, [currentPlayer, setter, gameRecord])

    useEffect(() => {
        if (!trick && players.length > 1) {
            gameRecord.initRound()
        }
    }, [trick, gameRecord, players])

    if (gameRecord.currentRound().completed && players.length === 1) {
        const winner = players[0]
        gameRecord.setWinnerId(winner.id).then(() => {
            router.push(`/gameOver?winner=${winner.id}`)
        })

        return <></>
    }

    if (
        !isTrickSet ||
        (currentPlayer && setter && currentPlayer.id === setter.id)
    ) {
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
