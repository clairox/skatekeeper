import { useState } from 'react'
import { Button, Modal, Pressable } from 'react-native'
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
                {options.map((option, idx) => {
                    return (
                        <Pressable
                            onPress={() => {
                                option.onPress()
                                setVisible(false)
                            }}
                            key={idx + option.title}
                        >
                            <StyledText>{option.title}</StyledText>
                        </Pressable>
                    )
                })}
            </Modal>
        </>
    )
}

export default OverflowMenu
