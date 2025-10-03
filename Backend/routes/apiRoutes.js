const express = require('express');
const multer = require('multer');
const path = require('path');
const { uploadDocument, saveAnnotations, getDocumentAnnotations } = require('../controllers/apiController');

const router = express.Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

router.post('/documents/upload', upload.single('file'), uploadDocument);
router.post('/annotations/bulk', saveAnnotations);
router.get('/annotations/document/:documentId', getDocumentAnnotations);

module.exports = router;