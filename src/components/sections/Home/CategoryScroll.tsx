"use client";

import { Button } from "@heroui/react";
import Link from "next/link";
import { useQueryState, parseAsStringLiteral } from "nuqs";

const MOVIE_CATEGORIES = [
  { id: 28, name: "Action" },
  { id: 12, name: "Adventure" },
  { id: 16, name: "Animation" },
  { id: 35, name: "Comedy" },
  { id: 80, name: "Crime" },
  { id: 99, name: "Documentary" },
  { id: 18, name: "Drama" },
  { id: 10751, name: "Family" },
  { id: 14, name: "Fantasy" },
  { id: 36, name: "History" },
  { id: 27, name: "Horror" },
  { id: 10402, name: "Music" },
  { id: 9648, name: "Mystery" },
  { id: 10749, name: "Romance" },
  { id: 878, name: "Sci-Fi" },
  { id: 10770, name: "TV Movie" },
  { id: 53, name: "Thriller" },
  { id: 10752, name: "War" },
  { id: 37, name: "Western" },
];

const TV_CATEGORIES = [
  { id: 10759, name: "Action & Adventure" },
  { id: 16, name: "Animation" },
  { id: 35, name: "Comedy" },
  { id: 80, name: "Crime" },
  { id: 99, name: "Documentary" },
  { id: 18, name: "Drama" },
  { id: 10751, name: "Family" },
  { id: 10762, name: "Kids" },
  { id: 9648, name: "Mystery" },
  { id: 10763, name: "News" },
  { id: 10764, name: "Reality" },
  { id: 10765, name: "Sci-Fi & Fantasy" },
  { id: 10766, name: "Soap" },
  { id: 10767, name: "Talk" },
  { id: 10768, name: "War & Politics" },
  { id: 37, name: "Western" },
];

const CategoryScroll = () => {
  const [content] = useQueryState(
    "content",
    parseAsStringLiteral(["movie", "tv"]).withDefault("movie")
  );

  const categories = content === "movie" ? MOVIE_CATEGORIES : TV_CATEGORIES;

  return (
    <div className="w-full overflow-x-auto no-scrollbar py-2 my-2 mask-linear">
      <div className="flex gap-2 px-1 w-max">
        {categories.map((cat) => (
          <Button
            key={cat.id}
            as={Link}
            href={`/discover?content=${content}&with_genres=${cat.id}`}
            variant="flat"
            size="sm"
            className="bg-white/5 hover:bg-white/10 text-white/70 hover:text-white backdrop-blur-md transition-all duration-300 rounded-full border border-white/5 hover:border-white/20"
          >
            {cat.name}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default CategoryScroll;
