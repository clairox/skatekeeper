import { StyleProp, StyleSheet, TextStyle, View } from 'react-native'
import Text from './primitives/Text'
import { useTheme } from '../../context/ThemeContext'

type LetterProgressProps = {
    letters: string
    totalPoints: number
}

const LetterProgress: React.FC<LetterProgressProps> = ({
    letters,
    totalPoints,
}) => {
    const { theme } = useTheme()

    const unearnedLetterColorStyle = {
        color: theme === 'light' ? '#ccc' : '#222',
    }
    const earnedLetterColorStyle = {
        color: theme === 'light' ? '#111' : '#ddd',
    }
    return (
        <View style={styles.container}>
            {Array.from(letters).map((letter, idx) => {
                const colorStyle: StyleProp<TextStyle> =
                    totalPoints >= idx + 1
                        ? earnedLetterColorStyle
                        : unearnedLetterColorStyle

                return (
                    <Text
                        key={`${idx}-${letter}`}
                        style={[styles.letter, colorStyle]}
                    >
                        {letter}
                    </Text>
                )
            })}
        </View>
    )
}

export default LetterProgress

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
    },
    letter: {
        fontFamily: 'ShantellSans_600SemiBold',
        fontSize: 40,
        letterSpacing: 0,
    },
})
