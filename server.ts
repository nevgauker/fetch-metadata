import express, { Request, Response } from 'express';
import axios from 'axios';
import cheerio from 'cheerio';
import rateLimit from 'express-rate-limit';
import metaFetcher from 'meta-fetcher';

const app = express();
const PORT = 3000;

interface Metadata {
    url: string;
    title?: string;
    description?: string;
    image?: string;
    error?: string;
}

const limiter = rateLimit({
    windowMs: 1000, // 1 second
    max: 5, // Limit each IP to 5 requests per windowMs
    message: { error: 'Too many requests, please try again later.' },
});

app.use(express.json());
app.use(limiter);

app.get('/', async (req: Request, res: Response) => {
    return res.json({ "status": "API works" });
});
app.get('/test', async (req: Request, res: Response) => {

    try {
        const result = await metaFetcher('https://www.bbc.com/');
        return res.json({ "data": result});
    } catch(error){
        return res.json({ "error": error});
    }

});

app.post('/fetch-metadata', async (req: Request, res: Response) => {
    const { urls }: { urls: string[] } = req.body;

    if (!urls || !Array.isArray(urls)) {
        return res.status(400).json({ error: 'Please provide an array of URLs' });
    }

    const metadataPromises: Promise<Metadata>[] = urls.map(async (url) => {
        try {
            const { data } = await axios.get(url);
            const $ = cheerio.load(data);

            const title = $('head > title').text();
            const description = $('meta[name="description"]').attr('content') || '';
            const image = $('meta[property="og:image"]').attr('content') || '';

            return {
                url,
                title,
                description,
                image,
            };
        } catch (error) {
            return { url, error: 'Failed to fetch metadata' };
        }
    });

    const metadata = await Promise.all(metadataPromises);
    res.json(metadata);
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
