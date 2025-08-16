import { View } from 'react-native'
import OverflowMenu from './OverflowMenu'

type PageHeaderProps = {
    options: Option[]
}

const PageHeader: React.FC<PageHeaderProps> = ({ options }) => {
    return (
        <View
            style={{
                justifyContent: 'center',
                alignItems: 'flex-end',
                width: '100%',
                height: 50,
            }}
        >
            <OverflowMenu options={options} />
        </View>
    )
}

export default PageHeader
