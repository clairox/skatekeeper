import MultiPlatformSafeAreaView from '../components/MultiPlatformSafeAreaView'
import { Slot } from 'expo-router'

const RootLayout = () => {
    return (
        <MultiPlatformSafeAreaView>
            <Slot />
        </MultiPlatformSafeAreaView>
    )
}

export default RootLayout
