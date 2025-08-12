import StyledView from '../ui/StyledView'
import { View } from 'react-native'
import Text from '../ui/Text'
import { MenuTextButton } from '../ui/MenuButton'

type LettersSetupProps = {
    setLetters: (letters: string) => void
    done: () => void
}

const LettersSetup: React.FC<LettersSetupProps> = ({ setLetters, done }) => {
    return (
        <StyledView style={{ gap: 20 }}>
            <Text>Choose a game mode</Text>
            <View
                style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    gap: 50,
                    width: '70%',
                }}
            >
                <MenuTextButton
                    onPress={() => {
                        setLetters('SKATE')
                        done()
                    }}
                >
                    SKATE
                </MenuTextButton>
                <MenuTextButton
                    onPress={() => {
                        setLetters('SK8')
                        done()
                    }}
                >
                    SK8
                </MenuTextButton>
            </View>
        </StyledView>
    )
}

export default LettersSetup
