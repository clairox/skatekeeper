type GameState = {
    id?: number
    letters: string
    players: Player[]
    activePlayers: Player[]
    turn: number
    currentTrick: string | null
    setterId: number | null
    winnerId: number | null
}

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

type HistoryRecord = {
    id: number
    completed: boolean
    data: HistoryData
    createdAt: Date
    completedAt: Date | null
}

type HistoryData = {
    letters?: string
    players: Player[]
    turn: number
    winnerId?: number
    rounds: HistoryRound[]
}

type HistoryRound = {
    trick?: string
    setterId?: number
    activePlayers: HistoryActivePlayer[]
    eliminatedPlayers: Player[]
    completed: boolean
}

type HistoryActivePlayer = Player & {
    copied?: boolean
}

type HistoryRecordHandler = {
    init: (letters: string, players: Player[]) => Promise<void>
    update: (data: UpdateHistoryValues) => Promise<void>
}

type AddHistoryValues = Omit<HistoryRecord, 'id'>

type UpdateHistoryValues = {
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
