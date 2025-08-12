import { Pressable, PressableProps, StyleSheet, TextProps } from 'react-native'
import Text from './Text'

type TextButtonProps = PressableProps & Pick<TextProps, 'children'>

const TextButton: React.FC<TextButtonProps> = ({
    children,
    disabled,
    ...props
}) => {
    const disabledStyle = { color: disabled ? '#bbb' : '#000' }
    return (
        <Pressable disabled={disabled} {...props}>
            <Text style={[styles.menuButtonText, disabledStyle]}>
                {children}
            </Text>
        </Pressable>
    )
}

export default TextButton

const styles = StyleSheet.create({
    menuButtonText: {
        fontSize: 28,
        textAlign: 'center',
    },
})
