import { useState } from 'react'
import { Pressable, Text, TextInput, View } from 'react-native'

type PlayerInputProps = {
    onPlayerAdded: (name: string) => void
    placeholder: string
}

const PlayerInput: React.FC<PlayerInputProps> = ({
    onPlayerAdded,
    placeholder,
}) => {
    const [value, setValue] = useState('')

    const handleSubmit = () => {
        const name = value ? value : placeholder
        onPlayerAdded(name)
        setValue('')
    }

    return (
        <View
            style={{
                flexDirection: 'row',
                gap: 10,
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
                    padding: 0,
                    height: 40,
                    borderWidth: 1,
                    borderColor: '#000000',
                }}
            />
            <Pressable
                onPress={handleSubmit}
                style={{
                    flex: 0.2,
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: 40,
                    backgroundColor: '#000',
                }}
            >
                <Text style={{ color: '#fff', fontSize: 20 }}>+</Text>
            </Pressable>
        </View>
    )
}

export default PlayerInput
