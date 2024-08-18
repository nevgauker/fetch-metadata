"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const chai_1 = require("chai");
const server_1 = __importDefault(require("../server")); // Assuming your server is exported from this path
describe('Fetch Metadata API', () => {
    it('should return metadata for valid URLs', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(server_1.default)
            .post('/fetch-metadata')
            .send({ urls: ['https://hoppscotch.io'] });
        (0, chai_1.expect)(response.status).to.equal(200);
        (0, chai_1.expect)(response.body).to.be.an('array');
        (0, chai_1.expect)(response.body[0]).to.have.property('url').that.equals('https://hoppscotch.io');
        (0, chai_1.expect)(response.body[0]).to.have.property('title').that.is.a('string');
    }));
    it('should return an error for invalid request body', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(server_1.default)
            .post('/fetch-metadata')
            .send({ url: 'https://example.com' }); // Incorrect key, should be `urls`
        (0, chai_1.expect)(response.status).to.equal(400);
        (0, chai_1.expect)(response.body).to.have.property('error').that.equals('Please provide an array of URLs');
    }));
    it('should enforce rate limiting', () => __awaiter(void 0, void 0, void 0, function* () {
        for (let i = 0; i < 6; i++) {
            yield (0, supertest_1.default)(server_1.default)
                .post('/fetch-metadata')
                .send({ urls: ['https://example.com'] });
        }
        const response = yield (0, supertest_1.default)(server_1.default)
            .post('/fetch-metadata')
            .send({ urls: ['https://example.com'] });
        (0, chai_1.expect)(response.status).to.equal(429);
        (0, chai_1.expect)(response.body).to.have.property('error').that.equals('Too many requests, please try again later.');
    }));
});
