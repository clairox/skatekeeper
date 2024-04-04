import { useState } from 'react'
import PlayerSetup from './components/phases/PlayerSetup'
import ChooseTurns from './components/phases/ChooseTurns'
import Game from './components/phases/Game'

function App() {
	const [phase, setPhase] = useState<Phase>('playerSetup')
	const [players, setPlayers] = useState<Player[]>([])

	if (phase === 'playerSetup') {
		return (
			<>
				{players.length > 0 && (
					<div id="players">
						{players.map(player => (
							<li key={player.name}>{player.name}</li>
						))}
					</div>
				)}
				<PlayerSetup setPlayers={setPlayers} />
				<button onClick={() => setPhase('chooseTurns')}>Done</button>
			</>
		)
	}

	if (phase === 'chooseTurns') {
		return <ChooseTurns players={players} setPlayers={setPlayers} setPhase={setPhase} />
	}

	return <Game players={players} />
}

export default App
