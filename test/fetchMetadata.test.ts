import request from 'supertest';
import { expect } from 'chai';
import app from '../server'; 

describe('Fetch Metadata API', () => {

    it('should return metadata for valid URLs', async () => {
        const response = await request(app)
            .post('/fetch-metadata')
            .send({ urls: ['https://hoppscotch.io'] });

        expect(response.status).to.equal(200);
        expect(response.body).to.be.an('array');
        expect(response.body[0]).to.have.property('url').that.equals('https://hoppscotch.io');
        expect(response.body[0]).to.have.property('title').that.is.a('string');
    });

    it('should return an error for invalid request body', async () => {
        const response = await request(app)
            .post('/fetch-metadata')
            .send({ url: 'https://hoppscotch.io' }); // Incorrect key, should be `urls`

        expect(response.status).to.equal(400);
        expect(response.body).to.have.property('error').that.equals('Please provide an array of URLs');
    });

    it('should enforce rate limiting', async () => {
        for (let i = 0; i < 6; i++) {
            await request(app)
                .post('/fetch-metadata')
                .send({ urls: ['https://hoppscotch.io'] });
        }
        const response = await request(app)
            .post('/fetch-metadata')
            .send({ urls: ['https://hoppscotch.io'] });

        expect(response.status).to.equal(429);
        expect(response.body).to.have.property('error').that.equals('Too many requests, please try again later.');
    });

});
