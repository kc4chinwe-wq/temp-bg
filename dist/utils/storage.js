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
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteImage = exports.uploadImage = void 0;
const storage_blob_1 = require("@azure/storage-blob");
const stream_1 = require("stream");
const uuid_1 = require("uuid");
const azure_1 = require("../config/azure");
if (!azure_1.AZURE_STORAGE_CONNECTION_STRING) {
    throw new Error('AZURE_STORAGE_CONNECTION_STRING is not defined in environment variables');
}
const blobServiceClient = storage_blob_1.BlobServiceClient.fromConnectionString(azure_1.AZURE_STORAGE_CONNECTION_STRING);
const containerClient = blobServiceClient.getContainerClient(azure_1.AZURE_CONTAINER_NAME);
const uploadImage = (file, caption, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const blobName = `${(0, uuid_1.v4)()}-${file.originalname}`;
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);
    const stream = stream_1.Readable.from(file.buffer);
    const uploadOptions = {
        blobHTTPHeaders: { blobContentType: file.mimetype },
    };
    yield blockBlobClient.uploadStream(stream, file.size, undefined, uploadOptions);
    return {
        url: blockBlobClient.url,
        caption,
        userId,
        uploadDate: new Date().toISOString(),
    };
});
exports.uploadImage = uploadImage;
const deleteImage = (blobName) => __awaiter(void 0, void 0, void 0, function* () {
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);
    yield blockBlobClient.deleteIfExists();
});
exports.deleteImage = deleteImage;
