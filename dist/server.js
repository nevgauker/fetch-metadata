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
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const meta_fetcher_1 = __importDefault(require("meta-fetcher"));
const csurf_1 = __importDefault(require("csurf"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const helmet_1 = __importDefault(require("helmet"));
const app = (0, express_1.default)();
const PORT = 3000;
//requests per sec limtaion
const limiter = (0, express_rate_limit_1.default)({
    windowMs: 1000,
    max: 5,
    message: { error: 'Too many requests, please try again later.' },
});
//security
app.use((0, helmet_1.default)()); // Sets various HTTP headers for security
app.use((0, cookie_parser_1.default)()); // Parse cookies
// app.use((0, csurf_1.default)({ cookie: true })); // CSRF protection
app.use(express_1.default.json());
app.use(limiter);
app.post('/fetch-metadata', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { urls } = req.body;
    //array of urls is required 
    if (!urls || !Array.isArray(urls)) {
        return res.status(400).json({ error: 'Please provide an array of URLs' });
    }
    // iterate all urls and fetch metadata for each 
    const metadataPromises = urls.map((url) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const result = yield (0, meta_fetcher_1.default)(url);
            const title = result.metadata.title;
            const description = result.metadata.description;
            const image = result.metadata.banner;
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
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
}
exports.default = app;
