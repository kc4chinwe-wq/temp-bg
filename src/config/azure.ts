import { BlobServiceClient } from '@azure/storage-blob';

export const AZURE_STORAGE_CONNECTION_STRING = process.env.AZURE_STORAGE_CONNECTION_STRING;
export const AZURE_CONTAINER_NAME = process.env.AZURE_CONTAINER_NAME || 'your_default_container_name';

if (!AZURE_STORAGE_CONNECTION_STRING) {
    throw new Error('Azure Storage Connection String is not defined in environment variables');
}

const blobServiceClient = BlobServiceClient.fromConnectionString(AZURE_STORAGE_CONNECTION_STRING);

export const getBlobServiceClient = () => {
    return blobServiceClient;
};