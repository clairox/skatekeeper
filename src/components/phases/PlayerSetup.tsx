import { Button, FormControl, HStack, Input, List, ListItem, Text } from '@chakra-ui/react'
import { useState } from 'react'
import type { Dispatch, FormEvent, FunctionComponent, SetStateAction } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'

type PlayerSetupProps = {
	players: Player[]
	setPlayers: Dispatch<SetStateAction<Player[]>>
}

const PlayerSetup: FunctionComponent<PlayerSetupProps> = ({ players, setPlayers }) => {
	const [newPlayerName, setNewPlayerName] = useState('')

	const addPlayer = (player: Player) => {
		setPlayers(prev => [...prev, player])
	}

	const removePlayer = (id: number) => {
		setPlayers(prev => prev.filter(player => player.id !== id))
	}

	const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault()

		if (newPlayerName.length === 0) {
			return
		}

		const lastId = players[players.length - 1].id
		const newPlayer = { id: lastId + 1, name: newPlayerName, score: 5 }

		addPlayer(newPlayer)
		setNewPlayerName('')
	}

	return (
		<form onSubmit={handleSubmit} autoComplete="off" style={{ width: '100%' }}>
			<FormControl>
				<HStack w="100%" px="30px">
					<Input
						type="text"
						id="playerName"
						name="playerName"
						value={newPlayerName}
						onChange={e => setNewPlayerName(e.target.value)}
					/>
					<Button type="submit" bg="none" color="white" w="40px">
						<FontAwesomeIcon icon={faPlus} />
					</Button>
				</HStack>
			</FormControl>
			{players.length > 0 && (
				<List id="players" pt="4">
					{players.map(player => (
						<ListItem key={player.name}>
							<Text align="center">{player.name}</Text>
						</ListItem>
					))}
				</List>
			)}
		</form>
	)
}

export default PlayerSetup
