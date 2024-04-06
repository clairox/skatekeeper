import { useState } from 'react'
import PlayerSetup from './components/phases/PlayerSetup'
import ChooseTurns from './components/phases/ChooseTurns'
import Game from './components/phases/Game'
import { Button, Center, Heading, List, ListItem, Text, VStack } from '@chakra-ui/react'

function App() {
	const [phase, setPhase] = useState<Phase>('playerSetup')
	const [players, setPlayers] = useState<Player[]>([])

	if (phase === 'playerSetup') {
		return (
			<VStack>
				<Heading>Add players:</Heading>
				<PlayerSetup setPlayers={setPlayers} />
				{players.length > 0 && (
					<List id="players" pt="4">
						{players.map(player => (
							<ListItem key={player.name}>
								<Text align="center">{player.name}</Text>
							</ListItem>
						))}
					</List>
				)}

				<Center>
					<Button mt="4" onClick={() => setPhase('chooseTurns')} isDisabled={players.length < 2}>
						Done
					</Button>
				</Center>
			</VStack>
		)
	}

	if (phase === 'chooseTurns') {
		return <ChooseTurns players={players} setPlayers={setPlayers} setPhase={setPhase} />
	}

	return <Game players={players} />
}

export default App
