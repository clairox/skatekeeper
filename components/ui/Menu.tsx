import { Portal, PortalHost } from '@gorhom/portal'
import { createContext, useCallback, useContext } from 'react'
import { Pressable, PressableProps, ScrollView } from 'react-native'

type MenuContextValue = {
    open: boolean
    onOpenChange: (open: boolean) => void
    onClose: () => void
}

const MenuContext = createContext<MenuContextValue>({} as MenuContextValue)

type MenuProviderProps = React.PropsWithChildren<MenuContextValue>

const MenuProvider: React.FC<MenuProviderProps> = ({
    children,
    ...contextProps
}) => {
    return (
        <MenuContext.Provider value={contextProps}>
            {children}
        </MenuContext.Provider>
    )
}

const useMenu = () => {
    const ctx = useContext(MenuContext)

    if (!ctx) {
        throw new Error('Cannot use useMenu outside of MenuContext.')
    }

    return ctx
}

type MenuProps = React.PropsWithChildren<{
    open: boolean
    onOpenChange: (open: boolean) => void
}>

const Menu: React.FC<MenuProps> = ({ open, onOpenChange, children }) => {
    const handleOpenChange = onOpenChange

    return (
        <MenuProvider
            open={open}
            onOpenChange={onOpenChange}
            onClose={useCallback(
                () => handleOpenChange(false),
                [handleOpenChange]
            )}
        >
            {children}
        </MenuProvider>
    )
}

type MenuContentProps = React.PropsWithChildren

const MenuContent: React.FC<MenuContentProps> = ({ children }) => {
    const menu = useMenu()

    if (!menu.open) {
        return <></>
    }

    return (
        <>
            <Portal hostName="MenuPortalHost">
                <ScrollView
                    style={{
                        position: 'absolute',
                        backgroundColor: '#fff',
                        zIndex: 1000,
                    }}
                >
                    {children}
                </ScrollView>
            </Portal>
            <PortalHost name="MenuPortalHost" />
        </>
    )
}

type MenuItemProps = React.PropsWithChildren & PressableProps

const MenuItem: React.FC<MenuItemProps> = ({
    disabled = false,
    children,
    ...itemProps
}) => {
    const menu = useMenu()

    const handleSelect = () => {
        menu.onClose()
    }

    return (
        <Pressable
            {...itemProps}
            disabled={disabled}
            onPress={event => {
                itemProps.onPress?.(event)

                if (!event.defaultPrevented) {
                    handleSelect()
                }
            }}
            style={{
                justifyContent: 'center',
                paddingLeft: 20,
                height: 40,
            }}
        >
            {children}
        </Pressable>
    )
}

const Root = Menu
const Content = MenuContent
const Item = MenuItem

export { Menu, MenuContent, MenuItem, Root, Content, Item }
export type { MenuProps, MenuContentProps, MenuItemProps }
