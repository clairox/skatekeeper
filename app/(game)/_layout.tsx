import MultiPlatformSafeAreaView from '../../components/MultiPlatformSafeAreaView'
import { Slot } from 'expo-router'
import { GameProvider } from '../../context/GameContext'
import { GameRecordProvider } from '../../context/GameRecordContext'
import { useGlobalSearchParams } from 'expo-router/build/hooks'
import { useEffect, useState } from 'react'

const GameLayout = () => {
    const [key, setKey] = useState('default')
    const searchParams = useGlobalSearchParams()

    useEffect(() => {
        if (searchParams['key'] && searchParams['key'] !== 'default') {
            setKey(searchParams['key'] as string)
        }
    }, [searchParams])

    useEffect(() => {
        console.log('key:', key)
    }, [key])

    return (
        <GameRecordProvider key={key}>
            <GameProvider>
                <MultiPlatformSafeAreaView>
                    <Slot />
                </MultiPlatformSafeAreaView>
            </GameProvider>
        </GameRecordProvider>
    )
}

export default GameLayout
