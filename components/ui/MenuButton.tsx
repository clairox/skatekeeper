import {
    Image,
    ImageProps,
    Pressable,
    PressableProps,
    StyleSheet,
    TextProps,
} from 'react-native'
import Text from './Text'

type MenuTextButtonProps = PressableProps & Pick<TextProps, 'children'>

const MenuTextButton: React.FC<MenuTextButtonProps> = ({
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

type MenuImageButtonProps = PressableProps & Pick<ImageProps, 'source'>

const MenuImageButton: React.FC<MenuImageButtonProps> = ({
    source,
    ...props
}) => {
    return (
        <Pressable {...props}>
            <Image source={source} />
        </Pressable>
    )
}

export { MenuTextButton, MenuImageButton }

const styles = StyleSheet.create({
    menuButtonText: {
        fontSize: 28,
        textAlign: 'center',
    },
})
