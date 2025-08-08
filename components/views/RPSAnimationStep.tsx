import { useEffect } from 'react'
import StyledText from '../ui/StyledText'
import StyledView from '../ui/StyledView'

const DELAY = 250

type ShufflePlayersStepProps = {
    players: Player[]
    setPlayers: (players: Player[]) => void
    next: () => void
}

const RPSAnimationStep: React.FC<ShufflePlayersStepProps> = ({
    players,
    next,
}) => {
    useEffect(() => {
        setTimeout(() => {
            next()
        }, DELAY)
    }, [next])

    return (
        <StyledView>
            {players.map(player => (
                <StyledText key={player.name}>{player.name}</StyledText>
            ))}
            <StyledText>Ro-sham-bo!</StyledText>
        </StyledView>
    )
}

export default RPSAnimationStep
