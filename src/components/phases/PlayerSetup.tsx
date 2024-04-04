import { useState } from 'react'
import type { Dispatch, FormEvent, FunctionComponent, SetStateAction } from 'react'

type PlayerSetupProps = {
	setPlayers: Dispatch<SetStateAction<Player[]>>
}

const PlayerSetup: FunctionComponent<PlayerSetupProps> = ({ setPlayers }) => {
	const [newPlayerName, setNewPlayerName] = useState('')

	const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault()

		if (newPlayerName.length === 0) {
			return
		}

		const newPlayer = { name: newPlayerName, score: 5 }
		setPlayers(prev => prev.concat(newPlayer))
		setNewPlayerName('')
	}

	return (
		<form onSubmit={handleSubmit}>
			<input
				type="text"
				id="playerName"
				name="playerName"
				value={newPlayerName}
				onChange={e => setNewPlayerName(e.target.value)}
			/>
			<button type="submit">+</button>
		</form>
	)
}

export default PlayerSetup
