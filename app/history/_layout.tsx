import { StyleSheet } from 'react-native'
import MultiPlatformSafeAreaView from '../../components/MultiPlatformSafeAreaView'
import { Slot } from 'expo-router'

const HistoryLayout = () => {
    return (
        <MultiPlatformSafeAreaView style={styles.container}>
            <Slot />
        </MultiPlatformSafeAreaView>
    )
}

export default HistoryLayout

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
    },
})
