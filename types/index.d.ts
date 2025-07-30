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
