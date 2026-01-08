"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteImage = exports.commentOnImage = exports.likeImage = exports.getImageById = exports.getImages = exports.uploadImage = void 0;
const User_1 = __importDefault(require("../models/User"));
const Image_1 = __importDefault(require("../models/Image"));
// Get admin emails from environment
const getAdminEmails = () => {
    const adminEmailsEnv = process.env.ADMIN_EMAILS || '';
    return adminEmailsEnv
        .split(',')
        .map((email) => email.trim().toLowerCase())
        .filter((email) => email.length > 0);
};
// Check if user is admin
const isAdmin = (userEmail) => {
    const adminEmails = getAdminEmails();
    return adminEmails.includes(userEmail.toLowerCase());
};
const uploadImage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        // Check if user is admin
        const userId = req.userId || ((_a = req.user) === null || _a === void 0 ? void 0 : _a._id);
        const user = yield User_1.default.findById(userId);
        if (!user || !isAdmin(user.email)) {
            return res.status(403).json({ message: 'Only admin can create posts' });
        }
        if (!req.file) {
            return res.status(400).json({ message: 'No image file provided' });
        }
        if (!req.body.caption) {
            return res.status(400).json({ message: 'Caption is required' });
        }
        const newImage = new Image_1.default({
            caption: req.body.caption,
            image: {
                data: req.file.buffer,
                contentType: req.file.mimetype
            },
            uploaderId: userId,
            tags: req.body.tags ? req.body.tags.split(',').map((tag) => tag.trim()) : []
        });
        yield newImage.save();
        const populatedImage = yield Image_1.default.findById(newImage._id)
            .populate('uploaderId', 'username email')
            .populate('likes', 'username')
            .populate('comments.user', 'username');
        res.status(201).json(populatedImage);
    }
    catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ message: error.message || 'Error uploading image' });
    }
});
exports.uploadImage = uploadImage;
const getImages = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const images = yield Image_1.default.find()
            .populate('uploaderId', 'username')
            .populate('likes', 'username')
            .populate('comments.user', 'username')
            .sort({ createdAt: -1 });
        const imagesWithUrls = images.map((image) => (Object.assign(Object.assign({}, image.toObject()), { imageUrl: `data:${image.image.contentType};base64,${image.image.data.toString('base64')}` })));
        res.json(imagesWithUrls);
    }
    catch (error) {
        console.error('Fetch error:', error);
        res.status(500).json({ message: 'Error fetching images' });
    }
});
exports.getImages = getImages;
const getImageById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const image = yield Image_1.default.findById(req.params.id)
            .populate('uploaderId', 'username')
            .populate('likes', 'username')
            .populate('comments.user', 'username');
        if (!image) {
            return res.status(404).json({ message: 'Image not found' });
        }
        res.json(image);
    }
    catch (error) {
        console.error('Fetch error:', error);
        res.status(500).json({ message: 'Error fetching image' });
    }
});
exports.getImageById = getImageById;
const likeImage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    try {
        const { id } = req.params;
        const userId = (_b = req.user) === null || _b === void 0 ? void 0 : _b._id;
        const image = yield Image_1.default.findById(id);
        if (!image) {
            return res.status(404).json({ message: 'Image not found' });
        }
        const hasLiked = image.likes.includes(userId);
        // Update likes array
        if (hasLiked) {
            image.likes = image.likes.filter(like => like.toString() !== (userId === null || userId === void 0 ? void 0 : userId.toString()));
        }
        else {
            image.likes.push(userId);
        }
        yield image.save();
        // Fetch updated image with populated fields
        const updatedImage = yield Image_1.default.findById(id)
            .populate('uploaderId', 'username')
            .populate('likes', 'username')
            .populate('comments.user', 'username');
        if (!updatedImage) {
            return res.status(404).json({ message: 'Image not found after update' });
        }
        // Transform the image to include the imageUrl
        const imageResponse = Object.assign(Object.assign({}, updatedImage.toObject()), { imageUrl: `data:${updatedImage.image.contentType};base64,${updatedImage.image.data.toString('base64')}` });
        res.json(imageResponse);
    }
    catch (error) {
        console.error('Like error:', error);
        res.status(500).json({ message: 'Error updating like' });
    }
});
exports.likeImage = likeImage;
const commentOnImage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _c;
    try {
        const { text } = req.body;
        const image = yield Image_1.default.findById(req.params.id);
        if (!image) {
            return res.status(404).json({ message: 'Image not found' });
        }
        if (!((_c = req.user) === null || _c === void 0 ? void 0 : _c._id)) {
            return res.status(401).json({ message: 'User not authenticated' });
        }
        image.comments.push({
            text,
            user: req.user._id,
            createdAt: new Date()
        });
        yield image.save();
        const populatedImage = yield Image_1.default.findById(image._id)
            .populate('uploaderId', 'username')
            .populate('comments.user', 'username')
            .lean();
        if (!populatedImage) {
            return res.status(500).json({ message: 'Error retrieving image' });
        }
        const imageResponse = {
            _id: populatedImage._id,
            caption: populatedImage.caption,
            uploaderId: populatedImage.uploaderId,
            likes: populatedImage.likes,
            comments: populatedImage.comments,
            createdAt: populatedImage.createdAt,
            imageUrl: `data:${populatedImage.image.contentType};base64,${populatedImage.image.data.toString('base64')}`
        };
        res.json(imageResponse);
    }
    catch (error) {
        console.error('Comment error:', error);
        res.status(500).json({ message: 'Error adding comment' });
    }
});
exports.commentOnImage = commentOnImage;
const deleteImage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _d;
    try {
        const { id } = req.params;
        const image = yield Image_1.default.findById(id);
        if (!image) {
            return res.status(404).json({ message: 'Image not found' });
        }
        // Check if the user is the owner of the image
        if (image.uploaderId.toString() !== ((_d = req.user) === null || _d === void 0 ? void 0 : _d._id.toString())) {
            return res.status(403).json({ message: 'Not authorized to delete this image' });
        }
        yield Image_1.default.findByIdAndDelete(id);
        res.json({ message: 'Image deleted successfully' });
    }
    catch (error) {
        console.error('Delete image error:', error);
        res.status(500).json({ message: 'Error deleting image' });
    }
});
exports.deleteImage = deleteImage;
