import {
    StyleSheet,
    Text as RNText,
    TextProps as RNTextProps,
} from 'react-native'
import { useTheme } from '../../context/ThemeContext'

type TextProps = RNTextProps

const Text: React.FC<TextProps> = ({ style, ...props }) => {
    const { theme } = useTheme()
    const color = theme === 'light' ? '#111' : '#ddd'
    return <RNText style={[styles.text, { color }, style]} {...props} />
}

export default Text

const styles = StyleSheet.create({
    text: {
        fontFamily: 'SpaceGrotesk_500Medium',
        fontSize: 18,
    },
})
