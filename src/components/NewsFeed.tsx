import { useState, Suspense, useEffect } from "react";
import { useFetchNews } from "../hooks/useFetchNews";
import React from "react";
import NewsCard from "./common/NewsCard";
import FilterInput from "./common/FilterInput";
import { filterFields, selectFields } from "../constants/config";
import FilterCard from "./common/FilterCard";
import { Button } from "./common/Button";
import { NewsArticle } from "../types";

const NewsFeed = () => {
  const [filters, setFilters] = useState({
    category: "",
    query: "",
    from: "",
    to: "",
    source: "",
    author: "",
  });

  const [debouncedQuery, setDebouncedQuery] = useState(filters.query);

  useEffect(() => {
    const savedPreferences = localStorage.getItem("userPreferences");
    if (savedPreferences) {
      setFilters(JSON.parse(savedPreferences));
    }
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedQuery(filters.query); // Delay setting the query after debounce
    }, 2000); // 2-second debounce delay

    return () => clearTimeout(timeoutId);
  }, [filters.query]);

  const { data, isLoading, error } = useFetchNews({
    ...filters,
    query: debouncedQuery,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleClearFilters = () => {
    setFilters({
      category: "",
      query: "",
      from: "",
      to: "",
      source: "",
      author: "",
    });
  };

  const handleSavePreferences = () => {
    localStorage.setItem("userPreferences", JSON.stringify(filters));
  };

  const handleRemovePreferences = () => {
    localStorage.removeItem("userPreferences");
    setFilters({
      category: "",
      query: "",
      from: "",
      to: "",
      source: "",
      author: "",
    });
  };

  if (isLoading)
    return (
      <div className="flex justify-center items-center">
        <div className="loading-spinner"></div>
      </div>
    );
  if (error)
    return <p className="text-center text-red-600">Error loading news</p>;

  return (
    <div className="p-6 max-w-7xl mx-auto bg-gray-50">
      <h1 className="text-4xl font-extrabold text-center text-gray-800 mb-6">
        NewsPulse
      </h1>
      <FilterCard title="Personalized News Timeline Filters" gap={"gap-8"}>
        {selectFields.map((field) => (
          <FilterInput
            key={field.name}
            type="select"
            name={field.name}
            value={filters[field.name as keyof typeof filters]}
            onChange={handleChange}
            options={field.options}
          />
        ))}
        {data?.uniqueCategories && (
          <FilterInput
            key={data.uniqueCategories.join(",")}
            type="select"
            name="category"
            value={filters.category}
            onChange={handleChange}
            options={[
              { value: "", label: "All Categories" },
              ...(data.uniqueCategories as string[]).map((a: string) => ({
                value: a,
                label: a,
              })),
            ]}
          />
        )}
        {data?.uniqueAuthors && (
          <FilterInput
            key={data.uniqueAuthors.join(",")}
            type="select"
            name="author"
            value={filters.author}
            onChange={handleChange}
            options={[
              { value: "", label: "All Authors" },
              ...(data.uniqueAuthors as string[]).map((a: string) => ({
                value: a,
                label: a,
              })),
            ]}
          />
        )}

        <Button label="Save" onClick={handleSavePreferences} color="green" />
        <Button label="Remove" onClick={handleRemovePreferences} color="red" />
      </FilterCard>

      <FilterCard title="Filters" gap={"gap-3"}>
        {filterFields.map((field) => (
          <FilterInput
            key={field.name}
            type={field.type as "text" | "date"}
            name={field.name}
            value={filters[field.name as keyof typeof filters]}
            onChange={handleChange}
            placeholder={field.placeholder}
          />
        ))}
        {data?.uniqueCategories && (
          <FilterInput
            key={data.uniqueCategories.join(",")}
            type="select"
            name="category"
            value={filters.category}
            onChange={handleChange}
            options={[
              { value: "", label: "All Categories" },
              ...(data.uniqueCategories as string[]).map((a: string) => ({
                value: a,
                label: a,
              })),
            ]}
          />
        )}
        {selectFields.slice(0, 2).map((field) => (
          <FilterInput
            key={field.name}
            type="select"
            name={field.name}
            value={filters[field.name as keyof typeof filters]}
            onChange={handleChange}
            options={field.options}
          />
        ))}
        <Button
          label="Clear Filters"
          onClick={handleClearFilters}
          color="red"
        />
      </FilterCard>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data?.articles.map((article: NewsArticle, index: number) => (
          <NewsCard key={index} article={article} />
        ))}
      </div>
    </div>
  );
};

const NewsFeedWrapper = () => (
  <Suspense fallback={<p className="text-center text-lg">Loading News...</p>}>
    <NewsFeed />
  </Suspense>
);

export default NewsFeedWrapper;
