type Game = {
    completed: boolean
    currentPlayers: Player[]
    letters: string
    winner?: Player
}

type Player = {
    id: number
    isEliminated: boolean
    name: string
    points: number
}

type Round = {
    setter: Player
    trick: string
}

type StepProps = {
    next: () => void
}

type GameRecordRoundPlayer = Player & {
    copied?: boolean
}

type GameRecordRound = {
    trick?: string
    setterId?: number
    activePlayers: GameRecordRoundPlayer[]
    eliminatedPlayers: Player[]
    completed: boolean
}

type GameRecord = {
    letters?: string
    players: Player[]
    turn: number
    winnerId?: number
    rounds: GameRecordRound[]
}

type UpdateGameRecord = {
    playerId: number
    type: 'set' | 'copy'
    status: 'success' | 'failed'
    nextTurn: number
    trick?: string
    players?: Player[]
    activePlayers?: Player[]
    playerEliminated?: boolean
    winnerId?: number
    roundOver?: boolean
}

type GameRecordHandler = {
    init: (letters: string, players: Player[]) => Promise<void>
    update: (data: UpdateGameRecord) => Promise<void>
}
