import { Button, View } from 'react-native'
import { useEffect, useState } from 'react'
import StyledText from '../ui/StyledText'
import StyledView from '../ui/StyledView'

type InitLettersStepProps = {
    setLetters: (newLetters: string) => void
    next: () => void
}

const InitLettersStep: React.FC<InitLettersStepProps> = ({
    setLetters,
    next,
}) => {
    const [done, setDone] = useState(false)

    useEffect(() => {
        if (done) {
            next()
        }
    }, [done, next])

    const initLetters = async (letters: string) => {
        setLetters(letters)
        setDone(true)
    }

    return (
        <StyledView>
            <StyledText>Choose a game mode</StyledText>
            <View
                style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    gap: 50,
                }}
            >
                <Button title="SKATE" onPress={() => initLetters('SKATE')} />
                <Button title="SK8" onPress={() => initLetters('SK8')} />
            </View>
        </StyledView>
    )
}

export default InitLettersStep
