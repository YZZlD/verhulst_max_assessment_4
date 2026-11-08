zip -j function_presigned.zip index_presigned.js package.json

aws --endpoint-url=http://localhost:4566 lambda update-function-code \
    --function-name coupons_import_presigned_url \
    --zip-file fileb://function_presigned.zip

echo "Lambda function 'coupons_import_presigned_url' updated successfully."