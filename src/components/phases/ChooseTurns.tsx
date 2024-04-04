import { useEffect } from 'react'
import type { Dispatch, SetStateAction, FunctionComponent } from 'react'

type ChooseTurnsProps = {
	players: Player[]
	setPlayers: Dispatch<SetStateAction<Player[]>>
	setPhase: Dispatch<SetStateAction<Phase>>
}

const ChooseTurns: FunctionComponent<ChooseTurnsProps> = ({ players, setPlayers, setPhase }) => {
	useEffect(() => {
		const shufflePlayers = () => {
			const temp = players
			for (let i = temp.length - 1; i > 0; i--) {
				const j = Math.floor(Math.random() * (i + 1))
				;[temp[i], temp[j]] = [temp[j], temp[i]]
			}

			setPlayers(temp)
		}

		setTimeout(() => {
			shufflePlayers()
			setPhase('game')
		}, 10)
	}, [players, setPlayers, setPhase])

	return <div>Roshambo!</div>
}

export default ChooseTurns
