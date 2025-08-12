import { Image, StyleSheet, useColorScheme, View } from 'react-native'
import { useRouter } from 'expo-router'
import TextButton from '../components/ui/TextButton'

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
            <TextButton
                onPress={() =>
                    router.push('/game?refreshKey=' + Date.now().toString())
                }
            >
                New Game
            </TextButton>
            <TextButton onPress={() => router.push('/history')}>
                History
            </TextButton>
        </View>
    )
}

export default Home

const styles = StyleSheet.create({
    container: {
        flex: 0.9,
        alignItems: 'center',
        gap: 20,
    },
    brand: {
        height: 175,
    },
})
