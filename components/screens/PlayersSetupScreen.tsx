import { View } from 'react-native'
import Text from '../ui/Text'
import CompactView from '../ui/CompactView'
import PlayerInput from '../ui/PlayerInput'
import { MenuTextButton } from '../ui/MenuButton'

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
        <CompactView>
            <Text>{"Who's playing?"}</Text>
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
                        <Text style={{ fontSize: 20 }}>{player.name}</Text>
                    </View>
                ))}
                <PlayerInput
                    placeholder={`Player ${players.length + 1}`}
                    onPlayerAdded={addPlayer}
                />
            </View>
            <MenuTextButton disabled={players.length < 2} onPress={done}>
                Done
            </MenuTextButton>
        </CompactView>
    )
}

export default PlayersSetup
