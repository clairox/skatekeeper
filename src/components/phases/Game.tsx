import type { FunctionComponent } from 'react'
import { useEffect, useState } from 'react'
import { useTurns } from '../../hooks/turns'

type GameProps = {
	players: Player[]
}

const Game: FunctionComponent<GameProps> = ({ players }) => {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const copyArrayByValue = (arr: any[]) => JSON.parse(JSON.stringify(arr))

	const [playerList, setPlayerList] = useState<Player[]>(copyArrayByValue(players))
	const { currentPlayer, nextTurn } = useTurns(playerList)

	const [currentSetter, setCurrentSetter] = useState<Player | null>(null)
	const [winner, setWinner] = useState<Player | null>(null)
	const [hasTrickBeenSet, setHasTrickBeenSet] = useState<boolean>(false)

	const convertScoreToLetters = (score: number): string => {
		const letters = 'SKATE'
		return letters.slice(0, 5 - score)
	}

	/* Setting */

	const onTrickSet = () => {
		setCurrentSetter(currentPlayer)
		nextTurn()
		setHasTrickBeenSet(true)
	}

	const onTrickSetFailed = () => {
		nextTurn()
	}

	/* Copying */

	const onTrickCopyFinished = () => {
		const nextPlayer = nextTurn().player

		if (nextPlayer.name === currentSetter!.name) {
			setCurrentSetter(null)
			setHasTrickBeenSet(false)
		}
	}

	const onTrickCopyFailed = () => {
		const tempPlayerList = playerList

		tempPlayerList.forEach(player => {
			if (player.name === currentPlayer.name) {
				player.score -= 1
			}
		})

		setPlayerList([...tempPlayerList])
		onTrickCopyFinished()
	}

	useEffect(() => {
		const activePlayers = playerList.filter(player => player.score > 0)
		if (activePlayers.length === 1) {
			setWinner(activePlayers[0])
		}
	}, [playerList])

	if (winner !== null) {
		return <div>{winner.name} wins!</div>
	}

	return (
		<>
			<ul>
				{playerList.map(player => {
					if (player.score > 0) {
						return (
							<li key={player.name}>
								<div>
									{player.name} - {convertScoreToLetters(player.score)}
								</div>
							</li>
						)
					} else {
						return (
							<li key={player.name}>
								<div style={{ textDecoration: 'line-through' }}>
									{player.name} - {convertScoreToLetters(player.score)}
								</div>
							</li>
						)
					}
				})}
			</ul>
			<div>
				{hasTrickBeenSet ? (
					<>
						<div>
							{currentPlayer?.name} is copying {currentSetter!.name}'s trick
						</div>
						<button onClick={onTrickCopyFailed}>Failed</button>
						<button onClick={onTrickCopyFinished}>Done</button>
					</>
				) : (
					<>
						<div>{currentPlayer?.name} is setting a trick</div>
						<button onClick={onTrickSetFailed}>Failed</button>
						<button onClick={onTrickSet}>Done</button>
					</>
				)}
			</div>
		</>
	)
}

export default Game
