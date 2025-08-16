import { X } from 'phosphor-react-native'
import { Pressable, PressableProps } from 'react-native'

type MissedButtonProps = PressableProps

const MissedButton: React.FC<MissedButtonProps> = props => {
    return (
        <Pressable {...props} style={{}}>
            <X size={50} weight="bold" />
        </Pressable>
    )
}

export default MissedButton
