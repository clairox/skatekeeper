import { Button, Text, View } from 'react-native'
import { useEffect, useState } from 'react'

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
        <>
            <Text>Choose a game mode</Text>
            <View
                style={{
                    flexDirection: 'row',
                    gap: 50,
                    justifyContent: 'center',
                }}
            >
                <Button title="SKATE" onPress={() => initLetters('SKATE')} />
                <Button title="SK8" onPress={() => initLetters('SK8')} />
            </View>
        </>
    )
}

export default InitLettersStep
