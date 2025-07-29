type Game = {
    completed: boolean
    currentPlayers: Player[]
    letters: string
    winner?: Player
}

type Player = {
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

// type Game = {
//   currentPlayers: Player[];
//   eliminatedPlayers: Player[];
//   scores: PlayerScore[];
//   rounds: GameRound[];
//   completed: boolean;
//   rules: GameRules;
//   winner?: Player;
// };
//
// type GameRules = {
//   length: number;
//   letters: string;
// };
//
// type GameRound = {
//   trick: string;
//   setter: Player;
//   currentCopier: Player;
//   playerData: (PlayerScore & { isSetter: boolean; copied?: boolean })[];
//   completed: boolean;
//   eliminatedPlayers: Player[];
// };
//
// type Player = {
//   name: string;
//   score: number;
//   addLetter: () => void;
//   isEliminated: boolean;
// };
//
// type PlayerScore = Pick<Player, "name" | "score">;
