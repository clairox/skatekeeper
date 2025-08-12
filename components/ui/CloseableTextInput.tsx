import {
    BackHandler,
    StyleSheet,
    TextInput,
    TextInputProps,
    View,
} from 'react-native'
import { MenuTextButton } from './MenuButton'
import { useEffect } from 'react'

type CloseableTextInputProps = TextInputProps & {
    onClose: () => void
}

const CloseableTextInput: React.FC<CloseableTextInputProps> = ({
    onClose,
    style,
    ...props
}) => {
    useEffect(() => {
        const onBackPress = () => {
            onClose()
            return true
        }
        const backHandler = BackHandler.addEventListener(
            'hardwareBackPress',
            onBackPress
        )

        return () => backHandler.remove()
    }, [onClose])

    return (
        <View style={[styles.container, style]}>
            <TextInput style={styles.textInput} {...props} />
            <MenuTextButton onPress={onClose}>x</MenuTextButton>
        </View>
    )
}

export default CloseableTextInput

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 10,
    },
    textInput: {
        width: '80%',
        borderWidth: 1,
    },
})
