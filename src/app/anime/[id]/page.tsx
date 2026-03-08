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
const CastsSection = dynamic(() => import("@/components/sections/Anime/Detail/Casts"));
const TrailersSection = dynamic(() => import("@/components/sections/Anime/Detail/Trailers"));
const RelatedSection = dynamic(() => import("@/components/sections/Anime/Detail/Related"));

const AnimeDetailPage: NextPage<Params<{ id: string }>> = ({ params }) => {
  const { id } = use(params);

  const { data, isPending, error } = useQuery({
    queryFn: async () => {
      const detailResponse = await jikan.getAnimeDetails(id);
      const anime = detailResponse.data;

      const [characters, staff, videos, relations, recommendations] = await Promise.allSettled([
        jikan.getAnimeCharacters(id),
        jikan.getAnimeStaff(id),
        jikan.getAnimeVideos(id),
        jikan.getAnimeRelations(id),
        jikan.getAnimeRecommendations(id),
      ]);

      return {
        anime,
        characters: characters.status === "fulfilled" ? characters.value.data : [],
        staff: staff.status === "fulfilled" ? staff.value.data : [],
        videos: videos.status === "fulfilled" ? videos.value.data : undefined,
        relations: relations.status === "fulfilled" ? relations.value.data : anime.relations || [],
        recommendations: recommendations.status === "fulfilled" ? recommendations.value.data : [],
      };
    },
    queryKey: ["anime-detail", id],
  });

  if (isPending) {
    return <Spinner size="lg" className="absolute-center" variant="simple" />;
  }

  if (error || !data?.anime) notFound();

  const isSeries = data.anime.type?.toLowerCase() !== "movie";

  return (
    <div className="mx-auto max-w-5xl">
      <Suspense fallback={<Spinner size="lg" className="absolute-center" variant="simple" />}>
        <div className="flex flex-col gap-10">
          <BackdropSection anime={data.anime} />
          <OverviewSection anime={data.anime} />
          <CastsSection characters={data.characters} staff={data.staff} isSeries={isSeries} />
          <TrailersSection anime={data.anime} videos={data.videos} isSeries={isSeries} />
          {isSeries && <EpisodesSection animeId={id} />}
          <RelatedSection
            relations={data.relations}
            recommendations={data.recommendations}
            isSeries={isSeries}
          />
        </div>
      </Suspense>
    </div>
  );
};

export default AnimeDetailPage;
