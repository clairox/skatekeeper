import type { FunctionComponent } from 'react'
import { useEffect, useRef, useState } from 'react'

type GameProps = {
	players: Player[]
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Game: FunctionComponent<GameProps> = ({ players }) => {
	const makePlayerIterator = (players: Player[]) => {
		let nextIdx = 0
		const increment = () => (nextIdx + 1 >= players.length ? 0 : nextIdx + 1)

		const iter = {
			next: (): Player => {
				const result = players[nextIdx]

				nextIdx = increment()
				while (players[nextIdx].score <= 0) {
					nextIdx = increment()
				}

				return result
			},
		}

		return iter
	}

	const [playerList, setPlayerList] = useState<Player[]>(players)
	const playerIterator = useRef(makePlayerIterator(playerList))

	const [currentPlayer, setCurrentPlayer] = useState<Player | null>(null)
	const [currentSetter, setCurrentSetter] = useState<Player | null>(null)
	const [winner, setWinner] = useState<Player | null>(null)
	const [hasTrickBeenSet, setHasTrickBeenSet] = useState<boolean>(false)

	useEffect(() => setCurrentPlayer(playerIterator.current.next()), [])

	const convertScoreToLetters = (score: number): string => {
		const letters = 'SKATE'
		return letters.slice(0, 5 - score)
	}

	/* Setting */

	const onTrickSet = () => {
		setCurrentSetter(currentPlayer)
		setCurrentPlayer(playerIterator.current.next())
		setHasTrickBeenSet(true)
	}

	const onTrickSetFailed = () => {
		setCurrentPlayer(playerIterator.current.next())
	}

	/* Copying */

	const onTrickCopyFinished = () => {
		const nextPlayer = playerIterator.current.next()

		if (nextPlayer.name === currentSetter!.name) {
			setCurrentSetter(null)
			setHasTrickBeenSet(false)
		}

		setCurrentPlayer(nextPlayer)
	}

	const onTrickCopyFailed = () => {
		const tempPlayerList = playerList

		tempPlayerList.forEach(player => {
			if (player.name === currentPlayer?.name) {
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
