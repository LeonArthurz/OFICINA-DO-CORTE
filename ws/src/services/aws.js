const { S3Client, PutObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');

module.exports = {
    // CHAVES DE ACESSO DO USUÁRIO IAM
    IAM_USER_KEY: 'AKIAVQXZPPTZ3VGNLVPV',
    IAM_USER_SECRET: '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',
    
    // NOME DO BUCKET NO AMAZON S3
    BUCKET_NAME: 'oficina-do-corte-dev',
    
    // REGIÃO DA AWS ONDE O BUCKET ESTÁ LOCALIZADO
    AWS_REGION: 'us-east-1',
    
    // FUNÇÃO PARA FAZER UPLOAD DE ARQUIVOS PARA O AMAZON S3
    uploadToS3: function (file, filename, acl = 'public-read') {
        return new Promise(async (resolve, reject) => {
            // INSTÂNCIA DO CLIENTE DO SERVIÇO AMAZON S3
            const client = new S3Client({
                region: this.AWS_REGION,
                credentials: {
                    accessKeyId: this.IAM_USER_KEY,
                    secretAccessKey: this.IAM_USER_SECRET,
                },
            });

            // PARÂMETROS PARA O UPLOAD DO ARQUIVO
            const params = {
                Bucket: this.BUCKET_NAME,
                Key: filename,
                Body: file.data,
                ACL: acl,
            };

            try {
                // EXECUTA O COMANDO DE UPLOAD DO ARQUIVO PARA O AMAZON S3
                const data = await client.send(new PutObjectCommand(params));
                console.log(data);
                return resolve({ error: false, message: data });
            } catch (err) {
                console.error(err);
                return resolve({ error: true, message: err.message });
            }
        });
    },
    
    // FUNÇÃO PARA DELETAR ARQUIVO DO AMAZON S3
    deleteFileS3: function (key) {
        return new Promise(async (resolve, reject) => {
            // INSTÂNCIA DO CLIENTE DO SERVIÇO AMAZON S3
            const client = new S3Client({
                region: this.AWS_REGION,
                credentials: {
                    accessKeyId: this.IAM_USER_KEY,
                    secretAccessKey: this.IAM_USER_SECRET,
                },
            });

            // PARÂMETROS PARA O COMANDO DE DELEÇÃO DO ARQUIVO
            const params = {
                Bucket: this.BUCKET_NAME,
                Key: key,
            };

            try {
                // EXECUTA O COMANDO DE DELEÇÃO DO ARQUIVO NO AMAZON S3
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
