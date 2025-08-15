import Text from './Text'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from './DropdownMenu'
import { DotsThreeOutlineVerticalIcon } from 'phosphor-react-native'

type OverflowMenuProps = {
    options: { title: string; onPress: () => void }[]
}

const OverflowMenu: React.FC<OverflowMenuProps> = ({ options }) => {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger>
                <DotsThreeOutlineVerticalIcon size={20} weight="fill" />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                {options.map((option, idx) => {
                    return (
                        <DropdownMenuItem
                            onPress={() => {
                                option.onPress()
                            }}
                            key={idx + option.title}
                            style={{
                                justifyContent: 'center',
                                paddingLeft: 20,
                                height: 40,
                            }}
                        >
                            <Text>{option.title}</Text>
                        </DropdownMenuItem>
                    )
                })}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default OverflowMenu
