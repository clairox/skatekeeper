import { Check } from 'phosphor-react-native'
import { Pressable, PressableProps } from 'react-native'
import { useTheme } from '../../context/ThemeContext'

type LandedButtonProps = PressableProps

const LandedButton: React.FC<LandedButtonProps> = props => {
    const { theme } = useTheme()

    const iconColor = theme === 'light' ? '#111' : '#ddd'

    return (
        <Pressable {...props} style={{}}>
            <Check size={50} weight="bold" color={iconColor} />
        </Pressable>
    )
}

export default LandedButton
