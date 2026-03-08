"use client";

import { useQuery } from "@tanstack/react-query";
import { jikan } from "@/api/jikan";
import { Spinner, Card, CardBody, Button } from "@heroui/react";
import SectionTitle from "@/components/ui/other/SectionTitle";
import Link from "next/link";
import { FaPlay } from "react-icons/fa6";

interface EpisodesSectionProps {
  animeId: string;
}

const EpisodesSection: React.FC<EpisodesSectionProps> = ({ animeId }) => {
  const { data, isPending, error } = useQuery({
    queryKey: ["anime-episodes", animeId],
    queryFn: async () => {
      const response = await jikan.getAnimeEpisodes(animeId);
      return response.data;
    },
  });

  if (isPending) {
    return (
      <section className="relative z-3 flex flex-col gap-4">
        <SectionTitle>Episodes</SectionTitle>
        <div className="flex justify-center py-10">
          <Spinner />
        </div>
      </section>
    );
  }

  if (error || !data || data.length === 0) {
    return (
      <section className="relative z-3 flex flex-col gap-4">
        <SectionTitle>Episodes</SectionTitle>
        <p className="text-sm text-default-500">No episodes found or data is unavailable.</p>
      </section>
    );
  }

  return (
    <section className="relative z-3 flex flex-col gap-4">
      <SectionTitle>Episodes</SectionTitle>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.map((ep: any) => (
          <Card key={ep.mal_id} isHoverable className="bg-secondary-background">
            <CardBody className="flex flex-row items-center justify-between gap-4 p-4">
              <div className="flex flex-col overflow-hidden">
                <p className="text-sm font-bold truncate">Episode {ep.mal_id}</p>
                <p className="text-xs text-default-500 truncate">{ep.title || "No Title"}</p>
              </div>
              <Button
                as={Link}
                href={`/stream/anime/${animeId}/${ep.mal_id}`}
                isIconOnly
                size="sm"
                color="primary"
                variant="flat"
              >
                <FaPlay size={12} />
              </Button>
            </CardBody>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default EpisodesSection;
