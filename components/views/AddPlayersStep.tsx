import { Button, Text, View } from 'react-native'
import PlayerInput from '../PlayerInput'
import { useEffect, useState } from 'react'

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
        <>
            <Text>{"Who's playing?"}</Text>
            <View style={{ gap: 10, paddingHorizontal: 30, width: '100%' }}>
                {players.map((player, idx) => (
                    <View
                        key={`${idx}-${player.name}`}
                        style={{
                            justifyContent: 'center',
                            alignItems: 'center',
                            height: 40,
                        }}
                    >
                        <Text style={{ fontSize: 20 }}>{player.name}</Text>
                    </View>
                ))}
                <PlayerInput
                    placeholder={`Player ${players.length + 1}`}
                    onPlayerAdded={addPlayer}
                />
            </View>
            <Button title="Done" disabled={players.length < 2} onPress={next} />
        </>
    )
}

export default AddPlayersStep
