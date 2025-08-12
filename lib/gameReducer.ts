export type GameAction =
    | { type: 'RESET' }
    | {
          type: 'SETUP_GAME'
          payload: { letters: string; players: Player[] }
      }
    | {
          type: 'LOAD_GAME'
          payload: GameState
      }
    | { type: 'TRICK_SET_SUCCESS'; payload: { trick: string } }
    | { type: 'TRICK_SET_FAILURE' }
    | { type: 'TRICK_COPY_SUCCESS' }
    | { type: 'TRICK_COPY_FAILURE' }

export const gameReducer = (state: GameState, action: GameAction) => {
    const currentPlayer: Player = state.activePlayers[state.turn]

    const randomizeArrayOrder = <T>(array: T[]): T[] => {
        let randomized = [...array]

        let currentIdx = randomized.length
        while (currentIdx > 0) {
            let randomIdx = Math.floor(Math.random() * currentIdx)
            currentIdx -= 1
            ;[randomized[currentIdx], randomized[randomIdx]] = [
                randomized[randomIdx],
                randomized[currentIdx],
            ]
        }

        return randomized
    }

    const calculateNextTurn = (): number => {
        if (state.turn + 1 >= state.activePlayers.length) {
            return 0
        }

        return state.turn + 1
    }
    switch (action.type) {
        case 'RESET': {
            return {
                letters: '',
                players: [],
                activePlayers: [],
                currentPlayer: {} as Player,
                turn: 0,
                currentTrick: null,
                setterId: null,
                winnerId: null,
            }
        }
        case 'SETUP_GAME': {
            const { letters, players } = action.payload
            if (!letters) {
                throw new Error("'letters' must contain a value.")
            }

            if (players.length < 2) {
                throw new Error('At least 2 players required.')
            }

            const randomizedPlayers = randomizeArrayOrder(players)
            const setter = randomizedPlayers[0]

            console.log(`Letters: ${letters}`)
            console.log(
                `Added ${players.length} players: ${JSON.stringify(players.map(player => player.name))}`
            )
            console.log(`Starting game...`)

            return {
                ...state,
                letters,
                players: randomizedPlayers,
                activePlayers: randomizedPlayers,
                setterId: setter.id,
            }
        }
        case 'LOAD_GAME': {
            return action.payload
        }
        case 'TRICK_SET_SUCCESS': {
            const { trick } = action.payload
            if (!trick) {
                throw new Error("'trick' must contain a value.")
            }
            console.log(`${currentPlayer.name} has set the trick to ${trick}.`)

            return {
                ...state,
                currentTrick: trick,
                turn: calculateNextTurn(),
            }
        }
        case 'TRICK_SET_FAILURE': {
            const nextTurn = calculateNextTurn()
            const setter = state.activePlayers[nextTurn]

            console.log(`${currentPlayer.name} failed to set the trick.`)

            return { ...state, setterId: setter.id, turn: nextTurn }
        }
        case 'TRICK_COPY_SUCCESS': {
            const { activePlayers, setterId, currentTrick } = state
            const nextTurn = calculateNextTurn()
            const nextPlayer = activePlayers[nextTurn]
            const isRoundOver = nextPlayer.id === setterId

            console.log(`${currentPlayer.name} has copied the ${currentTrick}.`)

            return {
                ...state,
                currentTrick: isRoundOver ? null : currentTrick,
                turn: nextTurn,
            }
        }
        case 'TRICK_COPY_FAILURE': {
            const { players, turn, letters, currentTrick, setterId } = state

            const points = currentPlayer.points + 1

            const shouldEliminate = points === letters.length

            const updatedPlayers = players.map(player => {
                if (player.id === currentPlayer.id) {
                    return {
                        ...currentPlayer,
                        points,
                        isEliminated: shouldEliminate ? true : false,
                    }
                }

                return player
            })

            const updatedActivePlayers = updatedPlayers.filter(
                player => !player.isEliminated
            )

            let nextTurn = 0
            if (shouldEliminate && turn < updatedActivePlayers.length) {
                nextTurn = turn
            } else if (
                !shouldEliminate &&
                turn + 1 < updatedActivePlayers.length
            ) {
                nextTurn = turn + 1
            } else {
                nextTurn = 0
            }

            const isGameOver = updatedActivePlayers.length === 1
            const winner = isGameOver ? updatedActivePlayers[0] : null

            const isRoundOver = updatedActivePlayers[nextTurn].id === setterId

            console.log(
                `${currentPlayer.name} has failed to copy the ${currentTrick}.`
            )
            console.log(`${currentPlayer.name}: ${letters.slice(0, points)}`)

            if (shouldEliminate) {
                console.log(`${currentPlayer.name} has been eliminated.`)
            }

            if (winner) {
                console.log(`The winner is ${winner.name}.`)
            }

            return {
                ...state,
                players: updatedPlayers,
                activePlayers: updatedActivePlayers,
                winnerId: winner?.id ?? null,
                currentTrick: isRoundOver ? null : currentTrick,
                turn: nextTurn,
            }
        }
        default: {
            throw new Error('Invalid action:', action)
        }
    }
}
