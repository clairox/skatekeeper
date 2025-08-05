import { Button, Text, View } from 'react-native'
import PlayerInput from '../PlayerInput'
import { useEffect, useState } from 'react'
import { useGameActions } from '../../context/GameStoreContext'
type AddPlayersStepProps = StepProps

const AddPlayersStep: React.FC<AddPlayersStepProps> = ({ next }) => {
    const { initPlayers } = useGameActions()

    const [players, setPlayers] = useState<Player[]>([])
    const [idCounter, setIdCounter] = useState(-1)

    const [done, setDone] = useState(false)

    const addPlayer = (name: string) => {
        const newPlayer: Player = {
            id: idCounter,
            name,
            points: 0,
            isEliminated: false,
        }
        setPlayers(prev => {
            return [...prev, newPlayer]
        })

        console.log(`Player '${newPlayer.name}' added`)
    }

    useEffect(() => {
        setIdCounter(prev => prev + 1)
    }, [players.length])

    useEffect(() => {
        if (done) {
            const onDone = async () => {
                await initPlayers(players)
                next()
            }

            onDone()
        }
    }, [done, next, players, initPlayers])

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
            <Button
                title="Done"
                disabled={players.length < 2}
                onPress={() => setDone(true)}
            />
        </>
    )
}

export default AddPlayersStep
