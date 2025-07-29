import {
    Platform,
    SafeAreaView,
    StatusBar,
    StyleSheet,
    View,
    ViewProps,
} from 'react-native'

const MultiPlatformSafeAreaView: React.FC<ViewProps> = props => {
    if (Platform.OS === 'ios') {
        return <SafeAreaView {...props} />
    }

    return <View style={[styles.androidSafeArea]} {...props} />
}

export default MultiPlatformSafeAreaView

const styles = StyleSheet.create({
    androidSafeArea: {
        flex: 0.5,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 30,
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
        width: '100%',
    },
})
