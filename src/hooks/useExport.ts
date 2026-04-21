import { useState, useCallback } from 'preact/hooks';
import { toPng, toJpeg } from 'html-to-image';
import { EXPORT_PIXEL_RATIO, MIN_EXPORT_WIDTH, MIN_EXPORT_HEIGHT } from '../utils/constants';

interface UseExportResult {
    exportToPng: (element: HTMLElement, filename: string) => Promise<void>;
    exportToJpg: (element: HTMLElement, filename: string) => Promise<void>;
    copyPngToClipboard: (element: HTMLElement) => Promise<void>;
    isExporting: boolean;
    error: string | null;
}

// Calculate the pixel ratio needed to meet minimum export dimensions
function calculatePixelRatio(width: number, height: number): number {
    const widthRatio = MIN_EXPORT_WIDTH / width;
    const heightRatio = MIN_EXPORT_HEIGHT / height;
    const minRatio = Math.max(widthRatio, heightRatio, 1);
    // Use the higher of base ratio or calculated ratio, capped at 4
    return Math.min(Math.max(EXPORT_PIXEL_RATIO, minRatio), 4);
}

// Try to get the true SVG dimensions (viewBox → attributes → bounding rect)
function getSvgDimensions(svg: SVGSVGElement): { width: number; height: number } {
    // Try to get dimensions from viewBox first
    const viewBox = svg.getAttribute('viewBox');
    if (viewBox) {
        const parts = viewBox.split(/\s+|,/).map(Number);
        if (parts.length >= 4 && parts[2] > 0 && parts[3] > 0) {
            return { width: parts[2], height: parts[3] };
        }
    }

    // Fall back to width/height attributes
    const widthAttr = svg.getAttribute('width');
    const heightAttr = svg.getAttribute('height');
    if (widthAttr && heightAttr) {
        const width = parseFloat(widthAttr);
        const height = parseFloat(heightAttr);
        if (width > 0 && height > 0) {
            return { width, height };
        }
    }

    // Last resort: use getBoundingClientRect (may be affected by transforms)
    const rect = svg.getBoundingClientRect();
    return { width: rect.width, height: rect.height };
}

// Get background color matching the current theme
function getSvgBackgroundColor(): string {
    const computedStyle = getComputedStyle(document.documentElement);
    const bgColor = computedStyle.getPropertyValue('--background-color').trim();
    if (bgColor) {
        return bgColor;
    }
    return '#002b36'; // Solarized dark base
}

interface ExportPreparation {
    container: HTMLElement;
    width: number;
    height: number;
    pixelRatio: number;
    backgroundColor: string;
}

// Clone the SVG into a temporary container outside the preview panel's
// overflow:hidden boundary, so wide diagrams are not clipped during capture.
// The container is positioned off-screen and removed after the image is taken.
function prepareExportElement(element: HTMLElement): ExportPreparation | null {
    const svg = element.querySelector('svg');
    if (!svg) return null;

    const { width, height } = getSvgDimensions(svg);
    const padding = 20;
    const exportWidth = width + padding * 2;
    const exportHeight = height + padding * 2;
    const pixelRatio = calculatePixelRatio(width, height);
    const backgroundColor = getSvgBackgroundColor();

    const svgClone = svg.cloneNode(true) as SVGSVGElement;
    svgClone.style.maxWidth = 'none';
    svgClone.style.width = `${width}px`;
    svgClone.style.height = `${height}px`;
    svgClone.style.transform = 'none';
    svgClone.style.margin = `${padding}px`;
    svgClone.style.display = 'block';

    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.left = '-9999px';
    container.style.top = '0';
    container.style.width = `${exportWidth}px`;
    container.style.height = `${exportHeight}px`;
    container.style.overflow = 'visible';
    container.style.backgroundColor = backgroundColor;
    container.appendChild(svgClone);
    document.body.appendChild(container);

    return { container, width: exportWidth, height: exportHeight, pixelRatio, backgroundColor };
}

// Remove the temporary export container from the DOM
function cleanupExportElement(container: HTMLElement) {
    if (container.parentNode) {
        container.parentNode.removeChild(container);
    }
}

export function useExport(): UseExportResult {
    const [isExporting, setIsExporting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const downloadImage = useCallback((dataUrl: string, filename: string) => {
        const link = document.createElement('a');
        link.download = filename;
        link.href = dataUrl;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }, []);

    const exportToPng = useCallback(
        async (element: HTMLElement, filename: string) => {
            setIsExporting(true);
            setError(null);

            const result = prepareExportElement(element);
            if (!result) {
                setError('No diagram found');
                setIsExporting(false);
                return;
            }

            try {
                const dataUrl = await toPng(result.container, {
                    pixelRatio: result.pixelRatio,
                    backgroundColor: result.backgroundColor,
                    cacheBust: true,
                    width: result.width,
                    height: result.height,
                });
                downloadImage(dataUrl, filename);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to export PNG');
            } finally {
                cleanupExportElement(result.container);
                setIsExporting(false);
            }
        },
        [downloadImage],
    );

    const exportToJpg = useCallback(
        async (element: HTMLElement, filename: string) => {
            setIsExporting(true);
            setError(null);

            const result = prepareExportElement(element);
            if (!result) {
                setError('No diagram found');
                setIsExporting(false);
                return;
            }

            try {
                const dataUrl = await toJpeg(result.container, {
                    pixelRatio: result.pixelRatio,
                    backgroundColor: result.backgroundColor,
                    quality: 0.95,
                    cacheBust: true,
                    width: result.width,
                    height: result.height,
                });
                downloadImage(dataUrl, filename);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to export JPG');
            } finally {
                cleanupExportElement(result.container);
                setIsExporting(false);
            }
        },
        [downloadImage],
    );

    const copyPngToClipboard = useCallback(async (element: HTMLElement) => {
        setIsExporting(true);
        setError(null);

        const result = prepareExportElement(element);
        if (!result) {
            setError('No diagram found');
            setIsExporting(false);
            return;
        }

        try {
            const dataUrl = await toPng(result.container, {
                pixelRatio: result.pixelRatio,
                backgroundColor: result.backgroundColor,
                cacheBust: true,
                width: result.width,
                height: result.height,
            });
            const response = await fetch(dataUrl);
            const blob = await response.blob();
            await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to copy PNG to clipboard');
        } finally {
            cleanupExportElement(result.container);
            setIsExporting(false);
        }
    }, []);

    return { exportToPng, exportToJpg, copyPngToClipboard, isExporting, error };
}
