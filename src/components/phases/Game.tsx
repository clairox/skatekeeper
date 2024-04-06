import type { FunctionComponent } from 'react'
import { useEffect, useState } from 'react'
import { useTurns } from '../../hooks/turns'
import { Button, ButtonGroup, Center, List, ListItem, Text, VStack } from '@chakra-ui/react'

type GameProps = {
	players: Player[]
}

const Game: FunctionComponent<GameProps> = ({ players }) => {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const cloneArray = (arr: any[]) => JSON.parse(JSON.stringify(arr))

	const [playerList, setPlayerList] = useState<Player[]>(cloneArray(players))
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
		return <Center>{winner.name} wins!</Center>
	}

	return (
		<VStack>
			<List>
				{playerList.map(player => {
					if (player.score > 0) {
						return (
							<ListItem key={player.name}>
								<Text>
									{player.name} - {convertScoreToLetters(player.score)}
								</Text>
							</ListItem>
						)
					} else {
						return (
							<ListItem key={player.name}>
								<Text style={{ textDecoration: 'line-through' }}>
									{player.name} - {convertScoreToLetters(player.score)}
								</Text>
							</ListItem>
						)
					}
				})}
			</List>
			<VStack>
				{hasTrickBeenSet ? (
					<>
						<Text>
							{currentPlayer?.name} is copying {currentSetter!.name}'s trick
						</Text>
						<ButtonGroup>
							<Button onClick={onTrickCopyFailed}>Failed</Button>
							<Button onClick={onTrickCopyFinished}>Done</Button>
						</ButtonGroup>
					</>
				) : (
					<>
						<Text>{currentPlayer?.name} is setting a trick</Text>
						<ButtonGroup>
							<Button onClick={onTrickSetFailed}>Failed</Button>
							<Button onClick={onTrickSet}>Done</Button>
						</ButtonGroup>
					</>
				)}
			</VStack>
		</VStack>
	)
}

export default Game
