interface PreviewProps {
    svg: string | null;
    error: string | null;
}

export function Preview({ svg, error }: PreviewProps) {
    return (
        <div class="preview-wrapper">
            <div id="preview-content" class="preview-content">
                {error && (
                    <div class="error-message">
                        <div class="error-icon">⚠️</div>
                        <pre>{error}</pre>
                    </div>
                )}
                {svg && !error && (
                    <div class="diagram-container" dangerouslySetInnerHTML={{ __html: svg }} />
                )}
                {!svg && !error && (
                    <div class="empty-state">
                        <p>Enter Mermaid code to see the preview</p>
                    </div>
                )}
            </div>
        </div>
    );
}
