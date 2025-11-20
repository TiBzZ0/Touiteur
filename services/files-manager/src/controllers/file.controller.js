const File = require('../models/file.model');

var generator = require('node-uuid-generator');

module.exports = {
    postFile: async (req, res) => {
        let uuid = generator.generate();

        if (!req.file) {
            return res.status(400).json({ message: "File is required" });
        }
        try {
            const url = `/uploads/${req.file.filename}`;
            console.log(`File uploaded: ${url} with UUID: ${uuid}`);
            const newFile = new File({ uuid, url });
            await newFile.save();
            res.status(201).json({ message: "File uploaded successfully", file: newFile});
        } catch (error) {
            res.status(500).json({ message: "Error uploading file", error });
        }
    },

    getFile: async (req, res) => {
        const { uuid } = req.params;
        if (!uuid) {
            return res.status(400).json({ message: "File UUID is required" });
        }
        try {
            const file = await File.findOne({ uuid }).select('url extension');
            if (!file) {
                return res.status(404).json({ message: "File not found" });
            }
            // On retourne juste l'URL
            res.status(200).json(file);
        } catch (error) {
            res.status(500).json({ message: "Error retrieving file", error });
        }
    },

    getFileById: async (req, res) => {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ message: "File ID is required" });
        }
        try {
            const file = await File.findById(id).select('url extension');
            if (!file) {
                return res.status(404).json({ message: "File not found" });
            }
            res.status(200).json(file);
        } catch (error) {
            res.status(500).json({ message: "Error retrieving file by ID", error });
        }
    }
}