"use client";

import { Suspense, use } from "react";
import { Spinner } from "@heroui/spinner";
import { useQuery } from "@tanstack/react-query";
import { notFound } from "next/navigation";
import dynamic from "next/dynamic";
import { Params } from "@/types";
import { NextPage } from "next";
import { jikan } from "@/api/jikan";

const BackdropSection = dynamic(() => import("@/components/sections/Anime/Detail/Backdrop"));
const OverviewSection = dynamic(() => import("@/components/sections/Anime/Detail/Overview"));
const EpisodesSection = dynamic(() => import("@/components/sections/Anime/Detail/Episodes"));

const AnimeDetailPage: NextPage<Params<{ id: string }>> = ({ params }) => {
  const { id } = use(params);

  const {
    data: anime,
    isPending,
    error,
  } = useQuery({
    queryFn: async () => {
      const response = await jikan.getAnimeDetails(id);
      return response.data;
    },
    queryKey: ["anime-detail", id],
  });

  if (isPending) {
    return <Spinner size="lg" className="absolute-center" variant="simple" />;
  }

  if (error || !anime) notFound();

  return (
    <div className="mx-auto max-w-5xl">
      <Suspense fallback={<Spinner size="lg" className="absolute-center" variant="simple" />}>
        <div className="flex flex-col gap-10">
          <BackdropSection anime={anime} />
          <OverviewSection anime={anime} />
          <EpisodesSection animeId={id} />
        </div>
      </Suspense>
    </div>
  );
};

export default AnimeDetailPage;
