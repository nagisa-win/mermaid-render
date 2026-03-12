import { useState, useCallback } from 'preact/hooks';
import { toPng, toJpeg } from 'html-to-image';
import { EXPORT_PIXEL_RATIO } from '../utils/constants';

interface UseExportResult {
    exportToPng: (element: HTMLElement, filename: string) => Promise<void>;
    exportToJpg: (element: HTMLElement, filename: string) => Promise<void>;
    isExporting: boolean;
    error: string | null;
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

            try {
                const dataUrl = await toPng(element, {
                    pixelRatio: EXPORT_PIXEL_RATIO,
                    backgroundColor: '#1a1a2e',
                    cacheBust: true,
                });
                downloadImage(dataUrl, filename);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to export PNG');
            } finally {
                setIsExporting(false);
            }
        },
        [downloadImage]
    );

    const exportToJpg = useCallback(
        async (element: HTMLElement, filename: string) => {
            setIsExporting(true);
            setError(null);

            try {
                const dataUrl = await toJpeg(element, {
                    pixelRatio: EXPORT_PIXEL_RATIO,
                    backgroundColor: '#1a1a2e',
                    quality: 0.95,
                    cacheBust: true,
                });
                downloadImage(dataUrl, filename);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to export JPG');
            } finally {
                setIsExporting(false);
            }
        },
        [downloadImage]
    );

    return { exportToPng, exportToJpg, isExporting, error };
}
