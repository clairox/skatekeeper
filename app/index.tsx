import { Image, StyleSheet, useColorScheme, View } from 'react-native'
import { useRouter } from 'expo-router'
import { MenuTextButton } from '../components/ui/MenuButton'

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
            <MenuTextButton
                onPress={() =>
                    router.push('/game?refreshKey=' + Date.now().toString())
                }
            >
                New Game
            </MenuTextButton>
            <MenuTextButton onPress={() => router.push('/history')}>
                History
            </MenuTextButton>
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
