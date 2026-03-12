import { useState, useRef, useCallback, useEffect } from "preact/hooks";

interface PreviewProps {
    svg: string | null;
    error: string | null;
}

export function Preview({ svg, error }: PreviewProps) {
    const [scale, setScale] = useState(1);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const dragStart = useRef({ x: 0, y: 0 });
    const containerRef = useRef<HTMLDivElement>(null);

    const MIN_SCALE = 0.25;
    const MAX_SCALE = 4;
    const SCALE_STEP = 0.25;

    const handleWheel = useCallback((e: WheelEvent) => {
        e.preventDefault();
        const delta = e.deltaY > 0 ? -SCALE_STEP : SCALE_STEP;
        setScale((prev) => Math.min(MAX_SCALE, Math.max(MIN_SCALE, prev + delta)));
    }, []);

    const handleMouseDown = useCallback((e: MouseEvent) => {
        if (e.button === 0) {
            setIsDragging(true);
            dragStart.current = {
                x: e.clientX - position.x,
                y: e.clientY - position.y,
            };
        }
    }, [position]);

    const handleMouseMove = useCallback((e: MouseEvent) => {
        if (isDragging) {
            setPosition({
                x: e.clientX - dragStart.current.x,
                y: e.clientY - dragStart.current.y,
            });
        }
    }, [isDragging]);

    const handleMouseUp = useCallback(() => {
        setIsDragging(false);
    }, []);

    const handleZoomIn = () => {
        setScale((prev) => Math.min(MAX_SCALE, prev + SCALE_STEP));
    };

    const handleZoomOut = () => {
        setScale((prev) => Math.max(MIN_SCALE, prev - SCALE_STEP));
    };

    const handleReset = () => {
        setScale(1);
        setPosition({ x: 0, y: 0 });
    };

    useEffect(() => {
        const container = containerRef.current;
        if (container) {
            container.addEventListener("wheel", handleWheel, { passive: false });
            return () => container.removeEventListener("wheel", handleWheel);
        }
    }, [handleWheel]);

    useEffect(() => {
        if (isDragging) {
            window.addEventListener("mousemove", handleMouseMove);
            window.addEventListener("mouseup", handleMouseUp);
            return () => {
                window.removeEventListener("mousemove", handleMouseMove);
                window.removeEventListener("mouseup", handleMouseUp);
            };
        }
    }, [isDragging, handleMouseMove, handleMouseUp]);

    return (
        <div class="preview-wrapper">
            <div
                ref={containerRef}
                class={`preview-content ${isDragging ? "dragging" : ""}`}
                onMouseDown={handleMouseDown}
            >
                {error && (
                    <div class="error-message">
                        <div class="error-icon">⚠️</div>
                        <pre>{error}</pre>
                    </div>
                )}
                {svg && !error && (
                    <div
                        id="diagram-container"
                        class="diagram-container"
                        style={{
                            transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
                            transformOrigin: "center center",
                        }}
                        dangerouslySetInnerHTML={{ __html: svg }}
                    />
                )}
                {!svg && !error && (
                    <div class="empty-state">
                        <p>Enter Mermaid code to see the preview</p>
                    </div>
                )}
            </div>
            {svg && !error && (
                <div class="zoom-controls">
                    <button class="zoom-btn" onClick={handleZoomOut} title="Zoom Out">
                        −
                    </button>
                    <span class="zoom-level">{Math.round(scale * 100)}%</span>
                    <button class="zoom-btn" onClick={handleZoomIn} title="Zoom In">
                        +
                    </button>
                    <button class="zoom-btn reset-btn" onClick={handleReset} title="Reset">
                        ⟲
                    </button>
                </div>
            )}
        </div>
    );
}
