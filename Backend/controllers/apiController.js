const db = require('../config/db');



exports.uploadDocument = async (req, res) => {
    const { process_id, form_id } = req.body;
    const file = req.file;

    if (!file) {
        return res.status(400).json({ message: 'No file uploaded.' });
    }

    try {
        const [result] =
            await db.query(
                'INSERT INTO documents (process_id, form_id, original_filename, storage_filename) VALUES (?, ?, ?, ?)',
                [process_id, form_id, file.originalname, file.filename]
            );
        res.status(201).json({
            message: 'File uploaded successfully',
            documentId: result.insertId,
            filePath: `/uploads/${file.filename}`
        });
    } catch (error) {
        console.error('Error during document database insertion:', error);
        res.status(500).json({ message: 'Server error while saving document metadata.' });
    }
};


exports.saveAnnotations = async (req, res) => {
    const { documentId, annotations } = req.body;

    if (!documentId || !Array.isArray(annotations) || annotations.length === 0) {
        return res.status(400).json({ message: 'Invalid data provided.' });
    }

    try {
        const query = `
      INSERT INTO annotations (document_id, field_name, field_header, field_type, page_number, bbox_x1, bbox_y1, bbox_x2, bbox_y2, metadata) 
      VALUES ?
    `;
        const values = annotations.map(ann => [
            documentId,
            ann.field_name,
            ann.field_header,
            ann.field_type,
            ann.page,
            ann.bbox[0], ann.bbox[1], ann.bbox[2], ann.bbox[3],
            JSON.stringify(ann.metadata)
        ]);

        await db.query(query, [values]);
        res.status(201).json({ message: 'Annotations saved successfully.' });
    } catch (error) {
        console.error('Error saving annotations:', error);
        res.status(500).json({ message: 'Server error while saving annotations.' });
    }
};

exports.getDocumentAnnotations = async (req, res) => {
    const { documentId } = req.params;

    try {
        const [docDetails] = await db.query('SELECT storage_filename FROM documents WHERE id = ?', [documentId]);
        if (docDetails.length === 0) {
            return res.status(404).json({ message: 'Document not found.' });
        }

        const [annotations] = await db.query('SELECT * FROM annotations WHERE document_id = ?', [documentId]);

        const formattedFields = annotations.map(ann => ({
            id: ann.id,
            annotation: {
                bbox: { x1: ann.bbox_x1, y1: ann.bbox_y1, x2: ann.bbox_x2, y2: ann.bbox_y2 },
                page: ann.page_number,
                field_id: ann.id,
                field_name: ann.field_name,
                field_header: ann.field_header
            },
            field_name: ann.field_name,
            field_header: ann.field_header,
            field_type: ann.field_type,
            max_length: ann.metadata?.max_length || 0,
            required: ann.metadata?.required || false,
            placeholder: ann.field_name.replace(/_/g, ' '),
            types: ann.field_type.toLowerCase().replace('field', ''),
        }));

        res.status(200).json({
            filePath: `/uploads/${docDetails[0].storage_filename}`,
            fields: formattedFields
        });
    } catch (error) {
        console.error('Error fetching annotations:', error);
        res.status(500).json({ message: 'Server error while fetching annotations.' });
    }
};