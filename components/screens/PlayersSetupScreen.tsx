import { View } from 'react-native'
import Text from '../ui/primitives/Text'
import CompactView from '../ui/CompactView'
import PlayerInput from '../ui/PlayerInput'
import TextButton from '../ui/TextButton'

type PlayersSetupProps = {
    players: Player[]
    addPlayer: (name: string) => void
    done: () => void
}

const PlayersSetup: React.FC<PlayersSetupProps> = ({
    players,
    addPlayer,
    done,
}) => {
    return (
        <CompactView style={{ paddingHorizontal: 30, width: '100%' }}>
            <Text>{"Who's playing?"}</Text>
            <View style={{ gap: 10 }}>
                {players.map((player, idx) => (
                    <View
                        key={`${idx}-${player.name}`}
                        style={{
                            justifyContent: 'center',
                            alignItems: 'center',
                            height: 30,
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
            <TextButton disabled={players.length < 2} onPress={done}>
                Done
            </TextButton>
        </CompactView>
    )
}

export default PlayersSetup
