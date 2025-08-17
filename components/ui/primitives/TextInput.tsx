import {
    StyleSheet,
    TextInputProps as RNTextInputProps,
    TextInput as RNTextInput,
} from 'react-native'
import { useTheme } from '../../../context/ThemeContext'

type TextInputProps = RNTextInputProps

const TextInput: React.FC<TextInputProps> = props => {
    const { theme } = useTheme()
    const isLightTheme = theme === 'light'

    const textInputStyle = {
        ...styles.textInput,
        borderColor: isLightTheme ? '#111' : '#ddd',
        textDecorationColor: isLightTheme ? '#111' : '#ddd',
    }

    const placeholderTextColor = isLightTheme ? '#888' : '#555'

    return (
        <RNTextInput
            {...props}
            style={[textInputStyle, props.style]}
            placeholderTextColor={placeholderTextColor}
        />
    )
}

export default TextInput

const styles = StyleSheet.create({
    textInput: {
        padding: 8,
        width: '100%',
        borderBottomWidth: 1,
        borderColor: '#111',
        fontFamily: 'SpaceGrotesk_400Regular',
        fontSize: 16,
    },
})
