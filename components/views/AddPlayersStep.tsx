import { Button, Text, View } from 'react-native'
import PlayerInput from '../PlayerInput'
import { useGame } from '../../context/GameContext'

type AddPlayersStepProps = StepProps

const AddPlayersStep: React.FC<AddPlayersStepProps> = ({ next }) => {
    const { players, addPlayer } = useGame()
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
