import { useEffect, useState, useCallback, useRef } from 'preact/hooks';
import mermaid from 'mermaid';
import { getMermaidConfig } from '../utils/constants';
import type { Theme } from './useTheme';

interface UseMermaidResult {
    svg: string | null;
    error: string | null;
    isRendering: boolean;
}

export function useMermaid(code: string, theme: Theme): UseMermaidResult {
    const [svg, setSvg] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isRendering, setIsRendering] = useState(false);
    const renderIdRef = useRef(0);
    const initializedThemeRef = useRef<Theme | null>(null);

    const renderDiagram = useCallback(async (diagramCode: string, currentTheme: Theme) => {
        // Initialize or re-initialize mermaid if theme changed
        if (initializedThemeRef.current !== currentTheme) {
            mermaid.initialize(getMermaidConfig(currentTheme));
            initializedThemeRef.current = currentTheme;
        }

        const currentRenderId = ++renderIdRef.current;
        setIsRendering(true);
        setError(null);

        try {
            // Generate unique ID for each render
            const id = `mermaid-${Date.now()}-${Math.random().toString(36).slice(2)}`;

            const { svg: renderedSvg } = await mermaid.render(id, diagramCode);

            // Only update if this is still the current render
            if (currentRenderId === renderIdRef.current) {
                setSvg(renderedSvg);
                setError(null);
            }
        } catch (err) {
            if (currentRenderId === renderIdRef.current) {
                setError(err instanceof Error ? err.message : 'Failed to render diagram');
                setSvg(null);
            }
        } finally {
            if (currentRenderId === renderIdRef.current) {
                setIsRendering(false);
            }
        }
    }, []);

    useEffect(() => {
        if (code.trim()) {
            renderDiagram(code, theme);
        } else {
            setSvg(null);
            setError(null);
        }
    }, [code, theme, renderDiagram]);

    return { svg, error, isRendering };
}
