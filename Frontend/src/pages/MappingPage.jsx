import { useState } from 'react';
import PDFViewer from '../components/PDFViewer';
import FieldMappingPanel from '../components/FieldMappingPanel';
import { api } from '../services/api';
import { Upload } from 'lucide-react';

export default function MappingPage() {
    const [pdfFileUrl, setPdfFileUrl] = useState(null);
    const [documentId, setDocumentId] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [isDrawingMode, setIsDrawingMode] = useState(false);
    const [onDrawCompleteCallback, setOnDrawCompleteCallback] = useState(null);
    const [annotations, setAnnotations] = useState([]); // To show boxes on PDF

    const handleFileUpload = async (e) => {
        const file = e.target.files?.[0];
        if (file && file.type === 'application/pdf') {
            try {
                const response = await api.uploadDocument(file, 49, 20);
                setDocumentId(response.documentId);
                setPdfFileUrl(URL.createObjectURL(file));
                setAnnotations([]);
                setCurrentPage(1);
            } catch (error) {
                alert('Failed to upload PDF to the server.');
                console.error(error);
            }
        }
    };

    const handleDrawRequest = (callback) => {
        setIsDrawingMode(true);
        setOnDrawCompleteCallback(() => callback);
    };

    const handleAnnotationComplete = (bbox, page) => {
        if (onDrawCompleteCallback) {
            onDrawCompleteCallback(bbox, page);
            setAnnotations(prev => [...prev, { bbox, page }]);
        }
        setIsDrawingMode(false);
        setOnDrawCompleteCallback(null);
    };

    const handleSaveMappings = async (mappings) => {
        if (!documentId) {
            alert("Cannot save, no document has been uploaded.");
            return;
        }
        try {
            await api.saveMappingsBulk(documentId, mappings);
            alert(`Successfully saved ${mappings.length} mappings! And Your Document id =  ${documentId}`);
        } catch (error) {
            alert('Failed to save mappings.');
            console.error(error);
        }
    };

    return (
        <div className="h-full flex overflow-hidden">
            {documentId ? (
                <>
                    <div className="flex-1">
                        <PDFViewer
                            fileUrl={pdfFileUrl}
                            currentPage={currentPage}
                            onPageChange={setCurrentPage}
                            annotations={annotations}
                            onAnnotationComplete={handleAnnotationComplete}
                            isDrawingMode={isDrawingMode}
                        />
                    </div>
                    <FieldMappingPanel
                        onDrawRequest={handleDrawRequest}
                        onSaveMappings={handleSaveMappings}
                    />
                </>
            ) : (
                <div className="flex-1 flex items-center justify-center bg-gray-100">
                    <div className="text-center p-8 bg-white shadow-lg rounded-lg">
                        <Upload size={48} className="mx-auto text-gray-400 mb-4" />
                        <h2 className="text-2xl font-semibold mb-2">Upload a PDF to Begin Mapping</h2>
                        <p className="text-gray-500 mb-6">Select a document to start drawing annotation areas.</p>
                        <input type="file" id="file-upload" accept="application/pdf" onChange={handleFileUpload} className="hidden" />
                        <label htmlFor="file-upload" className="cursor-pointer px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-bold">
                            Choose PDF File
                        </label>
                    </div>
                </div>
            )}
        </div>
    );
}