import CompactView from '../ui/CompactView'
import { View } from 'react-native'
import Text from '../ui/Text'
import TextButton from '../ui/TextButton'

type LettersSetupProps = {
    setLetters: (letters: string) => void
    done: () => void
}

const LettersSetup: React.FC<LettersSetupProps> = ({ setLetters, done }) => {
    return (
        <CompactView style={{ gap: 20 }}>
            <Text>Choose a game mode</Text>
            <View
                style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    gap: 50,
                    width: '70%',
                }}
            >
                <TextButton
                    onPress={() => {
                        setLetters('SKATE')
                        done()
                    }}
                >
                    SKATE
                </TextButton>
                <TextButton
                    onPress={() => {
                        setLetters('SK8')
                        done()
                    }}
                >
                    SK8
                </TextButton>
            </View>
        </CompactView>
    )
}

export default LettersSetup
