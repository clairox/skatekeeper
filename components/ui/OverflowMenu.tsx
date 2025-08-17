import Text from './Text'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from './DropdownMenu'
import { DotsThreeVertical } from 'phosphor-react-native'
import { useTheme } from '../../context/ThemeContext'

type OverflowMenuProps = {
    options: Option[]
}

const OverflowMenu: React.FC<OverflowMenuProps> = ({ options }) => {
    const { theme } = useTheme()

    const iconColor = theme === 'light' ? '#111' : '#ddd'

    return (
        <DropdownMenu>
            <DropdownMenuTrigger>
                <DotsThreeVertical size={28} weight="bold" color={iconColor} />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                {options.map((option, idx) => {
                    return (
                        <DropdownMenuItem
                            onPress={option.callback}
                            key={idx + option.title}
                        >
                            <Text
                                style={{
                                    fontFamily: 'SpaceGrotesk_400Regular',
                                    fontSize: 16,
                                }}
                            >
                                {option.title}
                            </Text>
                        </DropdownMenuItem>
                    )
                })}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default OverflowMenu
