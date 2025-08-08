import { Button, Image, StyleSheet, useColorScheme, View } from 'react-native'
import { useRouter } from 'expo-router'

const Home = () => {
    const router = useRouter()

    const colorScheme = useColorScheme()
    const imageSource =
        colorScheme === 'light'
            ? require('../assets/skatekeeper-logo-light.png')
            : require('../assets/skatekeeper-logo-dark.png')

    return (
        <View style={styles.container}>
            <Image
                source={imageSource}
                style={styles.brand}
                resizeMode="contain"
            />
            <Button
                title="New Game"
                onPress={() => router.push('/game/setup')}
            />
            <Button title="History" onPress={() => router.push('/history')} />
        </View>
    )
}

export default Home

const styles = StyleSheet.create({
    container: {
        flex: 0.9,
        alignItems: 'center',
    },
    brand: {
        height: 175,
    },
})
