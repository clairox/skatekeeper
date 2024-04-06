import {
	Center,
	FormControl,
	HStack,
	IconButton,
	Input,
	List,
	ListItem,
	Text,
	VStack,
} from '@chakra-ui/react'
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

		const lastId = players[players.length - 1]?.id || 0
		const newPlayer = { id: lastId + 1, name: newPlayerName, score: 5 }

		addPlayer(newPlayer)
		setNewPlayerName('')
	}

	return (
		<VStack w="full">
			<Center as="form" w="full" onSubmit={handleSubmit} autoComplete="off">
				<FormControl>
					<HStack w="100%" px="30px">
						<Input
							type="text"
							id="playerName"
							name="playerName"
							value={newPlayerName}
							onChange={e => setNewPlayerName(e.target.value)}
						/>
						<IconButton
							type="submit"
							bg="none"
							color="white"
							w="40px"
							aria-label="Add"
							icon={<FontAwesomeIcon icon={faPlus} />}
						/>
					</HStack>
				</FormControl>
			</Center>
			{players.length > 0 && (
				<List id="players" pt="4">
					{players.map(player => (
						<ListItem key={player.id}>
							<Text align="center">{player.name}</Text>
						</ListItem>
					))}
				</List>
			)}
		</VStack>
	)
}

export default PlayerSetup
