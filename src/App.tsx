import { useCallback, useEffect, useState } from 'preact/hooks';
import { Layout } from './components/Layout';
import { Editor } from './components/Editor';
import { Preview } from './components/Preview';
import { Toolbar } from './components/Toolbar';
import { useMermaid } from './hooks/useMermaid';
import { useExport } from './hooks/useExport';
import { useDebounce } from './hooks/useDebounce';
import { useTheme } from './hooks/useTheme';
import { DEFAULT_CODE, STORAGE_KEY, DEBOUNCE_DELAY } from './utils/constants';
import './styles/App.css';

export function App() {
    const [code, setCode] = useState(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        return saved || DEFAULT_CODE;
    });

    const { theme, toggleTheme } = useTheme();
    const debouncedCode = useDebounce(code, DEBOUNCE_DELAY);
    const { svg, error, isRendering } = useMermaid(debouncedCode, theme);
    const { exportToPng, exportToJpg, isExporting } = useExport();

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, code);
    }, [code]);

    const handleExportPng = useCallback(async () => {
        const diagramElement = document.getElementById('diagram-container');
        if (diagramElement) {
            await exportToPng(diagramElement, 'mermaid-diagram.png');
        }
    }, [exportToPng]);

    const handleExportJpg = useCallback(async () => {
        const diagramElement = document.getElementById('diagram-container');
        if (diagramElement) {
            await exportToJpg(diagramElement, 'mermaid-diagram.jpg');
        }
    }, [exportToJpg]);

    return (
        <Layout>
            <div class="app-container">
                <Toolbar
                    onExportPng={handleExportPng}
                    onExportJpg={handleExportJpg}
                    isExporting={isExporting}
                    disabled={!svg}
                    theme={theme}
                    onToggleTheme={toggleTheme}
                />
                <div class="main-content">
                    <div class="editor-panel">
                        <div class="panel-header">
                            <h2>Editor</h2>
                        </div>
                        <Editor value={code} onChange={setCode} theme={theme} />
                    </div>
                    <div class="preview-panel">
                        <div class="panel-header">
                            <h2>Preview</h2>
                            {isRendering && <span class="status">Rendering...</span>}
                        </div>
                        <Preview svg={svg} error={error} />
                    </div>
                </div>
            </div>
        </Layout>
    );
}
