import { View } from 'react-native'
import { useEffect, useState } from 'react'
import StyledText from '../ui/StyledText'
import StyledView from '../ui/StyledView'
import { MenuTextButton } from '../ui/MenuButton'

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
        <StyledView style={{ gap: 20 }}>
            <StyledText>Choose a game mode</StyledText>
            <View
                style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    gap: 50,
                    width: '70%',
                }}
            >
                <MenuTextButton onPress={() => initLetters('SKATE')}>
                    SKATE
                </MenuTextButton>
                <MenuTextButton onPress={() => initLetters('SK8')}>
                    SK8
                </MenuTextButton>
            </View>
        </StyledView>
    )
}

export default InitLettersStep
