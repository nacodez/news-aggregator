import { useQuery } from "@tanstack/react-query";
import { fetchNews } from "../api/newsApi";
import { NewsArticle, NewsFilters } from "../types/types";

export const useFetchNews = (filters: NewsFilters) => {
    return useQuery({
        queryKey: ["news", filters],
        queryFn: () => fetchNews(filters),
        staleTime: 7 * 60 * 1000, // Cache data for 7 minutes
        enabled: true,
        select: (data) => {
            const uniqueCategories = Array.from(new Set(data.map((article: NewsArticle) => article.category)));
            const uniqueAuthors = Array.from(new Set(data.map((article: NewsArticle) => article.author)));

            return {
                articles: data,
                uniqueCategories,
                uniqueAuthors,
            };
        },
    });
};
