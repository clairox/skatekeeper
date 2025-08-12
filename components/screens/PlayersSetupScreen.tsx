import { View } from 'react-native'
import StyledText from '../ui/StyledText'
import StyledView from '../ui/StyledView'
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
            <MenuTextButton disabled={players.length < 2} onPress={done}>
                Done
            </MenuTextButton>
        </StyledView>
    )
}

export default PlayersSetup
