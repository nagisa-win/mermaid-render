import { useState, useEffect, useCallback } from 'preact/hooks';

export type Theme = 'dark' | 'light';

const THEME_STORAGE_KEY = 'mermaid-theme';

export function useTheme() {
    const [theme, setThemeState] = useState<Theme>(() => {
        const saved = localStorage.getItem(THEME_STORAGE_KEY);
        if (saved === 'light' || saved === 'dark') {
            return saved;
        }
        return 'dark';
    });

    const setTheme = useCallback((newTheme: Theme) => {
        setThemeState(newTheme);
        localStorage.setItem(THEME_STORAGE_KEY, newTheme);
    }, []);

    const toggleTheme = useCallback(() => {
        setTheme(theme === 'dark' ? 'light' : 'dark');
    }, [theme, setTheme]);

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
    }, [theme]);

    return { theme, setTheme, toggleTheme };
}
