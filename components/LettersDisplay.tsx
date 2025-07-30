import { StyleProp, StyleSheet, Text, TextStyle, View } from 'react-native'

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
                    <Text key={`${idx}-${letter}`} style={letterStyles}>
                        {letter}
                    </Text>
                )
            })}
        </View>
    )
}

export default LettersDisplay

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        gap: 5,
    },
    letter: {
        fontSize: 40,
        fontWeight: 'bold',
        color: '#ccc',
    },
    earnedLetter: {
        color: '#000',
    },
})
