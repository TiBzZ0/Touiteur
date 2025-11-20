const express = require('express');
const multer = require('multer');

const router = express.Router();
const fileController = require('../controllers/file.controller.js');

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, 'uploads/');
	},
	filename: (req, file, cb) => {
		const originalExtension = file.originalname.split('.').pop();
		cb(null, `${file.fieldname}-${Date.now()}.${originalExtension}`);
	}
});

const upload = multer({ storage: storage });

router.post('/upload', upload.single('file'), fileController.postFile);
router.get('/:uuid', fileController.getFile);
router.get('/id/:id', fileController.getFileById);

module.exports = router;
