// Jikan API Service
const BASE_URL = "https://api.jikan.moe/v4";

export interface PaginationInfo {
  last_visible_page: number;
  has_next_page: boolean;
  current_page: number;
  items: {
    count: number;
    total: number;
    per_page: number;
  };
}

export const jikan = {
  topAnime: async (page = 1) => {
    const res = await fetch(`${BASE_URL}/top/anime?page=${page}`);
    if (!res.ok) throw new Error("Failed to fetch top anime");
    return res.json();
  },
  upcomingAnime: async (page = 1) => {
    const res = await fetch(`${BASE_URL}/seasons/upcoming?page=${page}`);
    if (!res.ok) throw new Error("Failed to fetch upcoming anime");
    return res.json();
  },
  searchAnime: async (query: string, page = 1) => {
    const res = await fetch(`${BASE_URL}/anime?q=${encodeURIComponent(query)}&page=${page}`);
    if (!res.ok) throw new Error("Failed to search anime");
    return res.json();
  },
  getAnimeGenres: async () => {
    const res = await fetch(`${BASE_URL}/genres/anime`);
    if (!res.ok) throw new Error("Failed to fetch anime genres");
    return res.json();
  },
  discoverAnime: async (page = 1, genres = "", type = "", status = "", orderBy = "") => {
    let url = `${BASE_URL}/anime?page=${page}`;
    if (genres) url += `&genres=${genres}`;

    // Validate Jikan types
    const validTypes = ["tv", "movie", "ova", "special", "ona", "music"];
    if (type && validTypes.includes(type.toLowerCase())) {
      url += `&type=${type.toLowerCase()}`;
    }

    if (status) {
      url += `&status=${status}`;
    }

    if (orderBy && orderBy !== "popularity.desc") {
      url += `&order_by=${orderBy}&sort=desc`;
    }

    const res = await fetch(url);
    if (!res.ok) throw new Error("Failed to discover anime");
    return res.json();
  },
  getAnimeDetails: async (id: number | string) => {
    const res = await fetch(`${BASE_URL}/anime/${id}/full`);
    if (!res.ok) throw new Error("Failed to fetch anime details");
    return res.json();
  },
  getAnimeEpisodes: async (id: number | string, page = 1) => {
    const res = await fetch(`${BASE_URL}/anime/${id}/episodes?page=${page}`);
    if (!res.ok) throw new Error("Failed to fetch anime episodes");
    return res.json();
  },
  getAnimeCharacters: async (id: number | string) => {
    const res = await fetch(`${BASE_URL}/anime/${id}/characters`);
    if (!res.ok) throw new Error("Failed to fetch anime characters");
    return res.json();
  },
  getAnimePictures: async (id: number | string) => {
    const res = await fetch(`${BASE_URL}/anime/${id}/pictures`);
    if (!res.ok) throw new Error("Failed to fetch anime pictures");
    return res.json();
  },
  getAnimeRecommendations: async (id: number | string) => {
    const res = await fetch(`${BASE_URL}/anime/${id}/recommendations`);
    if (!res.ok) throw new Error("Failed to fetch anime recommendations");
    return res.json();
  },
};
