interface ToolbarProps {
    onExportPng: () => void;
    onExportJpg: () => void;
    isExporting: boolean;
    disabled: boolean;
}

export function Toolbar({ onExportPng, onExportJpg, isExporting, disabled }: ToolbarProps) {
    return (
        <header class="toolbar">
            <div class="toolbar-brand">
                <h1>Mermaid Render</h1>
                <span class="toolbar-subtitle">Create and export beautiful diagrams</span>
            </div>
            <div class="toolbar-actions">
                <button
                    class="btn btn-primary"
                    onClick={onExportPng}
                    disabled={disabled || isExporting}
                    title="Export as PNG image"
                >
                    {isExporting ? 'Exporting...' : 'Export PNG'}
                </button>
                <button
                    class="btn btn-secondary"
                    onClick={onExportJpg}
                    disabled={disabled || isExporting}
                    title="Export as JPG image"
                >
                    {isExporting ? 'Exporting...' : 'Export JPG'}
                </button>
            </div>
        </header>
    );
}
