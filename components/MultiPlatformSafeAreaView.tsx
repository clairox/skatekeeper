import {
    Platform,
    SafeAreaView,
    StatusBar,
    StyleSheet,
    useColorScheme,
    View,
    ViewProps,
} from 'react-native'

const MultiPlatformSafeAreaView: React.FC<ViewProps> = props => {
    const colorScheme = useColorScheme()

    const themeContainerStyle =
        colorScheme === 'light' ? styles.lightContainer : styles.darkContainer

    if (Platform.OS === 'ios') {
        return <SafeAreaView {...props} style={themeContainerStyle} />
    }

    return (
        <View
            style={[styles.androidSafeArea, themeContainerStyle]}
            {...props}
        />
    )
}

export default MultiPlatformSafeAreaView

const styles = StyleSheet.create({
    androidSafeArea: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 30,
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
        width: '100%',
    },
    lightContainer: {
        backgroundColor: '#ddd',
    },
    darkContainer: {
        backgroundColor: '#000',
    },
})
