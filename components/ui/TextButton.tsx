import { Pressable, PressableProps, StyleSheet, TextProps } from 'react-native'
import Text from './primitives/Text'
import { useTheme } from '../../context/ThemeContext'

type TextButtonProps = PressableProps & Pick<TextProps, 'children'>

const TextButton: React.FC<TextButtonProps> = ({
    children,
    disabled,
    ...props
}) => {
    const { theme } = useTheme()

    const style = {
        ...styles.text,
        color: disabled
            ? theme === 'light'
                ? '#bbb'
                : '#333'
            : theme === 'light'
              ? '#111'
              : '#ddd',
    }

    return (
        <Pressable disabled={disabled} {...props}>
            <Text style={style}>{children}</Text>
        </Pressable>
    )
}

export default TextButton

const styles = StyleSheet.create({
    text: {
        fontSize: 28,
        textAlign: 'center',
    },
})
