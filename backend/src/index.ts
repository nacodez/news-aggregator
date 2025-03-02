import { NewsArticle } from './../../src/types';
import express from "express";
import axios from "axios";
import * as dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();
const PORT = 5000;

const allowedOrigins = ['http://localhost:5173', 'http://localhost:3000'];

const corsOptions = {
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));

const API_SOURCES = [
    {
        name: "newsAPI",
        url: "https://newsapi.org/v2/everything",
        apiKeyParam: "apiKey",
        apiKey: process.env.NEWS_API_KEY
    },
    {
        name: "guardian",
        url: "https://content.guardianapis.com/search",
        apiKeyParam: "api-key",
        apiKey: process.env.THE_GUARDIAN_API_KEY
    },
    {
        name: "nyt",
        url: "https://api.nytimes.com/svc/news/v3/content/all/all.json",
        apiKeyParam: "api-key",
        apiKey: process.env.NYT_API_KEY,
    },
];

const normalizeArticle = (sourceName: string, article: Record<string, unknown>): NewsArticle => {
    const sourceDisplayName = (() => {
        switch (sourceName) {
            case 'nyt':
                return "The New York Times";
            case 'guardian':
                return "The Guardian";
            case 'newsAPI':
                return "NewsAPI";
            default:
                return "Unknown Source";
        }
    })();

    const category = String(article.sectionName || article.section || "").trim();
    const author = String(article.author || "").trim();

    return {
        title: String(article.title || article.webTitle || article.headline || ""),
        description: String(article.description || article.abstract || ""),
        url: String(article.url || article.webUrl || article.shortUrl || ""),
        publishedAt: String(article.publishedAt || article.published_date || article.webPublicationDate || ""),
        category: category === "undefined" || category === "null" || !category ? "Unknown Category" : category,
        author: author === "undefined" || author === "null" || !author ? "Unknown Author" : author,
        source: sourceDisplayName,
        image: String(article.urlToImage || (Array.isArray(article.multimedia) && article.multimedia.length > 0 ? article.multimedia[0].url : "")),
    };
};

const fetchNewsFromSource = async (source: { name: string; url: string; apiKeyParam: string; apiKey?: string }, params: Record<string, string>) => {
    try {
        const response = await axios.get(source.url, {
            params: { ...params, [source.apiKeyParam]: source.apiKey }
        });

        if (source.name === "nyt") {
            return response.data.results.map((article: Record<string, unknown>) => normalizeArticle(source.name, article));
        } else if (source.name === "newsAPI") {
            return response.data.articles.map((article: Record<string, unknown>) => normalizeArticle(source.name, article));
        } else if (source.name === "guardian") {
            return response.data.response.results.map((article: Record<string, unknown>) => normalizeArticle(source.name, article));
        }
        return response.data.articles || [];
    } catch (error) {
        console.error(`Error fetching from ${source.name}:`, error.response?.data || error.message);
        return [];
    }
};

app.get("/api/news", async (req, res) => {
    const { query, from, to, category, source, author } = req.query;

    const params: Record<string, string> = {
        q: query ? query.toString() : "top-stories",
    };

    if (query) params.q = query as string;
    if (from) params.from = from as string;
    if (to) params.to = to as string;
    if (category) params.category = category as string;
    if (source) params.source = source as string;

    try {
        // Fetch data from all sources in parallel
        const results = await Promise.all(API_SOURCES.map((source) => fetchNewsFromSource(source, params)));

        let mergedNews = results.flat().sort((a, b) => {
            return new Date(b.publishedAt || b.pub_date || b.webPublicationDate).getTime() -
                new Date(a.publishedAt || a.pub_date || a.webPublicationDate).getTime();
        });

        if (from || to) {
            const fromDate = from ? new Date(from as string).setHours(0, 0, 0, 0) : null;
            const toDate = to ? new Date(to as string).setHours(23, 59, 59, 999) : null;

            mergedNews = mergedNews.filter((article) => {
                const publishedDate = new Date(article.publishedAt).getTime();

                return (
                    (!fromDate || publishedDate >= fromDate) &&
                    (!toDate || publishedDate <= toDate)
                );
            });
        }

        if (category) {
            mergedNews = mergedNews.filter((article) => article.category.toLowerCase() === category.toString().toLowerCase());
        }

        if (source) {
            mergedNews = mergedNews.filter((article) => article.source.toLowerCase() === source.toString().toLowerCase());
        }
        if (author) {
            mergedNews = mergedNews.filter((article) => article.author.toLowerCase() === author.toString().toLowerCase());
        }

        res.json({ articles: mergedNews });
    } catch (error) {
        console.error("Error fetching aggregated news:", error);
        res.status(500).json({ error: "Error fetching news" });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
