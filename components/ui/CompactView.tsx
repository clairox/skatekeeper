import { StyleSheet, View, ViewProps } from 'react-native'

type CompactViewProps = ViewProps

const CompactView: React.FC<CompactViewProps> = ({ style, ...props }) => {
    return <View style={[styles.container, style]} {...props} />
}

export default CompactView

const styles = StyleSheet.create({
    container: {
        flex: 0.65,
        alignItems: 'center',
    },
})
