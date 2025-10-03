import { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = `/pdf.worker.min.mjs`;

export default function PDFViewer({
    fileUrl,
    currentPage,
    onPageChange,
    annotations = [],
    highlightedAnnotation,
    onAnnotationComplete,
    isDrawingMode = false,
}) {
    const [numPages, setNumPages] = useState(0);
    const [scale, setScale] = useState(1.5);
    const [isDrawing, setIsDrawing] = useState(false);
    const [startPos, setStartPos] = useState(null);
    const [currentBox, setCurrentBox] = useState(null);

    function onDocumentLoadSuccess({ numPages }) {
        setNumPages(numPages);
    }

    const handleMouseDown = (e) => {
        if (!isDrawingMode) return;
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        setIsDrawing(true);
        setStartPos({ x, y });
        setCurrentBox({ x1: x, y1: y, x2: x, y2: y });
    };

    const handleMouseMove = (e) => {
        if (!isDrawing || !startPos) return;
        const rect = e.currentTarget.getBoundingClientRect();
        const currentX = e.clientX - rect.left;
        const currentY = e.clientY - rect.top;
        setCurrentBox({
            x1: Math.min(startPos.x, currentX),
            y1: Math.min(startPos.y, currentY),
            x2: Math.max(startPos.x, currentX),
            y2: Math.max(startPos.y, currentY),
        });
    };

    const handleMouseUp = (e) => {
        if (!isDrawing || !currentBox) return;
        const rect = e.currentTarget.getBoundingClientRect();
        setIsDrawing(false);

        const normalizedBbox = {
            x1: currentBox.x1 / rect.width,
            y1: currentBox.y1 / rect.height,
            x2: currentBox.x2 / rect.width,
            y2: currentBox.y2 / rect.height,
        };
        onAnnotationComplete?.(normalizedBbox, currentPage);
        setCurrentBox(null);
        setStartPos(null);
    };

    const renderBox = (bbox, key, color, zIndex, isPixelValue = false) => {
        if (!bbox) return null;
        const style = isPixelValue
            ? { left: `${bbox.x1}px`, top: `${bbox.y1}px`, width: `${bbox.x2 - bbox.x1}px`, height: `${bbox.y2 - bbox.y1}px` }
            : { left: `${bbox.x1 * 100}%`, top: `${bbox.y1 * 100}%`, width: `${(bbox.x2 - bbox.x1) * 100}%`, height: `${(bbox.y2 - bbox.y1) * 100}%` };

        return <div key={key} style={{ ...style, border: `2px solid ${color}`, position: 'absolute', zIndex, backgroundColor: color.replace(')', ', 0.2)').replace('rgb', 'rgba') }} />;
    };

    return (
        <div className="flex flex-col h-full bg-gray-200">
            <div className="flex items-center justify-between p-2 bg-gray-800 text-white shadow-md">
                <div className="flex items-center gap-4">
                    <button onClick={() => onPageChange(Math.max(1, currentPage - 1))} disabled={currentPage <= 1} className="px-3 py-1 bg-gray-600 rounded disabled:opacity-50 hover:bg-gray-500">Prev</button>
                    <span>Page {currentPage} of {numPages || '...'}</span>
                    <button onClick={() => onPageChange(Math.min(numPages, currentPage + 1))} disabled={!numPages || currentPage >= numPages} className="px-3 py-1 bg-gray-600 rounded disabled:opacity-50 hover:bg-gray-500">Next</button>
                </div>
                <div className="flex items-center gap-2">
                    <button onClick={() => setScale(s => Math.max(0.5, s - 0.25))} className="px-3 py-1 bg-gray-600 rounded hover:bg-gray-500">-</button>
                    <span>{Math.round(scale * 100)}%</span>
                    <button onClick={() => setScale(s => Math.min(3, s + 0.25))} className="px-3 py-1 bg-gray-600 rounded hover:bg-gray-500">+</button>
                </div>
            </div>
            <div className="flex-1 overflow-auto p-8 flex justify-center">
                {fileUrl ? (
                    <div className={`relative shadow-lg ${isDrawingMode ? 'cursor-crosshair' : ''}`} onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} >
                        <Document file={fileUrl} onLoadSuccess={onDocumentLoadSuccess}>
                            <Page pageNumber={currentPage} scale={scale} />
                        </Document>
                        {annotations.filter(a => a.page === currentPage).map((ann, i) => renderBox(ann.bbox, `ann-${i}`, 'rgb(59, 130, 246)', 1))}
                        {highlightedAnnotation?.page === currentPage && renderBox(highlightedAnnotation.bbox, 'highlight', 'rgb(239, 68, 68)', 2)}
                        {isDrawing && currentBox && renderBox(currentBox, 'drawing', 'rgb(16, 185, 129)', 3, true)}
                    </div>
                ) : <p>PDF will be displayed here.</p>}
            </div>
        </div>
    );
}