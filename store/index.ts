import { createStore } from 'zustand'

export type GameState = {
    letters: string
    turn: number
    currentTrick: string | null
    setterId: number | null
    players: Player[]
    activePlayers: Player[]
    winnerId: number | null
    actions: GameStateActions
}

type GameStateActions = {
    initGame: (letters: string, players: Player[]) => Promise<void>
    onPlayerSetSuccess: (trick: string) => Promise<void>
    onPlayerSetFailure: () => Promise<void>
    onPlayerCopySuccess: () => Promise<void>
    onPlayerCopyFailure: () => Promise<void>
}

export const createGameStore = (recordHandler: GameRecordHandler) => {
    const getNextTurn = (currentTurn: number, activePlayers: Player[]) => {
        if (currentTurn + 1 >= activePlayers.length) {
            return 0
        }

        return currentTurn + 1
    }

    const shufflePlayers = (players: Player[]) => {
        let shuffledPlayers = [...players]

        let currentIdx = shuffledPlayers.length
        while (currentIdx > 0) {
            let randomIdx = Math.floor(Math.random() * currentIdx)
            currentIdx -= 1
            ;[shuffledPlayers[currentIdx], shuffledPlayers[randomIdx]] = [
                shuffledPlayers[randomIdx],
                shuffledPlayers[currentIdx],
            ]
        }

        return shuffledPlayers
    }

    return createStore<GameState>((set, get) => ({
        letters: '',
        turn: 0,
        currentTrick: null,
        setterId: null,
        players: [],
        activePlayers: [],
        winnerId: null,
        actions: {
            initGame: async (letters, players) => {
                const activePlayers = shufflePlayers(players)
                set({
                    letters: letters.toUpperCase(),
                    players: activePlayers,
                    activePlayers,
                    setterId: activePlayers[0].id,
                })

                await recordHandler.init(letters.toUpperCase(), activePlayers)

                console.log(`Letters: ${letters}`)
                console.log(
                    `Added ${players.length} players: ${JSON.stringify(players.map(player => player.name))}`
                )
                console.log(`Starting game...`)
            },
            onPlayerSetSuccess: async (trick: string) => {
                if (!trick) {
                    throw new Error("'trick' must contain a value")
                }

                const { activePlayers, turn } = get()
                const nextTurn = getNextTurn(turn, activePlayers)
                set({
                    currentTrick: trick,
                    turn: nextTurn,
                })

                await recordHandler.update({
                    playerId: activePlayers[turn].id,
                    type: 'set',
                    status: 'success',
                    trick,
                    nextTurn,
                })

                console.log(
                    `${activePlayers[turn].name} has set the trick to ${trick}.`
                )
            },
            onPlayerSetFailure: async () => {
                const { activePlayers, turn } = get()
                const nextTurn = getNextTurn(turn, activePlayers)
                set({ turn: nextTurn, setterId: activePlayers[nextTurn].id })

                await recordHandler.update({
                    playerId: activePlayers[turn].id,
                    type: 'set',
                    status: 'failed',
                    nextTurn,
                })

                console.log(
                    `${activePlayers[turn].name} failed to set the trick.`
                )
            },
            onPlayerCopySuccess: async () => {
                const { activePlayers, turn, currentTrick, setterId } = get()
                const nextTurn = getNextTurn(turn, activePlayers)
                const roundOver = activePlayers[nextTurn].id === setterId

                set({
                    turn: getNextTurn(turn, activePlayers),
                    currentTrick: roundOver ? null : currentTrick,
                })

                await recordHandler.update({
                    playerId: activePlayers[turn].id,
                    type: 'copy',
                    status: 'success',
                    nextTurn,
                    roundOver,
                })

                console.log(
                    `${activePlayers[turn].name} has copied the ${currentTrick}.`
                )
            },
            onPlayerCopyFailure: async () => {
                const {
                    players,
                    activePlayers,
                    turn,
                    letters,
                    currentTrick,
                    setterId,
                } = get()

                const currentPlayer = activePlayers[turn]
                const points = currentPlayer.points + 1

                const shouldEliminate = points === letters.length

                const updatedPlayers = players.map(player => {
                    if (player.id === currentPlayer.id) {
                        return {
                            ...player,
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
                if (shouldEliminate) {
                    nextTurn = turn >= updatedActivePlayers.length ? 0 : turn
                } else {
                    nextTurn = getNextTurn(turn, updatedActivePlayers)
                }

                const gameOver = updatedActivePlayers.length === 1
                const winner = gameOver ? updatedActivePlayers[0] : null

                const roundOver = updatedActivePlayers[nextTurn].id === setterId

                set({
                    turn: nextTurn,
                    players: updatedPlayers,
                    activePlayers: updatedActivePlayers,
                    winnerId: winner?.id ?? null,
                    currentTrick: roundOver ? null : currentTrick,
                })

                await recordHandler.update({
                    playerId: currentPlayer.id,
                    playerEliminated: shouldEliminate,
                    type: 'copy',
                    status: 'failed',
                    nextTurn,
                    players: updatedPlayers,
                    activePlayers: updatedActivePlayers,
                    winnerId: winner?.id,
                    roundOver,
                })

                console.log(
                    `${currentPlayer.name} has failed to copy the ${currentTrick}.`
                )
                console.log(
                    `${currentPlayer.name}: ${letters.slice(0, points)}`
                )

                if (shouldEliminate) {
                    console.log(`${currentPlayer.name} has been eliminated.`)
                }

                if (winner) {
                    console.log(`The winner is ${winner.name}.`)
                }
            },
        },
    }))
}
