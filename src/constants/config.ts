export const sourceOptions = [
    { value: "", label: "All Sources" },
    { value: "The New York Times", label: "The New York Times" },
    { value: "The Guardian", label: "The Guardian" },
    { value: "NewsAPI", label: "NewsAPI" },
];

export const filterFields = [
    { type: "text", name: "query", placeholder: "Search articles..." },
    { type: "date", name: "from" },
    { type: "date", name: "to" },
];

export const selectFields = [
    { name: "source", options: sourceOptions },
];