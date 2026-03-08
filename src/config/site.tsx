import { tmdb } from "@/api/tmdb";
import { SiteConfigType } from "@/types";
import { GoHomeFill, GoHome, GoPerson, GoPersonFill } from "react-icons/go";
import { HiComputerDesktop } from "react-icons/hi2";
import { IoIosSunny } from "react-icons/io";
import {
  IoCompass,
  IoCompassOutline,
  IoInformationCircle,
  IoInformationCircleOutline,
  IoMoon,
  IoPlayCircle,
  IoPlayCircleOutline,
} from "react-icons/io5";
import { TbFolder, TbFolderFilled, TbApi } from "react-icons/tb";
import { FaServer as Server } from "react-icons/fa";
import { jikan } from "@/api/jikan";
import { filterPagedFeedResults } from "@/utils/movies";
import { TV } from "tmdb-ts/dist/types";

const withAnimeFilteredResults = async <T extends { results: any[] }>(
  query: () => Promise<T>,
): Promise<T> => {
  const response = await query();
  return filterPagedFeedResults(response);
};

const withAnimeFilteredTvResults = async <T extends { results: any[] }>(
  query: () => Promise<T>,
): Promise<T & { results: TV[] }> => {
  const response = filterPagedFeedResults(await query());

  return {
    ...response,
    results: response.results.map((tv) => ({ adult: false, ...tv })) as TV[],
  };
};

const mapJikanListResponse = <T extends unknown>(res: {
  pagination: {
    current_page: number;
    last_visible_page: number;
    items: { total: number };
  };
  data: T[];
}) => {
  return {
    page: res.pagination.current_page,
    results: res.data,
    total_pages: res.pagination.last_visible_page,
    total_results: res.pagination.items.total,
  };
};

export const siteConfig: SiteConfigType = {
  name: "Cinema Dekhi",
  description: "Stream movies and TV shows in style. Free, fast, and beautiful.",
  favicon: "/favicon.ico",
  navItems: [
    {
      label: "Home",
      href: "/",
      icon: <GoHome className="size-full" />,
      activeIcon: <GoHomeFill className="size-full" />,
    },
    {
      label: "Discover",
      href: "/discover",
      icon: <IoCompassOutline className="size-full" />,
      activeIcon: <IoCompass className="size-full" />,
    },
    {
      label: "Library",
      href: "/library",
      icon: <TbFolder className="size-full" />,
      activeIcon: <TbFolderFilled className="size-full" />,
    },
    {
      label: "Account",
      href: "/account",
      icon: <GoPerson className="size-full" />,
      activeIcon: <GoPersonFill className="size-full" />,
    },
    {
      label: "API Docs",
      href: "/api-docs",
      icon: <Server className="size-full" />,
      activeIcon: <Server className="size-full" />,
    },
  ],
  themes: [
    {
      name: "light",
      icon: <IoIosSunny className="size-full" />,
    },
    {
      name: "dark",
      icon: <IoMoon className="size-full" />,
    },
    {
      name: "system",
      icon: <HiComputerDesktop className="size-full" />,
    },
  ],
  queryLists: {
    movies: [
      {
        name: "Today's Trending Movies",
        query: () => withAnimeFilteredResults(() => tmdb.trending.trending("movie", "day")),
        param: "todayTrending",
      },
      {
        name: "This Week's Trending Movies",
        query: () => withAnimeFilteredResults(() => tmdb.trending.trending("movie", "week")),
        param: "thisWeekTrending",
      },
      {
        name: "Popular Movies",
        query: () => withAnimeFilteredResults(() => tmdb.movies.popular()),
        param: "popular",
      },
      {
        name: "Now Playing Movies",
        query: () => withAnimeFilteredResults(() => tmdb.movies.nowPlaying()),
        param: "nowPlaying",
      },
      {
        name: "Upcoming Movies",
        query: () => withAnimeFilteredResults(() => tmdb.movies.upcoming()),
        param: "upcoming",
      },
      {
        name: "Top Rated Movies",
        query: () => withAnimeFilteredResults(() => tmdb.movies.topRated()),
        param: "topRated",
      },
    ],
    tvShows: [
      {
        name: "Today's Trending TV Shows",
        query: () => withAnimeFilteredResults(() => tmdb.trending.trending("tv", "day")),
        param: "todayTrending",
      },
      {
        name: "This Week's Trending TV Shows",
        query: () => withAnimeFilteredResults(() => tmdb.trending.trending("tv", "week")),
        param: "thisWeekTrending",
      },
      {
        name: "Popular TV Shows",
        query: () => withAnimeFilteredTvResults(() => tmdb.tvShows.popular()),
        param: "popular",
      },
      {
        name: "On The Air TV Shows",
        query: () => withAnimeFilteredTvResults(() => tmdb.tvShows.onTheAir()),
        param: "onTheAir",
      },
      {
        name: "Top Rated TV Shows",
        query: () => withAnimeFilteredTvResults(() => tmdb.tvShows.topRated()),
        param: "topRated",
      },
    ],
    anime: [
      {
        name: "Top Anime",
        query: async () => mapJikanListResponse(await jikan.topAnime()),
        param: "topAnime",
      },
      {
        name: "This Season Anime",
        query: async () => mapJikanListResponse(await jikan.currentSeasonAnime()),
        param: "discover",
      },
      {
        name: "Most Popular Anime",
        query: async () => mapJikanListResponse(await jikan.topAnime(1, "tv", "bypopularity")),
        param: "discover",
      },
      {
        name: "TV Anime Series",
        query: async () =>
          mapJikanListResponse(await jikan.discoverAnime(1, "", "tv", "", "score")),
        param: "tv",
      },
      {
        name: "Anime Movies",
        query: async () =>
          mapJikanListResponse(await jikan.discoverAnime(1, "", "movie", "", "score")),
        param: "movie",
      },
      {
        name: "OVA Highlights",
        query: async () =>
          mapJikanListResponse(await jikan.discoverAnime(1, "", "ova", "", "score")),
        param: "ova",
      },
      {
        name: "Upcoming Anime",
        query: async () => mapJikanListResponse(await jikan.upcomingAnime()),
        param: "upcomingAnime",
      },
    ],
  },
  socials: {
    github: "https://github.com/wisnuwirayuda15/cinextma",
    // Updated for Dekho
  },
};

export type SiteConfig = typeof siteConfig;
