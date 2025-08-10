import { useState } from 'react'
import { Button, Modal, Pressable, View } from 'react-native'
import StyledText from './StyledText'

type OverflowMenuProps = {
    options: { title: string; onPress: () => void }[]
}

const OverflowMenu: React.FC<OverflowMenuProps> = ({ options }) => {
    const [visible, setVisible] = useState(false)

    const toggleMenu = () => {
        setVisible(prev => !prev)
    }
    return (
        <>
            <Button title="Menu" onPress={toggleMenu} />
            <Modal onRequestClose={() => setVisible(false)} visible={visible}>
                <View style={{ paddingTop: 10 }}>
                    {options.map((option, idx) => {
                        return (
                            <Pressable
                                onPress={() => {
                                    option.onPress()
                                    setVisible(false)
                                }}
                                key={idx + option.title}
                                style={{
                                    justifyContent: 'center',
                                    paddingLeft: 20,
                                    height: 40,
                                }}
                            >
                                <StyledText>{option.title}</StyledText>
                            </Pressable>
                        )
                    })}
                </View>
            </Modal>
        </>
    )
}

export default OverflowMenu
