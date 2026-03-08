const BASE_URL = "https://api.jikan.moe/v4";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function fetchJikan<T>(path: string): Promise<T> {
  let retries = 0;

  while (retries < 3) {
    const res = await fetch(`${BASE_URL}${path}`);

    if (res.ok) {
      return res.json() as Promise<T>;
    }

    if (res.status === 429) {
      retries += 1;
      const retryAfter = Number(res.headers.get("Retry-After")) || 2;
      await sleep(retryAfter * 1000);
      continue;
    }

    throw new Error(`Jikan request failed: ${res.status} ${res.statusText}`);
  }

  throw new Error("Jikan rate limit reached. Please try again in a moment.");
}

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

export interface JikanImageVariants {
  image_url?: string;
  small_image_url?: string;
  large_image_url?: string;
}

export interface JikanAnimeImageSet {
  jpg?: JikanImageVariants;
  webp?: JikanImageVariants;
}

export interface JikanAnimeSummary {
  mal_id: number;
  url?: string;
  title: string;
  title_english?: string;
  title_japanese?: string;
  synopsis?: string;
  images: JikanAnimeImageSet;
  trailer?: {
    youtube_id?: string | null;
    url?: string | null;
    embed_url?: string | null;
  };
  type?: string;
  source?: string;
  episodes?: number | null;
  status?: string;
  rating?: string;
  score?: number | null;
  rank?: number | null;
  popularity?: number | null;
  members?: number | null;
  favorites?: number | null;
  duration?: string;
  season?: string;
  year?: number | null;
  aired?: {
    from?: string | null;
    to?: string | null;
    string?: string;
    prop?: {
      from?: { day?: number; month?: number; year?: number };
      to?: { day?: number; month?: number; year?: number };
    };
  };
  genres?: { mal_id: number; name: string }[];
  explicit_genres?: { mal_id: number; name: string }[];
  themes?: { mal_id: number; name: string }[];
  demographics?: { mal_id: number; name: string }[];
}

export interface JikanAnimeDetail extends JikanAnimeSummary {
  background?: string;
  broadcast?: {
    day?: string;
    time?: string;
    timezone?: string;
    string?: string;
  };
  studios?: { mal_id: number; name: string }[];
  producers?: { mal_id: number; name: string }[];
  licensors?: { mal_id: number; name: string }[];
  relations?: JikanAnimeRelationGroup[];
  streaming?: { name: string; url: string }[];
}

export interface JikanAnimeRelationEntry {
  mal_id: number;
  type: string;
  name: string;
  url: string;
}

export interface JikanAnimeRelationGroup {
  relation: string;
  entry: JikanAnimeRelationEntry[];
}

export interface JikanAnimeCharacter {
  character: {
    mal_id: number;
    url: string;
    name: string;
    images?: JikanAnimeImageSet;
  };
  role: string;
  favorites: number;
  voice_actors: {
    person: {
      mal_id: number;
      url: string;
      name: string;
      images?: JikanAnimeImageSet;
    };
    language: string;
  }[];
}

export interface JikanAnimeStaff {
  person: {
    mal_id: number;
    url: string;
    name: string;
    images?: JikanAnimeImageSet;
  };
  positions: string[];
}

export interface JikanAnimePromoVideo {
  title: string;
  trailer: {
    youtube_id?: string | null;
    url?: string | null;
    embed_url?: string | null;
    images?: {
      image_url?: string | null;
      medium_image_url?: string | null;
      large_image_url?: string | null;
      maximum_image_url?: string | null;
    };
  };
}

export interface JikanAnimeVideos {
  promo: JikanAnimePromoVideo[];
  episodes: {
    mal_id: number;
    title: string;
    episode: string;
    url: string;
    images?: JikanAnimeImageSet;
  }[];
  music_videos: {
    title: string;
    video: {
      youtube_id?: string | null;
      url?: string | null;
      embed_url?: string | null;
    };
  }[];
}

interface JikanListResponse<T> {
  data: T[];
  pagination: PaginationInfo;
}

interface JikanSingleResponse<T> {
  data: T;
}

