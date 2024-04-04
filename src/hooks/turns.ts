import { useRef, useState } from 'react'

export const useTurns = (players: Player[]) => {
	const currentIdx = useRef(0)
	const [currentPlayer, setCurrentPlayer] = useState(players[currentIdx.current])

	const nextTurn = () => {
		const next = () => (currentIdx.current + 1 >= players.length ? 0 : currentIdx.current + 1)

		do {
			currentIdx.current = next()
		} while (players[currentIdx.current].score <= 0)

		setCurrentPlayer(players[currentIdx.current])

		return { player: players[currentIdx.current] }
	}

	return {
		currentPlayer,
		nextTurn,
	}
}
