import express, { Request, Response } from 'express';
import rateLimit from 'express-rate-limit';
import metaFetcher from 'meta-fetcher';
import csurf from 'csurf';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';

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
    windowMs: 1000, 
    max: 5, 
    message: { error: 'Too many requests, please try again later.' },
});

app.use(helmet()); // Sets various HTTP headers for security
app.use(cookieParser()); // Parse cookies
app.use(csurf({ cookie: true })); // CSRF protection

app.use(express.json());
app.use(limiter);

app.post('/fetch-metadata', async (req: Request, res: Response) => {
    const { urls }: { urls: string[] } = req.body;

    if (!urls || !Array.isArray(urls)) {
        return res.status(400).json({ error: 'Please provide an array of URLs' });
    }

    const metadataPromises: Promise<Metadata>[] = urls.map(async (url) => {
        try {
            const result = await metaFetcher(url);
            const title = result.metadata.title;
            const description = result.metadata.description;
            const image = result.metadata.banner;
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
