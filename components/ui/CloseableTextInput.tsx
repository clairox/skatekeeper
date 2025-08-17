import {
    BackHandler,
    Pressable,
    StyleSheet,
    TextInputProps,
    View,
} from 'react-native'
import { useEffect } from 'react'
import TextInput from './primitives/TextInput'
import { X } from 'phosphor-react-native'

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
        <View
            style={{
                flexDirection: 'row',
                gap: 5,
                width: '100%',
            }}
        >
            <TextInput {...props} style={{}} />
            <Pressable
                onPress={onClose}
                style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: 40,
                    height: 40,
                }}
            >
                <X size={20} weight="bold" />
            </Pressable>
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
