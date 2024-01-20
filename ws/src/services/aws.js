const { S3Client, PutObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');

module.exports = {
    IAM_USER_KEY: 'AKIAVQXZPPTZ3VGNLVPV',
    IAM_USER_SECRET: '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',
    BUCKET_NAME: 'oficina-do-corte-dev',
    AWS_REGION: 'us-east-1',
    uploadToS3: function (file, filename, acl = 'public-read') {
        return new Promise(async (resolve, reject) => {
            const client = new S3Client({
                region: this.AWS_REGION,
                credentials: {
                    accessKeyId: this.IAM_USER_KEY,
                    secretAccessKey: this.IAM_USER_SECRET,
                },
            });

            const params = {
                Bucket: this.BUCKET_NAME,
                Key: filename,
                Body: file.data,
                ACL: acl,
            };

            try {
                const data = await client.send(new PutObjectCommand(params));
                console.log(data);
                return resolve({ error: false, message: data });
            } catch (err) {
                console.error(err);
                return resolve({ error: true, message: err.message });
            }
        });
    },
    deleteFileS3: function (key) {
        return new Promise(async (resolve, reject) => {
            const client = new S3Client({
                region: this.AWS_REGION,
                credentials: {
                    accessKeyId: this.IAM_USER_KEY,
                    secretAccessKey: this.IAM_USER_SECRET,
                },
            });

            const params = {
                Bucket: this.BUCKET_NAME,
                Key: key,
            };

            try {
                const data = await client.send(new DeleteObjectCommand(params));
                console.log(data);
                return resolve({ error: false, message: data });
            } catch (err) {
                console.error(err);
                return resolve({ error: true, message: err.message });
            }
        });
    },
};
