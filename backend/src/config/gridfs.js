const mongoose = require('mongoose');
const { Readable } = require('stream');

let coversBucket = null;
let manuscriptsBucket = null;

const getBuckets = () => {
  const db = mongoose.connection.db;
  if (!db) {
    throw new Error('Database connection not established');
  }

  const GridFSBucket = mongoose.mongo.GridFSBucket;

  if (!coversBucket) {
    coversBucket = new GridFSBucket(db, { bucketName: 'covers' });
  }

  if (!manuscriptsBucket) {
    manuscriptsBucket = new GridFSBucket(db, { bucketName: 'manuscripts' });
  }

  return { coversBucket, manuscriptsBucket };
};

/**
 * Upload a Buffer to GridFS using Mongoose's internal GridFSBucket
 */
const uploadToGridFS = async (bucketName, filename, buffer, contentType) => {
  const db = mongoose.connection.db;
  const GridFSBucket = mongoose.mongo.GridFSBucket;
  const bucket = new GridFSBucket(db, { bucketName });

  return new Promise((resolve, reject) => {
    const uploadStream = bucket.openUploadStream(filename, {
      contentType: contentType || 'application/octet-stream'
    });

    const readable = new Readable();
    readable.push(buffer);
    readable.push(null);

    readable
      .pipe(uploadStream)
      .on('error', (err) => reject(err))
      .on('finish', () => {
        resolve({
          fileId: uploadStream.id,
          filename: uploadStream.filename
        });
      });
  });
};

/**
 * Stream a file from GridFS using Mongoose's internal GridFSBucket
 */
const getGridFSFileStream = async (bucketName, fileId) => {
  const db = mongoose.connection.db;
  const GridFSBucket = mongoose.mongo.GridFSBucket;
  const ObjectId = mongoose.Types.ObjectId;
  const bucket = new GridFSBucket(db, { bucketName });
  const objectId = typeof fileId === 'string' ? new ObjectId(fileId) : fileId;

  const files = await db.collection(`${bucketName}.files`).find({ _id: objectId }).toArray();
  if (!files || files.length === 0) {
    return null;
  }

  const fileDoc = files[0];
  const downloadStream = bucket.openDownloadStream(objectId);

  return {
    fileDoc,
    downloadStream
  };
};

/**
 * Delete a file from GridFS
 */
const deleteGridFSFile = async (bucketName, fileId) => {
  try {
    const db = mongoose.connection.db;
    const GridFSBucket = mongoose.mongo.GridFSBucket;
    const ObjectId = mongoose.Types.ObjectId;
    const bucket = new GridFSBucket(db, { bucketName });
    const objectId = typeof fileId === 'string' ? new ObjectId(fileId) : fileId;
    await bucket.delete(objectId);
  } catch (err) {
    console.error(`[GridFS Delete Error] Bucket: ${bucketName}, ID: ${fileId}`, err.message);
  }
};

/**
 * Drop GridFS buckets completely (for seed script)
 */
const dropGridFSBuckets = async () => {
  try {
    const db = mongoose.connection.db;
    if (db) {
      await db.collection('covers.files').drop().catch(() => {});
      await db.collection('covers.chunks').drop().catch(() => {});
      await db.collection('manuscripts.files').drop().catch(() => {});
      await db.collection('manuscripts.chunks').drop().catch(() => {});
    }
  } catch (err) {
    // ignore
  }
};

module.exports = {
  getBuckets,
  uploadToGridFS,
  getGridFSFileStream,
  deleteGridFSFile,
  dropGridFSBuckets
};
