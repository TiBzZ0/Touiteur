// Middleware to check the number of files and files in a request
module.exports = () => {
    return (req, res, next) => {
        const MAX_FILES = 4; // Maximum allowed files

        const files = req.body.files || [];

        if (files && files.length > MAX_FILES) {
            return res.status(400).json({ error: `Too many files. Maximum allowed is ${MAX_FILES}.` });
        }

        next();
    };
};