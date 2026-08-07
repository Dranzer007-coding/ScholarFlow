const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure upload directory exists
const uploadDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

/**
 * Server-side magic-byte (file signature) validation.
 * Reads the first 8 bytes of the file buffer to detect actual file type,
 * regardless of what the client declares in the Content-Type header.
 * This prevents MIME-type spoofing attacks.
 */
const MAGIC_BYTES = {
  // JPEG: starts with FF D8 FF
  jpeg: [0xFF, 0xD8, 0xFF],
  // PNG: starts with 89 50 4E 47 0D 0A 1A 0A
  png: [0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A],
  // PDF: starts with %PDF (25 50 44 46)
  pdf: [0x25, 0x50, 0x44, 0x46]
};

const matchesMagicBytes = (buffer, signature) => {
  return signature.every((byte, i) => buffer[i] === byte);
};

const validateFileMagicBytes = (filePath) => {
  try {
    const fd = fs.openSync(filePath, 'r');
    const buf = Buffer.alloc(8);
    fs.readSync(fd, buf, 0, 8, 0);
    fs.closeSync(fd);

    if (matchesMagicBytes(buf, MAGIC_BYTES.jpeg)) return true;
    if (matchesMagicBytes(buf, MAGIC_BYTES.png)) return true;
    if (matchesMagicBytes(buf, MAGIC_BYTES.pdf)) return true;

    return false;
  } catch {
    return false;
  }
};

const fileFilter = (req, file, cb) => {
  const allowedExtensions = /\.(jpeg|jpg|png|pdf)$/i;
  const hasValidExtension = allowedExtensions.test(path.extname(file.originalname));

  if (!hasValidExtension) {
    return cb(new Error('Only JPEG, PNG, or PDF files are allowed'));
  }

  // Extension check passes; magic-byte validation happens in a post-upload hook
  // since we need the file on disk. See the validateAfterUpload middleware below.
  cb(null, true);
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: fileFilter
});

/**
 * Post-upload middleware that validates file magic bytes after Multer saves the file.
 * Must be used immediately after upload.single() / upload.array() in the route chain.
 */
const validateMagicBytes = (req, res, next) => {
  if (!req.file) return next();

  const filePath = req.file.path;
  const isValid = validateFileMagicBytes(filePath);

  if (!isValid) {
    // Delete the invalid file immediately
    fs.unlink(filePath, () => {});
    return res.status(400).json({
      success: false,
      error: 'File content does not match a valid JPEG, PNG, or PDF. Upload rejected for security reasons.'
    });
  }

  next();
};

module.exports = { upload, validateMagicBytes };
