import { StyleSheet, TextInput, TextInputProps } from 'react-native'

const SKTextInput: React.FC<TextInputProps> = props => {
    return <TextInput {...props} style={[styles.textInput, props.style]} />
}

export default SKTextInput

const styles = StyleSheet.create({
    textInput: {},
})
