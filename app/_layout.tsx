import MultiPlatformSafeAreaView from '../components/ui/MultiPlatformSafeAreaView'
import { Slot, SplashScreen } from 'expo-router'
import {
    SpaceGrotesk_400Regular,
    SpaceGrotesk_500Medium,
} from '@expo-google-fonts/space-grotesk'
import { ShantellSans_600SemiBold } from '@expo-google-fonts/shantell-sans'
import { useFonts } from 'expo-font'
import { useEffect } from 'react'

SplashScreen.preventAutoHideAsync()

const RootLayout = () => {
    const [loaded, error] = useFonts({
        SpaceGrotesk_400Regular,
        SpaceGrotesk_500Medium,
        ShantellSans_600SemiBold,
    })

    useEffect(() => {
        if (loaded || error) {
            SplashScreen.hideAsync()
        }
    }, [loaded, error])

    if (!loaded && !error) {
        return null
    }

    return (
        <MultiPlatformSafeAreaView>
            <Slot />
        </MultiPlatformSafeAreaView>
    )
}

export default RootLayout
