import { StyleProp, StyleSheet, TextStyle, View } from 'react-native'
import StyledText from './StyledText'

type LettersDisplayProps = {
    letters: string
    totalPoints: number
}

const LettersDisplay: React.FC<LettersDisplayProps> = ({
    letters,
    totalPoints,
}) => {
    return (
        <View style={styles.container}>
            {Array.from(letters).map((letter, idx) => {
                const letterStyles: StyleProp<TextStyle> = [styles.letter]
                if (totalPoints >= idx + 1) {
                    letterStyles.push(styles.earnedLetter)
                }

                return (
                    <StyledText key={`${idx}-${letter}`} style={letterStyles}>
                        {letter}
                    </StyledText>
                )
            })}
        </View>
    )
}

export default LettersDisplay

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
    },
    letter: {
        fontFamily: 'ShantellSans_600SemiBold',
        fontSize: 40,
        color: '#ccc',
        letterSpacing: 0,
    },
    earnedLetter: {
        color: '#000',
    },
})
