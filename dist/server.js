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
const express_1 = __importDefault(require("express"));
const axios_1 = __importDefault(require("axios"));
const cheerio_1 = __importDefault(require("cheerio"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const meta_fetcher_1 = __importDefault(require("meta-fetcher"));
const app = (0, express_1.default)();
const PORT = 3000;
const limiter = (0, express_rate_limit_1.default)({
    windowMs: 1000, // 1 second
    max: 5, // Limit each IP to 5 requests per windowMs
    message: { error: 'Too many requests, please try again later.' },
});
app.use(express_1.default.json());
app.use(limiter);
app.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    return res.json({ "status": "API works" });
}));
app.get('/test', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield (0, meta_fetcher_1.default)('https://www.bbc.com/');
        return res.json({ "data": result });
    }
    catch (error) {
        return res.json({ "error": error });
    }
}));
app.post('/fetch-metadata', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { urls } = req.body;
    if (!urls || !Array.isArray(urls)) {
        return res.status(400).json({ error: 'Please provide an array of URLs' });
    }
    const metadataPromises = urls.map((url) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { data } = yield axios_1.default.get(url);
            const $ = cheerio_1.default.load(data);
            const title = $('head > title').text();
            const description = $('meta[name="description"]').attr('content') || '';
            const image = $('meta[property="og:image"]').attr('content') || '';
            return {
                url,
                title,
                description,
                image,
            };
        }
        catch (error) {
            return { url, error: 'Failed to fetch metadata' };
        }
    }));
    const metadata = yield Promise.all(metadataPromises);
    res.json(metadata);
}));
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
