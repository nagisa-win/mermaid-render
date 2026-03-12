import { useEffect, useState, useCallback, useRef } from 'preact/hooks';
import mermaid from 'mermaid';
import { MERMAID_CONFIG } from '../utils/constants';

// Initialize mermaid once
let mermaidInitialized = false;

function initMermaid() {
    if (!mermaidInitialized) {
        mermaid.initialize(MERMAID_CONFIG);
        mermaidInitialized = true;
    }
}

interface UseMermaidResult {
    svg: string | null;
    error: string | null;
    isRendering: boolean;
}

export function useMermaid(code: string): UseMermaidResult {
    const [svg, setSvg] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isRendering, setIsRendering] = useState(false);
    const renderIdRef = useRef(0);

    const renderDiagram = useCallback(async (diagramCode: string) => {
        initMermaid();

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
            renderDiagram(code);
        } else {
            setSvg(null);
            setError(null);
        }
    }, [code, renderDiagram]);

    return { svg, error, isRendering };
}
