import {
    Button,
    Platform,
    SafeAreaView,
    StatusBar,
    StyleSheet,
    View,
    ViewProps,
} from 'react-native'
import { useTheme } from '../../context/ThemeContext'

const MultiPlatformSafeAreaView: React.FC<ViewProps> = ({
    style,
    ...props
}) => {
    const { theme, toggleTheme } = useTheme()

    const themeContainerStyle =
        theme === 'light' ? styles.lightContainer : styles.darkContainer

    if (Platform.OS === 'ios') {
        return <SafeAreaView {...props} style={themeContainerStyle} />
    }

    return (
        <View
            style={[styles.androidSafeArea, themeContainerStyle, style]}
            {...props}
        >
            <Button title="Switch Theme" onPress={toggleTheme} />
            {props.children}
        </View>
    )
}

export default MultiPlatformSafeAreaView

const styles = StyleSheet.create({
    androidSafeArea: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
        width: '100%',
    },
    lightContainer: {
        backgroundColor: '#ddd',
    },
    darkContainer: {
        backgroundColor: '#111',
    },
})
