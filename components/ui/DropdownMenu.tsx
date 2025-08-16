import { PortalHost, PortalProvider } from '@gorhom/portal'
import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useId,
    useRef,
    useState,
} from 'react'
import {
    GestureResponderEvent,
    Modal,
    Pressable,
    PressableProps,
    View,
} from 'react-native'

type DropdownMenuContextValue = {
    triggerId: string
    triggerRef: React.RefObject<React.ComponentRef<typeof Pressable> | null>
    open: boolean
    onOpenChange: (open: boolean) => void
    onOpenToggle: () => void
    onClose: () => void
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

const useDropdownMenuContext = (consumerName: string) => {
    const ctx = useContext(DropdownMenuContext)

    if (!ctx) {
        throw new Error(
            `${consumerName} must be used within DropdownMenuContext`
        )
    }

    return ctx
}

type DropdownMenuProps = React.PropsWithChildren

const DropdownMenu: React.FC<DropdownMenuProps> = ({ children }) => {
    const triggerRef = useRef<React.ComponentRef<typeof Pressable>>(null)

    const [open, setOpen] = useState(false)

    return (
        <DropdownMenuProvider
            triggerId={useId()}
            triggerRef={triggerRef}
            open={open}
            onOpenChange={setOpen}
            onOpenToggle={useCallback(
                () => setOpen(prevOpen => !prevOpen),
                [setOpen]
            )}
            onClose={useCallback(() => setOpen(false), [setOpen])}
        >
            {children}
        </DropdownMenuProvider>
    )
}

const TRIGGER_NAME = 'DropdownMenuTrigger'

type DropdownMenuTriggerProps = PressableProps

const DropdownMenuTrigger: React.FC<DropdownMenuTriggerProps> = ({
    disabled = false,
    ...triggerProps
}) => {
    const context = useDropdownMenuContext(TRIGGER_NAME)

    return (
        <Pressable
            id={context.triggerId}
            disabled={disabled}
            {...triggerProps}
            ref={context.triggerRef}
            onPress={() => {
                if (!disabled) context.onOpenToggle()
            }}
            style={{ width: 30, height: 30 }}
        />
    )
}

const PORTAL_NAME = 'DropdownMenuPortal'

type DropdownMenuPortalProps = React.PropsWithChildren

const DropdownMenuPortal: React.FC<DropdownMenuPortalProps> = ({
    children,
}) => {
    const context = useDropdownMenuContext(PORTAL_NAME)

    return (
        <PortalProvider>
            {context.open && children}
            <PortalHost name="DropdownMenuPortalHost" />
        </PortalProvider>
    )
}

type Measure = {
    x: number
    y: number
    width: number
    height: number
}

const CONTENT_NAME = 'DropdownMenuContent'

type DropdownMenuContentProps = React.PropsWithChildren

const DropdownMenuContent: React.FC<DropdownMenuContentProps> = ({
    children,
}) => {
    const context = useDropdownMenuContext(CONTENT_NAME)
    const contentRef = useRef<React.ComponentRef<typeof Pressable>>(null)
    const [triggerMeasure, setTriggerMeasure] = useState<Measure | null>(null)
    const [contentMeasure, setContentMeasure] = useState<Measure | null>(null)

    useEffect(() => {
        const trigger = context.triggerRef.current
        if (!triggerMeasure && trigger) {
            trigger.measure((_x, _y, width, height, pageX, pageY) => {
                setTriggerMeasure({
                    x: pageX,
                    y: pageY,
                    width,
                    height,
                })
            })
        }
    })

    useEffect(() => {
        const content = contentRef.current
        if (!contentMeasure && content) {
            content.measure((_x, _y, width, height, pageX, pageY) => {
                setContentMeasure({
                    x: pageX,
                    y: pageY,
                    width,
                    height,
                })
            })
        }
    })

    return (
        <DropdownMenuPortal>
            <Modal transparent={true} visible={context.open}>
                <Pressable
                    style={{ flex: 1 }}
                    onPress={() => context.onOpenChange(false)}
                >
                    <Pressable
                        ref={contentRef}
                        style={[
                            {
                                position: 'absolute',
                                borderRadius: 6,
                                backgroundColor: '#fff',
                                overflow: 'hidden',
                                boxShadow: [
                                    {
                                        offsetX: -1,
                                        offsetY: 1,
                                        blurRadius: 10,
                                        color: 'rgba(0,0,0,0.1)',
                                    },
                                ],
                            },
                            triggerMeasure &&
                                contentMeasure && {
                                    left:
                                        triggerMeasure.x -
                                        contentMeasure.width +
                                        triggerMeasure.width,
                                    top:
                                        triggerMeasure.y -
                                        triggerMeasure.height,
                                },
                        ]}
                    >
                        {children}
                    </Pressable>
                </Pressable>
            </Modal>
        </DropdownMenuPortal>
    )
}

const ITEM_NAME = 'DropdownMenuItem'

type DropdownMenuItemProps = React.PropsWithChildren<
    PressableProps & {
        onSelect?: (event: GestureResponderEvent) => void
    }
>

const DropdownMenuItem: React.FC<DropdownMenuItemProps> = ({
    onSelect,
    ...props
}) => {
    const context = useDropdownMenuContext(ITEM_NAME)

    return (
        <Pressable
            {...props}
            style={({ pressed }) => [
                {
                    justifyContent: 'center',
                    alignItems: 'flex-start',
                    paddingLeft: 18,
                    paddingRight: 48,
                    paddingVertical: 10,
                    backgroundColor: '#fff',
                },
                pressed && {
                    backgroundColor: '#eee',
                },
            ]}
            onPress={event => {
                props.onPress?.(event)

                if (!event.defaultPrevented) {
                    onSelect?.(event)
                    context.onClose()
                }
            }}
        />
    )
}

export {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
}
