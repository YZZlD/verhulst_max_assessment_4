aws --endpoint-url=http://localhost:4566 s3api create-bucket --bucket coupons --acl private
echo "S3 bucket 'coupons' created successfully with private ACL."