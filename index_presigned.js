const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

const s3Client = new S3Client({
  endpoint: process.env.LOCALSTACK_HOSTNAME ? `http://${process.env.LOCALSTACK_HOSTNAME}:4566` : "http://localhost:4566",
  region: "us-east-1",
  forcePathStyle: true,
});

exports.handler = async (event) => {
  try {
    const body = typeof event.body === 'string' ? JSON.parse(event.body) : (event.body || event);
    const filename = body.filename;

    if (!filename) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Missing required field: filename" }),
      };
    }

    const bucketName = "coupons";
    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: filename,
    });
    
    const presignedUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });

    return {
      statusCode: 200,
      body: JSON.stringify({ status: "success", presignedUrl }),
    };
  } catch (error) {
    console.error("Error generating pre-signed URL:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ status: "error", message: error.message }),
    };
  }
};