import { Button, FormControl, HStack, Input } from '@chakra-ui/react'
import { useState } from 'react'
import type { Dispatch, FormEvent, FunctionComponent, SetStateAction } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'

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
		</form>
	)
}

export default PlayerSetup
