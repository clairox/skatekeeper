import { Slot } from 'expo-router'
import { GameProvider } from '../../context/GameContext'
import { HistoryRecordProvider } from '../../context/HistoryRecordContext'
import { useGlobalSearchParams, useRouter } from 'expo-router/build/hooks'
import { useEffect, useState } from 'react'
import { BackHandler } from 'react-native'

const GameLayout = () => {
    const router = useRouter()
    const searchParams = useGlobalSearchParams()

    const [key, setKey] = useState('default')

    useEffect(() => {
        const onBackPress = () => {
            router.dismissTo('/')
            return true
        }
        const backHandler = BackHandler.addEventListener(
            'hardwareBackPress',
            onBackPress
        )

        return () => backHandler.remove()
    }, [router])

    useEffect(() => {
        if (searchParams['key'] && searchParams['key'] !== 'default') {
            setKey(searchParams['key'] as string)
        }
    }, [searchParams])

    useEffect(() => {
        console.log('key:', key)
    }, [key])

    return (
        <HistoryRecordProvider key={key}>
            <GameProvider>
                <Slot />
            </GameProvider>
        </HistoryRecordProvider>
    )
}

export default GameLayout
