const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");

const s3Client = new S3Client({
  endpoint: process.env.LOCALSTACK_HOSTNAME ? `http://${process.env.LOCALSTACK_HOSTNAME}:4566` : "http://localhost:4566",
  region: "us-east-1",
  forcePathStyle: true,
});

exports.handler = async (event) => {
  try {
    const body = typeof event.body === 'string' ? JSON.parse(event.body) : (event.body || event);
    const couponId = body.coupon_id;

    if (!couponId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Missing required field: coupon_id" }),
      };
    }

    const fileName = `${couponId}.json`;
    const bucketName = "coupons";

    const params = {
      Bucket: bucketName,
      Key: fileName,
      Body: JSON.stringify(body),
      ContentType: "application/json",
    };

    await s3Client.send(new PutObjectCommand(params));

    return {
      statusCode: 200,
      body: JSON.stringify({ status: "success", file: fileName }),
    };
  } catch (error) {
    console.error("Error creating coupon file in S3:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ status: "error", message: error.message }),
    };
  }
};