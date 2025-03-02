import React from "react";
import { NewsArticle } from "../../types";

const NewsCard: React.FC<{ article: NewsArticle }> = ({ article }) => {
  return (
    <div className="bg-white p-5 rounded-lg shadow-lg border-1 border-gray-900 hover:shadow-2xl transition-transform transform hover:scale-105">
      <h3 className="text-xl font-semibold mb-2 text-gray-900">
        {article.title}
      </h3>
      <p className="text-gray-700 mb-2">{article.description}</p>
      <p className="text-sm font-semibold text-gray-600">
        Category: {article.category || "Unknown Category"}
      </p>
      <p className="text-sm font-semibold text-gray-600">
        Source: {article.author || "Unknown Author"}
      </p>
      <p className="text-sm font-semibold text-blue-600">
        Source: {article.source || "Unknown Source"}
      </p>
      <p className="text-sm text-gray-500">
        <i>{new Date(article.publishedAt).toDateString()}</i>
      </p>
      <a
        href={article.url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 font-semibold mt-2 inline-block hover:underline"
      >
        Read more →
      </a>
    </div>
  );
};

export default NewsCard;
