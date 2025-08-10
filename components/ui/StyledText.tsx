import { StyleSheet, Text, TextProps } from 'react-native'

type StyledTextProps = TextProps

const StyledText: React.FC<StyledTextProps> = ({ style, ...props }) => {
    return <Text style={[styles.text, style]} {...props} />
}

export default StyledText

const styles = StyleSheet.create({
    text: {
        fontFamily: 'SpaceGrotesk_500Medium',
        fontSize: 18,
    },
})
