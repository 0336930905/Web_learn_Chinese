/**
 * Upload Routes - Handle file uploads
 */

const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const { authMiddleware } = require('../middleware/auth');

// Upload single image
router.post('/image', authMiddleware, upload.single('image'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'No file uploaded'
            });
        }

        // Return the file path (relative to public directory)
        const imageUrl = `/uploads/${req.file.filename}`;
        
        res.json({
            success: true,
            message: 'File uploaded successfully',
            imageUrl: imageUrl,
            fileName: req.file.filename,
            fileSize: req.file.size
        });
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({
            success: false,
            message: 'Error uploading file',
            error: error.message
        });
    }
});

// Upload multiple images
router.post('/images', authMiddleware, upload.array('images', 10), (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No files uploaded'
            });
        }

        const imageUrls = req.files.map(file => ({
            imageUrl: `/uploads/${file.filename}`,
            fileName: file.filename,
            fileSize: file.size
        }));

        res.json({
            success: true,
            message: `${req.files.length} file(s) uploaded successfully`,
            images: imageUrls
        });
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({
            success: false,
            message: 'Error uploading files',
            error: error.message
        });
    }
});

module.exports = router;
