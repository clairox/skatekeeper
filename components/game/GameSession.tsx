import { useGameContext } from '../../context/GameContext'
import TrickCopyView from '../screens/TrickCopyScreen'
import TrickSetView from '../screens/TrickSetScreen'

const GameSession = () => {
    const {
        state: { currentTrick },
    } = useGameContext()

    if (currentTrick) {
        return <TrickCopyView />
    }

    return <TrickSetView />
}

export default GameSession
