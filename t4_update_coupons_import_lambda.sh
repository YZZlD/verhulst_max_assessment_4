zip -j function.zip index.js package.json

aws --endpoint-url=http://localhost:4566 lambda update-function-code \
    --function-name coupons_import \
    --zip-file fileb://function.zip

echo "Lambda function 'coupons_import' updated successfully."