"use client";

import { use } from "react";
import { useQuery } from "@tanstack/react-query";
import { notFound } from "next/navigation";
import { jikan } from "@/api/jikan";
import { getAnilistId } from "@/api/anilist";
import { Spinner } from "@heroui/react";
import { Params } from "@/types";
import { NextPage } from "next";
import AnimePlayer from "@/components/sections/Anime/Player/Player";

const AnimePlayerPage: NextPage<Params<{ id: string; episode: string }>> = ({ params }) => {
  const { id, episode } = use(params);

  const {
    data: anime,
    isPending: isPendingAnime,
    error: animeError,
  } = useQuery({
    queryFn: async () => {
      const response = await jikan.getAnimeDetails(id);
      return response.data;
    },
    queryKey: ["anime-detail", id],
  });

  const {
    data: anilistId,
    isPending: isPendingAnilist,
    error: anilistError,
  } = useQuery({
    queryFn: () => getAnilistId(id),
    queryKey: ["anilist-id", id],
  });

  if (isPendingAnime || isPendingAnilist) {
    return <Spinner size="lg" className="absolute-center" variant="simple" />;
  }

  // Fallback to the MAL ID if anilist ID fetching fails
  const resolvedAnilistId = anilistId || id;

  if (animeError || !anime) return notFound();

  return <AnimePlayer anime={anime} anilistId={resolvedAnilistId} episode={episode} />;
};

export default AnimePlayerPage;
