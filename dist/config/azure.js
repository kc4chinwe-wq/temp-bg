"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBlobServiceClient = exports.AZURE_CONTAINER_NAME = exports.AZURE_STORAGE_CONNECTION_STRING = void 0;
const storage_blob_1 = require("@azure/storage-blob");
exports.AZURE_STORAGE_CONNECTION_STRING = process.env.AZURE_STORAGE_CONNECTION_STRING;
exports.AZURE_CONTAINER_NAME = process.env.AZURE_CONTAINER_NAME || 'your_default_container_name';
if (!exports.AZURE_STORAGE_CONNECTION_STRING) {
    throw new Error('Azure Storage Connection String is not defined in environment variables');
}
const blobServiceClient = storage_blob_1.BlobServiceClient.fromConnectionString(exports.AZURE_STORAGE_CONNECTION_STRING);
const getBlobServiceClient = () => {
    return blobServiceClient;
};
exports.getBlobServiceClient = getBlobServiceClient;
