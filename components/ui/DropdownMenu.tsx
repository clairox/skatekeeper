import { Pressable, PressableProps } from 'react-native'
import * as Menu from './Menu'
import { createContext, useCallback, useContext, useState } from 'react'
import Text from './Text'

type DropdownMenuContextValue = {
    open: boolean
    onOpenChange: (open: boolean) => void
    onOpenToggle: () => void
}

const DropdownMenuContext = createContext<DropdownMenuContextValue>(
    {} as DropdownMenuContextValue
)

type DropdownMenuProviderProps =
    React.PropsWithChildren<DropdownMenuContextValue>

const DropdownMenuProvider: React.FC<DropdownMenuProviderProps> = ({
    children,
    ...contextProps
}) => {
    return (
        <DropdownMenuContext.Provider value={contextProps}>
            {children}
        </DropdownMenuContext.Provider>
    )
}

const useDropdownMenu = () => {
    const ctx = useContext(DropdownMenuContext)

    if (!ctx) {
        throw new Error(
            'Cannot use useDropdownMenu outside of DropdownMenuContext.'
        )
    }

    return ctx
}

type DropdownMenuProps = React.PropsWithChildren<{
    open?: boolean
    defaultOpen?: boolean
    onOpenChange?: (open: boolean) => void
}>

const DropdownMenu: React.FC<DropdownMenuProps> = ({
    open: openProp,
    defaultOpen,
    onOpenChange,
    children,
}) => {
    const [open, setOpen] = useState(defaultOpen ?? false)

    const _setOpen = useCallback(
        (nextValue: boolean | ((prev: boolean) => boolean)) => {
            if (openProp != null) {
                const value =
                    typeof nextValue === 'function'
                        ? nextValue(openProp)
                        : nextValue

                if (value !== openProp) {
                    onOpenChange?.(value)
                }
            } else {
                setOpen(nextValue)
            }
        },
        [openProp, onOpenChange]
    )

    return (
        <DropdownMenuProvider
            open={open}
            onOpenChange={_setOpen}
            onOpenToggle={useCallback(
                () => _setOpen(prev => !prev),
                [_setOpen]
            )}
        >
            <Menu.Root open={open} onOpenChange={_setOpen}>
                {children}
            </Menu.Root>
        </DropdownMenuProvider>
    )
}

type DropdownMenuTriggerProps = PressableProps

const DropdownMenuTrigger: React.FC<DropdownMenuTriggerProps> = ({
    disabled,
    children,
    ...triggerProps
}) => {
    const dropdownMenu = useDropdownMenu()

    return (
        <Pressable
            onPress={event => {
                triggerProps.onPress?.(event)

                if (!event.defaultPrevented && !disabled) {
                    dropdownMenu.onOpenToggle()
                }
            }}
        >
            {children}
        </Pressable>
    )
}

type MenuContentProps = React.ComponentProps<typeof Menu.Content>
type DropdownMenuContentProps = MenuContentProps

const DropdownMenuContent: React.FC<DropdownMenuContentProps> = ({
    children,
}) => {
    useDropdownMenu()

    return <Menu.Content>{children}</Menu.Content>
}

type MenuItemProps = React.ComponentProps<typeof Menu.Item>
type DropdownMenuItemProps = MenuItemProps

const DropdownMenuItem: React.FC<DropdownMenuItemProps> = ({
    disabled = false,
    ...itemProps
}) => {
    useDropdownMenu()

    return <Menu.Item {...itemProps} />
}

const Root = DropdownMenu
const Content = DropdownMenuContent
const Trigger = DropdownMenuTrigger
const Item = DropdownMenuItem

export {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
    DropdownMenuItem,
    Root,
    Content,
    Trigger,
    Item,
}

export type {
    DropdownMenuProps,
    DropdownMenuContentProps,
    DropdownMenuTriggerProps,
    DropdownMenuItemProps,
}
