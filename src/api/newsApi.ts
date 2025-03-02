import axios from "axios";
import { NewsFilters } from "../types/types";

export const fetchNews = async (filters: NewsFilters) => {
    const response = await axios.get("http://localhost:5000/api/news", { params: filters });
    return response.data.articles;
};
