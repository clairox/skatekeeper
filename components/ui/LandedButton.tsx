import { CheckIcon } from 'phosphor-react-native'
import { Pressable, PressableProps } from 'react-native'

type LandedButtonProps = PressableProps

const LandedButton: React.FC<LandedButtonProps> = props => {
    return (
        <Pressable {...props} style={{}}>
            <CheckIcon size={50} weight="bold" />
        </Pressable>
    )
}

export default LandedButton
