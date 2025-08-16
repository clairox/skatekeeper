import { Check } from 'phosphor-react-native'
import { Pressable, PressableProps } from 'react-native'

type LandedButtonProps = PressableProps

const LandedButton: React.FC<LandedButtonProps> = props => {
    return (
        <Pressable {...props} style={{}}>
            <Check size={50} weight="bold" />
        </Pressable>
    )
}

export default LandedButton
