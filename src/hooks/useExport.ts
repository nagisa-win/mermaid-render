import { useState, useCallback } from 'preact/hooks';
import { toPng, toJpeg } from 'html-to-image';
import { EXPORT_PIXEL_RATIO, MIN_EXPORT_WIDTH, MIN_EXPORT_HEIGHT } from '../utils/constants';

interface UseExportResult {
    exportToPng: (element: HTMLElement, filename: string) => Promise<void>;
    exportToJpg: (element: HTMLElement, filename: string) => Promise<void>;
    isExporting: boolean;
    error: string | null;
}

function calculatePixelRatio(width: number, height: number): number {
    // Calculate the ratio needed to meet minimum dimensions
    const widthRatio = MIN_EXPORT_WIDTH / width;
    const heightRatio = MIN_EXPORT_HEIGHT / height;
    const minRatio = Math.max(widthRatio, heightRatio, 1);

    // Use the higher of base ratio or calculated ratio, capped at 4
    return Math.min(Math.max(EXPORT_PIXEL_RATIO, minRatio), 4);
}

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

function getSvgBackgroundColor(): string {
    const computedStyle = getComputedStyle(document.documentElement);
    const bgColor = computedStyle.getPropertyValue('--background-color').trim();
    // Convert to hex if it's a color name or rgb
    if (bgColor) {
        return bgColor;
    }
    return '#002b36'; // Solarized dark base
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

            const svg = element.querySelector('svg');
            if (!svg) {
                setError('No diagram found');
                setIsExporting(false);
                return;
            }

            // Save original styles
            const originalTransform = element.style.transform;
            const originalOverflow = element.style.overflow;
            const originalWidth = element.style.width;
            const originalHeight = element.style.height;
            const originalSvgStyle = svg.getAttribute('style');

            try {
                // Get actual SVG dimensions (before any transforms)
                const { width, height } = getSvgDimensions(svg);
                const padding = 20;
                const exportWidth = width + padding * 2;
                const exportHeight = height + padding * 2;

                // Calculate optimal pixel ratio
                const pixelRatio = calculatePixelRatio(width, height);

                // Get background color matching the current theme
                const backgroundColor = getSvgBackgroundColor();

                // Reset transforms and set exact dimensions
                element.style.transform = 'none';
                element.style.overflow = 'visible';
                element.style.width = `${exportWidth}px`;
                element.style.height = `${exportHeight}px`;

                // Remove any transform from SVG and position it
                svg.style.transform = 'none';
                svg.style.margin = `${padding}px`;

                const dataUrl = await toPng(element, {
                    pixelRatio,
                    backgroundColor,
                    cacheBust: true,
                    style: {
                        transform: 'none',
                        overflow: 'visible',
                    },
                });
                downloadImage(dataUrl, filename);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to export PNG');
            } finally {
                // Restore original styles
                element.style.transform = originalTransform;
                element.style.overflow = originalOverflow;
                element.style.width = originalWidth;
                element.style.height = originalHeight;
                if (originalSvgStyle) {
                    svg.setAttribute('style', originalSvgStyle);
                } else {
                    svg.removeAttribute('style');
                }
                setIsExporting(false);
            }
        },
        [downloadImage]
    );

    const exportToJpg = useCallback(
        async (element: HTMLElement, filename: string) => {
            setIsExporting(true);
            setError(null);

            const svg = element.querySelector('svg');
            if (!svg) {
                setError('No diagram found');
                setIsExporting(false);
                return;
            }

            // Save original styles
            const originalTransform = element.style.transform;
            const originalOverflow = element.style.overflow;
            const originalWidth = element.style.width;
            const originalHeight = element.style.height;
            const originalSvgStyle = svg.getAttribute('style');

            try {
                // Get actual SVG dimensions (before any transforms)
                const { width, height } = getSvgDimensions(svg);
                const padding = 20;
                const exportWidth = width + padding * 2;
                const exportHeight = height + padding * 2;

                // Calculate optimal pixel ratio
                const pixelRatio = calculatePixelRatio(width, height);

                // Get background color matching the current theme
                const backgroundColor = getSvgBackgroundColor();

                // Reset transforms and set exact dimensions
                element.style.transform = 'none';
                element.style.overflow = 'visible';
                element.style.width = `${exportWidth}px`;
                element.style.height = `${exportHeight}px`;

                // Remove any transform from SVG and position it
                svg.style.transform = 'none';
                svg.style.margin = `${padding}px`;

                const dataUrl = await toJpeg(element, {
                    pixelRatio,
                    backgroundColor,
                    quality: 0.95,
                    cacheBust: true,
                    style: {
                        transform: 'none',
                        overflow: 'visible',
                    },
                });
                downloadImage(dataUrl, filename);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to export JPG');
            } finally {
                // Restore original styles
                element.style.transform = originalTransform;
                element.style.overflow = originalOverflow;
                element.style.width = originalWidth;
                element.style.height = originalHeight;
                if (originalSvgStyle) {
                    svg.setAttribute('style', originalSvgStyle);
                } else {
                    svg.removeAttribute('style');
                }
                setIsExporting(false);
            }
        },
        [downloadImage]
    );

    return { exportToPng, exportToJpg, isExporting, error };
}
