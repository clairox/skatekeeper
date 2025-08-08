import { StyleSheet, View, ViewProps } from 'react-native'

type StyledViewProps = ViewProps

const StyledView: React.FC<StyledViewProps> = ({ style, ...props }) => {
    return <View style={[styles.container, style]} {...props} />
}

export default StyledView

const styles = StyleSheet.create({
    container: {
        flex: 0.65,
        alignItems: 'center',
    },
})
