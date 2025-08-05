import { Button, Text, View } from 'react-native'
import { useEffect, useState } from 'react'
import { useGameActions } from '../../context/GameStoreContext'

type InitLettersStepProps = StepProps

const InitLettersStep: React.FC<InitLettersStepProps> = ({ next }) => {
    const { initLetters } = useGameActions()

    const [done, setDone] = useState(false)

    useEffect(() => {
        if (done) {
            next()
        }
    }, [done, next])

    const _initLetters = async (letters: string) => {
        await initLetters(letters)
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
                <Button title="SKATE" onPress={() => _initLetters('SKATE')} />
                <Button title="SK8" onPress={() => _initLetters('SK8')} />
            </View>
        </>
    )
}

export default InitLettersStep
