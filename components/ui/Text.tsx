import {
    StyleSheet,
    Text as RNText,
    TextProps as RNTextProps,
} from 'react-native'

type TextProps = RNTextProps

const Text: React.FC<TextProps> = ({ style, ...props }) => {
    return <RNText style={[styles.text, style]} {...props} />
}

export default Text

const styles = StyleSheet.create({
    text: {
        fontFamily: 'SpaceGrotesk_500Medium',
        fontSize: 18,
    },
})
