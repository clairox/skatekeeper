import { Button, View } from 'react-native'
import PlayerInput from '../PlayerInput'
import { useEffect, useState } from 'react'
import StyledText from '../ui/StyledText'
import StyledView from '../ui/StyledView'

type AddPlayersStepProps = {
    players: Player[]
    setPlayers: (players: Player[]) => void
    next: () => void
}

const AddPlayersStep: React.FC<AddPlayersStepProps> = ({
    players,
    setPlayers,
    next,
}) => {
    const [idCounter, setIdCounter] = useState(-1)

    const addPlayer = (name: string) => {
        const newPlayer: Player = {
            id: idCounter,
            name,
            points: 0,
            isEliminated: false,
        }
        setPlayers([...players, newPlayer])
    }

    useEffect(() => {
        setIdCounter(prev => prev + 1)
    }, [players.length])

    return (
        <StyledView>
            <StyledText>{"Who's playing?"}</StyledText>
            <View style={{ gap: 10, paddingHorizontal: 30, width: '100%' }}>
                {players.map((player, idx) => (
                    <View
                        key={`${idx}-${player.name}`}
                        style={{
                            justifyContent: 'center',
                            alignItems: 'center',
                            height: 30,
                        }}
                    >
                        <StyledText style={{ fontSize: 20 }}>
                            {player.name}
                        </StyledText>
                    </View>
                ))}
                <PlayerInput
                    placeholder={`Player ${players.length + 1}`}
                    onPlayerAdded={addPlayer}
                />
            </View>
            <Button title="Done" disabled={players.length < 2} onPress={next} />
        </StyledView>
    )
}

export default AddPlayersStep
