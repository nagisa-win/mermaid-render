import { useCallback, useEffect, useState } from 'preact/hooks';
import MonacoEditor from '@monaco-editor/react';

interface EditorProps {
    value: string;
    onChange: (value: string) => void;
}

export function Editor({ value, onChange }: EditorProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleChange = useCallback(
        (newValue: string | undefined) => {
            if (newValue !== undefined) {
                onChange(newValue);
            }
        },
        [onChange]
    );

    if (!mounted) {
        return <div class="editor-loading">Loading editor...</div>;
    }

    return (
        <div class="editor-wrapper">
            <MonacoEditor
                height="100%"
                defaultLanguage="markdown"
                value={value}
                onChange={handleChange}
                theme="vs-dark"
                options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    lineNumbers: 'on',
                    wordWrap: 'on',
                    scrollBeyondLastLine: false,
                    padding: { top: 16, bottom: 16 },
                    automaticLayout: true,
                    tabSize: 4,
                    insertSpaces: true,
                    renderLineHighlight: 'line',
                    cursorBlinking: 'smooth',
                    smoothScrolling: true,
                    contextmenu: true,
                    quickSuggestions: false,
                    folding: true,
                    lineDecorationsWidth: 10,
                }}
            />
        </div>
    );
}
