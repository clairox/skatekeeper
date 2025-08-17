import { useState } from 'react'
import { Pressable, View } from 'react-native'
import TextInput from './primitives/TextInput'
import { Plus } from 'phosphor-react-native'
import { useTheme } from '../../context/ThemeContext'

type PlayerInputProps = {
    onPlayerAdded: (name: string) => void
    placeholder: string
}

const PlayerInput: React.FC<PlayerInputProps> = ({
    onPlayerAdded,
    placeholder,
}) => {
    const { theme } = useTheme()

    const [value, setValue] = useState('')

    const handleSubmit = () => {
        const name = value ? value : placeholder
        onPlayerAdded(name)
        setValue('')
    }

    const iconColor = theme === 'light' ? '#111' : '#ddd'

    return (
        <View
            style={{
                flexDirection: 'row',
                width: '100%',
            }}
        >
            <TextInput
                value={value}
                onChangeText={setValue}
                placeholder={placeholder}
                onSubmitEditing={handleSubmit}
                style={{
                    flex: 0.8,
                }}
            />
            <Pressable
                onPress={handleSubmit}
                style={{
                    flex: 0.2,
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: 40,
                }}
            >
                <Plus size={20} weight="bold" color={iconColor} />
            </Pressable>
        </View>
    )
}

export default PlayerInput
