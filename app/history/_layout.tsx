import { StyleSheet, View } from 'react-native'
import { Slot } from 'expo-router'

const HistoryLayout = () => {
    return (
        <View style={styles.container}>
            <Slot />
        </View>
    )
}

export default HistoryLayout

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
    },
})
