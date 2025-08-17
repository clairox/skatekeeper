import { createContext, useContext, useState } from 'react'

type Theme = 'light' | 'dark'

type ThemeContextValue = {
    theme: Theme
    toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextValue>({} as ThemeContextValue)

type ThemeProviderProps = React.PropsWithChildren

const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
    // TODO: Initialize theme from local storage

    const [theme, setTheme] = useState<Theme>('light')

    const toggleTheme = (): void => {
        setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'))
    }

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    )
}

const useTheme = () => {
    const ctx = useContext(ThemeContext)

    if (!ctx) {
        throw new Error('Missing ThemeContext')
    }

    return ctx
}

export { ThemeProvider, useTheme }
export type { Theme }
