cat << 'EOF' > bucket-policy.json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "DenyDeleteWithoutMFA",
      "Effect": "Deny",
      "Principal": "*",
      "Action": [
        "s3:DeleteObject",
        "s3:DeleteBucket"
      ],
      "Resource": [
        "arn:aws:s3:::coupons",
        "arn:aws:s3:::coupons/*"
      ],
      "Condition": {
        "Bool": {
          "aws:MultiFactorAuthPresent": "false"
        }
      }
    }
  ]
}
EOF

aws --endpoint-url=http://localhost:4566 s3api put-bucket-policy \
    --bucket coupons \
    --policy file://bucket-policy.json

echo "Bucket policy preventing deletion without MFA applied successfully."