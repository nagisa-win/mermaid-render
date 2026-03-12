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

            // Save original styles
            const originalTransform = element.style.transform;
            const originalOverflow = element.style.overflow;

            // Get current theme background color
            const computedStyle = getComputedStyle(document.documentElement);
            const backgroundColor = computedStyle.getPropertyValue('--background-color').trim();

            try {
                // Reset transform and hide scrollbar for export
                element.style.transform = 'none';
                element.style.overflow = 'visible';

                // Get the SVG element for accurate dimensions
                const svg = element.querySelector('svg');
                let pixelRatio = EXPORT_PIXEL_RATIO;
                if (svg) {
                    // Get actual SVG dimensions
                    const svgRect = svg.getBoundingClientRect();
                    const width = svgRect.width;
                    const height = svgRect.height;

                    // Calculate optimal pixel ratio for this image size
                    pixelRatio = calculatePixelRatio(width, height);

                    // Set element size to match SVG
                    element.style.width = `${width}px`;
                    element.style.height = `${height}px`;
                }

                const dataUrl = await toPng(element, {
                    pixelRatio,
                    backgroundColor: backgroundColor || '#1a1a2e',
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
                element.style.width = '';
                element.style.height = '';
                setIsExporting(false);
            }
        },
        [downloadImage]
    );

    const exportToJpg = useCallback(
        async (element: HTMLElement, filename: string) => {
            setIsExporting(true);
            setError(null);

            // Save original styles
            const originalTransform = element.style.transform;
            const originalOverflow = element.style.overflow;

            // Get current theme background color
            const computedStyle = getComputedStyle(document.documentElement);
            const backgroundColor = computedStyle.getPropertyValue('--background-color').trim();

            try {
                // Reset transform and hide scrollbar for export
                element.style.transform = 'none';
                element.style.overflow = 'visible';

                // Get the SVG element for accurate dimensions
                const svg = element.querySelector('svg');
                let pixelRatio = EXPORT_PIXEL_RATIO;
                if (svg) {
                    // Get actual SVG dimensions
                    const svgRect = svg.getBoundingClientRect();
                    const width = svgRect.width;
                    const height = svgRect.height;

                    // Calculate optimal pixel ratio for this image size
                    pixelRatio = calculatePixelRatio(width, height);

                    // Set element size to match SVG
                    element.style.width = `${width}px`;
                    element.style.height = `${height}px`;
                }

                const dataUrl = await toJpeg(element, {
                    pixelRatio,
                    backgroundColor: backgroundColor || '#1a1a2e',
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
                element.style.width = '';
                element.style.height = '';
                setIsExporting(false);
            }
        },
        [downloadImage]
    );

    return { exportToPng, exportToJpg, isExporting, error };
}
