import { Button } from 'react-native'
import { useRouter } from 'expo-router'

const Home = () => {
    const router = useRouter()
    return (
        <>
            <Button
                title="New Game"
                onPress={() => router.push('/gameSetup')}
            />
        </>
    )
}

export default Home
