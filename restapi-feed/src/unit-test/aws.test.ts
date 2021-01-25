import 'mocha';
import chai from 'chai';
import chaiHttp from 'chai-http';

import * as AWS from '../aws';
import { currentConfig } from '../config/config';


chai.use(chaiHttp);

describe('AWS', () => {
    it('S3 getGetSignedUrl returns a valid string', () => {
        const url = AWS.getGetSignedUrl('xander0.jpg');
        chai.expect(url).to.have.string('https://');
    });

    it('Can download a photo from a valid S3 signed url', async function () {
        this.timeout(4000);
        const url = AWS.getGetSignedUrl('xander0.jpg');
        const s3Url = `https://${currentConfig.aws_media_bucket}.s3.${currentConfig.aws_region}.amazonaws.com`;
        const objectUrl = url.split(s3Url)[1];
        try {
            const res = await chai.request(s3Url).get(objectUrl);
            chai.expect(res).to.have.status(200);
            chai.expect(res).to.have.header('content-type', 'image/jpeg');
        } catch (err) {
            throw err;
        }
    });
});
