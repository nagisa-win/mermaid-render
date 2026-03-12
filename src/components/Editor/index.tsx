import { useCallback, useEffect, useState } from 'preact/hooks';
import MonacoEditor, { Monaco } from '@monaco-editor/react';
import type { editor } from 'monaco-editor';
import type { Theme } from '../../hooks/useTheme';

interface EditorProps {
    value: string;
    onChange: (value: string) => void;
    theme: Theme;
}

// Solarized Dark theme for Monaco
const SOLARIZED_DARK_THEME: editor.IStandaloneThemeData = {
    base: 'vs-dark',
    inherit: true,
    rules: [
        { token: '', foreground: '839496', background: '002b36' },
        { token: 'comment', foreground: '586e75' },
        { token: 'keyword', foreground: '859900' },
        { token: 'string', foreground: '2aa198' },
        { token: 'number', foreground: 'd33682' },
        { token: 'regexp', foreground: 'dc322f' },
        { token: 'type', foreground: 'b58900' },
        { token: 'class', foreground: 'cb4b16' },
        { token: 'function', foreground: '268bd2' },
        { token: 'variable', foreground: '839496' },
        { token: 'constant', foreground: 'd33682' },
        { token: 'delimiter', foreground: '93a1a1' },
        { token: 'tag', foreground: '268bd2' },
        { token: 'attribute.name', foreground: '93a1a1' },
        { token: 'attribute.value', foreground: '2aa198' },
    ],
    colors: {
        'editor.background': '#002b36',
        'editor.foreground': '#839496',
        'editor.lineHighlightBackground': '#073642',
        'editor.selectionBackground': '#586e75',
        'editorCursor.foreground': '#839496',
        'editorWhitespace.foreground': '#586e75',
        'editorIndentGuide.background': '#586e75',
        'editorIndentGuide.activeBackground': '#93a1a1',
        'editorLineNumber.foreground': '#586e75',
        'editorLineNumber.activeForeground': '#93a1a1',
        'editorGutter.background': '#002b36',
        'editor.selectionHighlightBackground': '#09495980',
    },
};

// Solarized Light theme for Monaco
const SOLARIZED_LIGHT_THEME: editor.IStandaloneThemeData = {
    base: 'vs',
    inherit: true,
    rules: [
        { token: '', foreground: '657b83', background: 'fdf6e3' },
        { token: 'comment', foreground: '93a1a1' },
        { token: 'keyword', foreground: '859900' },
        { token: 'string', foreground: '2aa198' },
        { token: 'number', foreground: 'd33682' },
        { token: 'regexp', foreground: 'dc322f' },
        { token: 'type', foreground: 'b58900' },
        { token: 'class', foreground: 'cb4b16' },
        { token: 'function', foreground: '268bd2' },
        { token: 'variable', foreground: '657b83' },
        { token: 'constant', foreground: 'd33682' },
        { token: 'delimiter', foreground: '657b83' },
        { token: 'tag', foreground: '268bd2' },
        { token: 'attribute.name', foreground: '93a1a1' },
        { token: 'attribute.value', foreground: '2aa198' },
    ],
    colors: {
        'editor.background': '#fdf6e3',
        'editor.foreground': '#657b83',
        'editor.lineHighlightBackground': '#eee8d5',
        'editor.selectionBackground': '#93a1a1',
        'editorCursor.foreground': '#657b83',
        'editorWhitespace.foreground': '#93a1a1',
        'editorIndentGuide.background': '#93a1a1',
        'editorIndentGuide.activeBackground': '#586e75',
        'editorLineNumber.foreground': '#93a1a1',
        'editorLineNumber.activeForeground': '#586e75',
        'editorGutter.background': '#fdf6e3',
        'editor.selectionHighlightBackground': '#eee8d580',
    },
};

export function Editor({ value, onChange, theme }: EditorProps) {
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

    const handleEditorMount = useCallback(
        (_editor: editor.IStandaloneCodeEditor, monaco: Monaco) => {
            monaco.editor.defineTheme('solarized-dark', SOLARIZED_DARK_THEME);
            monaco.editor.defineTheme('solarized-light', SOLARIZED_LIGHT_THEME);
            monaco.editor.setTheme(theme === 'dark' ? 'solarized-dark' : 'solarized-light');
        },
        [theme]
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
                theme={theme === 'dark' ? 'solarized-dark' : 'solarized-light'}
                onMount={handleEditorMount}
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
