import { useState } from 'react';
import PDFViewer from '../components/PDFViewer';
import FormFieldDisplay from '../components/FormFieldDisplay';
import { api } from '../services/api';
import { FileSearch } from 'lucide-react';

export default function ExecutivePage() {
    const [documentId, setDocumentId] = useState('');
    const [fields, setFields] = useState([]);
    const [formValues, setFormValues] = useState({});
    const [pdfFileUrl, setPdfFileUrl] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [highlightedAnnotation, setHighlightedAnnotation] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const loadData = async () => {
        if (!documentId) {
            alert('Please enter a Document ID.');
            return;
        }
        setIsLoading(true);
        setFields([]);
        setPdfFileUrl(null);
        try {
            const data = await api.getDocumentData(documentId);
            setFields(data.fields);
            setPdfFileUrl(data.fullPdfUrl);
            const initialValues = {};
            data.fields.forEach(field => { initialValues[field.field_name] = ''; });
            setFormValues(initialValues);
        } catch (error) {
            alert(`Failed to load data for Document ID ${documentId}. Ensure the ID is correct and mappings have been saved.`);
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleFieldFocus = (field) => {
        if (field.annotation) {
            setHighlightedAnnotation({
                bbox: field.annotation.bbox,
                page: field.annotation.page,
            });
            setCurrentPage(field.annotation.page);
        }
    };

    const handleFieldChange = (fieldName, value) => {
        setFormValues(prev => ({ ...prev, [fieldName]: value }));
    };

    const allAnnotations = fields.map(f => ({ ...f.annotation, bbox: f.annotation?.bbox })).filter(Boolean);

    return (
        <div className="h-full flex flex-col">
            <div className="p-4 border-b bg-white flex items-center gap-4">
                <label htmlFor="docId" className="font-semibold">Document ID:</label>
                <input
                    id="docId"
                    type="number"
                    value={documentId}
                    onChange={(e) => setDocumentId(e.target.value)}
                    placeholder="Enter ID from mapping page"
                    className="px-3 py-2 border rounded w-48"
                />
                <button
                    onClick={loadData}
                    disabled={isLoading}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
                >
                    {isLoading ? 'Loading...' : <><FileSearch size={18} /> Load Data</>}
                </button>
            </div>

            <div className="flex-1 flex overflow-hidden">
                {fields.length > 0 ? (
                    <>
                        <div className="w-1/2 overflow-auto bg-gray-50 p-6 border-r">
                            <h2 className="text-xl font-bold mb-4">Form Details</h2>
                            {fields.map((field) => (
                                <FormFieldDisplay
                                    key={field.id}
                                    field={field}
                                    value={formValues[field.field_name] || ''}
                                    onChange={(value) => handleFieldChange(field.field_name, value)}
                                    onFocus={() => handleFieldFocus(field)}
                                />
                            ))}
                        </div>
                        <div className="w-1/2">
                            <PDFViewer
                                fileUrl={pdfFileUrl}
                                currentPage={currentPage}
                                onPageChange={setCurrentPage}
                                annotations={allAnnotations}
                                highlightedAnnotation={highlightedAnnotation}
                            />
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex items-center justify-center bg-gray-50 text-center">
                        <div>
                            <FileSearch size={48} className="mx-auto text-gray-400 mb-4" />
                            <p className="text-lg text-gray-600">Enter a Document ID to load the form and PDF.</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}