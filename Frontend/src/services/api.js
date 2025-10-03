import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001';

export const api = {
    async uploadDocument(file, processId, formId) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('process_id', processId);
        formData.append('form_id', formId);
        const response = await axios.post(`${API_BASE_URL}/api/documents/upload`, formData);
        return response.data;
    },
    async saveMappingsBulk(documentId, annotations) {
        const response = await axios.post(`${API_BASE_URL}/api/annotations/bulk`, { documentId, annotations });
        return response.data;
    },
    async getDocumentData(documentId) {
        const response = await axios.get(`${API_BASE_URL}/api/annotations/document/${documentId}`);
        const data = response.data;
        data.fullPdfUrl = `${API_BASE_URL}${data.filePath}`;
        return data;
    },
};