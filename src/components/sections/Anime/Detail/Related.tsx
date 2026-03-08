"use client";

import { JikanAnimeRelationEntry, JikanAnimeRelationGroup, JikanAnimeSummary } from "@/api/jikan";
import SectionTitle from "@/components/ui/other/SectionTitle";
import { Card, CardBody, CardHeader, Chip, Image, Tab, Tabs } from "@heroui/react";
import Link from "next/link";

interface AnimeRelatedSectionProps {
  relations: JikanAnimeRelationGroup[];
  recommendations: { entry: JikanAnimeSummary; votes: number; url: string }[];
  isSeries?: boolean;
}

const renderRelationCards = (entries: JikanAnimeRelationEntry[]) => {
  const animeEntries = entries.filter((entry) => entry.type === "anime");

  if (animeEntries.length === 0) {
    return <p className="text-default-500 text-sm">No related anime found.</p>;
  }

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {animeEntries.map((entry) => (
        <Card
          key={entry.mal_id}
          as={Link}
          href={`/anime/${entry.mal_id}`}
          isPressable
          className="bg-secondary-background"
        >
          <CardHeader className="pb-0">
            <Chip size="sm" variant="flat" color="secondary">
              {entry.type}
            </Chip>
          </CardHeader>
          <CardBody>
            <p className="line-clamp-2 text-sm font-semibold">{entry.name}</p>
          </CardBody>
        </Card>
      ))}
    </div>
  );
};

const AnimeRelatedSection: React.FC<AnimeRelatedSectionProps> = ({
  relations,
  recommendations,
  isSeries = true,
}) => {
  const animeRelations = relations
    .map((group) => ({
      relation: group.relation,
      entry: group.entry.filter((entry) => entry.type === "anime"),
    }))
    .filter((group) => group.entry.length > 0);

  if (animeRelations.length === 0 && recommendations.length === 0) {
    return null;
  }

  return (
    <section id="related" className="z-3">
      <SectionTitle
        color={isSeries ? "warning" : undefined}
        className="mb-2 sm:mb-0 sm:translate-y-10"
      >
        Related Anime
      </SectionTitle>
      <Tabs
        aria-label="Related anime section"
        variant="underlined"
        className="sm:w-full sm:justify-end"
        classNames={{
          cursor: isSeries ? "bg-warning h-1 rounded-full" : "bg-primary h-1 rounded-full",
        }}
      >
        {animeRelations.map((group) => (
          <Tab key={group.relation} title={group.relation}>
            {renderRelationCards(group.entry)}
          </Tab>
        ))}
        {recommendations.length > 0 && (
          <Tab key="recommendations" title="Recommendations">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {recommendations.slice(0, 12).map((item) => {
                const anime = item.entry;
                const poster = anime.images?.jpg?.large_image_url || anime.images?.jpg?.image_url;

                return (
                  <Card
                    key={anime.mal_id}
                    as={Link}
                    href={`/anime/${anime.mal_id}`}
                    isPressable
                    className="bg-secondary-background"
                  >
                    <CardBody className="gap-3">
                      <div className="flex gap-3">
                        <Image
                          alt={anime.title}
                          src={poster}
                          className="h-24 w-16 rounded-md object-cover"
                        />
                        <div className="flex min-w-0 flex-1 flex-col justify-between">
                          <p className="line-clamp-2 text-sm font-semibold">{anime.title}</p>
                          <p className="text-default-500 text-xs">{item.votes} votes</p>
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                );
              })}
            </div>
          </Tab>
        )}
      </Tabs>
    </section>
  );
};

export default AnimeRelatedSection;