export const jikan = {
  topAnime: async (page = 1, type = "", filter = "") => {
    const typeParam = type ? `&type=${type}` : "";
    const filterParam = filter ? `&filter=${filter}` : "";
    return fetchJikan<JikanListResponse<JikanAnimeSummary>>(
      `/top/anime?page=${page}${typeParam}${filterParam}`,
    );
  },
  currentSeasonAnime: async (page = 1) => {
    return fetchJikan<JikanListResponse<JikanAnimeSummary>>(`/seasons/now?page=${page}`);
  },
  upcomingAnime: async (page = 1) => {
    return fetchJikan<JikanListResponse<JikanAnimeSummary>>(`/seasons/upcoming?page=${page}`);
  },
  searchAnime: async (query: string, page = 1) => {
    return fetchJikan<JikanListResponse<JikanAnimeSummary>>(
      `/anime?q=${encodeURIComponent(query)}&page=${page}`,
    );
  },
  getAnimeGenres: async () => {
    return fetchJikan<{ data: { mal_id: number; name: string }[] }>("/genres/anime");
  },
  discoverAnime: async (page = 1, genres = "", type = "", status = "", orderBy = "") => {
    let url = `${BASE_URL}/anime?page=${page}`;
    if (genres) url += `&genres=${genres}`;

    const validTypes = ["tv", "movie", "ova", "special", "ona", "music", "cm", "pv", "tv_special"];
    if (type && validTypes.includes(type.toLowerCase())) {
      url += `&type=${type.toLowerCase()}`;
    }

    const validStatus = ["airing", "complete", "upcoming"];
    if (status && validStatus.includes(status)) {
      url += `&status=${status}`;
    }

    const normalizedOrderBy =
      orderBy === "popularity.desc"
        ? "popularity"
        : orderBy === "vote_average.desc"
          ? "score"
          : orderBy === "primary_release_date.desc"
            ? "start_date"
            : orderBy;

    const validOrderBy = [
      "mal_id",
      "title",
      "start_date",
      "end_date",
      "episodes",
      "score",
      "scored_by",
      "rank",
      "popularity",
      "members",
      "favorites",
    ];

    if (normalizedOrderBy && validOrderBy.includes(normalizedOrderBy)) {
      url += `&order_by=${normalizedOrderBy}&sort=desc`;
    }

    const path = url.replace(BASE_URL, "");
    return fetchJikan<JikanListResponse<JikanAnimeSummary>>(path);
  },
  getAnimeDetails: async (id: number | string) => {
    return fetchJikan<JikanSingleResponse<JikanAnimeDetail>>(`/anime/${id}/full`);
  },
  getAnimeEpisodes: async (id: number | string, page = 1) => {
    return fetchJikan<JikanListResponse<{ mal_id: number; title?: string; score?: number | null }>>(
      `/anime/${id}/episodes?page=${page}`,
    );
  },
  getAnimeCharacters: async (id: number | string) => {
    return fetchJikan<JikanSingleResponse<JikanAnimeCharacter[]>>(`/anime/${id}/characters`);
  },
  getAnimeStaff: async (id: number | string) => {
    return fetchJikan<JikanSingleResponse<JikanAnimeStaff[]>>(`/anime/${id}/staff`);
  },
  getAnimeRelations: async (id: number | string) => {
    return fetchJikan<JikanSingleResponse<JikanAnimeRelationGroup[]>>(`/anime/${id}/relations`);
  },
  getAnimePictures: async (id: number | string) => {
    return fetchJikan<JikanSingleResponse<JikanAnimeImageSet[]>>(`/anime/${id}/pictures`);
  },
  getAnimeVideos: async (id: number | string) => {
    return fetchJikan<JikanSingleResponse<JikanAnimeVideos>>(`/anime/${id}/videos`);
  },
  getAnimeRecommendations: async (id: number | string) => {
    return fetchJikan<
      JikanSingleResponse<{ entry: JikanAnimeSummary; votes: number; url: string }[]>
    >(`/anime/${id}/recommendations`);
  },
};
