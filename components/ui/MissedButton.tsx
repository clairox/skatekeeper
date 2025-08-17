import { X } from 'phosphor-react-native'
import { Pressable, PressableProps } from 'react-native'
import { useTheme } from '../../context/ThemeContext'

type MissedButtonProps = PressableProps

const MissedButton: React.FC<MissedButtonProps> = props => {
    const { theme } = useTheme()

    const iconColor = theme === 'light' ? '#111' : '#ddd'

    return (
        <Pressable {...props} style={{}}>
            <X size={50} weight="bold" color={iconColor} />
        </Pressable>
    )
}

export default MissedButton
