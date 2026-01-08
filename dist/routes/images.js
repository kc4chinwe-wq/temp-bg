"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const multer_1 = __importDefault(require("multer"));
const images_1 = require("../controllers/images");
const router = express_1.default.Router();
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({ storage: storage });
router.get('/', auth_1.authenticate, images_1.getImages);
router.get('/:id', auth_1.authenticate, images_1.getImageById);
router.post('/upload', auth_1.authenticate, upload.single('file'), images_1.uploadImage);
router.post('/:id/like', auth_1.authenticate, images_1.likeImage);
router.post('/:id/comments', auth_1.authenticate, images_1.commentOnImage);
router.delete('/:id', auth_1.authenticate, images_1.deleteImage);
exports.default = router;
