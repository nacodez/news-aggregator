export interface NewsArticle {
    title: string;
    description: string;
    url: string;
    publishedAt: string;
    category: string;
    author: string;
    source: string;
    image: string;
}

export interface NewsFilters {
    query: string;
    from: string;
    to: string;
    category: string;
    source: string;
    author: string;
}

export interface FilterCardProps {
    title: string;
    children: React.ReactNode;
    gap: string;
}

export interface FilterInputProps {
    type: "text" | "date" | "select";
    name: string;
    value: string;
    onChange: (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => void;
    placeholder?: string;
    options?: { value: string; label: string }[];
}
