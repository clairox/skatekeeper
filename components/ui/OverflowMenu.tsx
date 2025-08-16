import Text from './Text'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from './DropdownMenu'
import { DotsThreeVerticalIcon } from 'phosphor-react-native'

type OverflowMenuProps = {
    options: { title: string; onPress: () => void }[]
}

const OverflowMenu: React.FC<OverflowMenuProps> = ({ options }) => {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger>
                <DotsThreeVerticalIcon size={28} weight="bold" />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                {options.map((option, idx) => {
                    return (
                        <DropdownMenuItem
                            onPress={() => {
                                option.onPress()
                            }}
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
