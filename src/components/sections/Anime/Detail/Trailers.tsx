"use client";

import { JikanAnimeDetail, JikanAnimeVideos } from "@/api/jikan";
import SectionTitle from "@/components/ui/other/SectionTitle";
import { Card, CardBody, Link } from "@heroui/react";

interface AnimeTrailerSectionProps {
  anime: JikanAnimeDetail;
  videos?: JikanAnimeVideos;
  isSeries?: boolean;
}

const AnimeTrailerSection: React.FC<AnimeTrailerSectionProps> = ({
  anime,
  videos,
  isSeries = true,
}) => {
  const promo = videos?.promo?.find((item) => item.trailer.embed_url || item.trailer.youtube_id);
  const embedUrl =
    promo?.trailer.embed_url ||
    (promo?.trailer.youtube_id
      ? `https://www.youtube-nocookie.com/embed/${promo.trailer.youtube_id}`
      : anime.trailer?.embed_url);
  const youtubeUrl =
    promo?.trailer.url ||
    (promo?.trailer.youtube_id
      ? `https://www.youtube.com/watch?v=${promo.trailer.youtube_id}`
      : anime.trailer?.url || undefined);

  if (!embedUrl && !youtubeUrl) {
    return null;
  }

  return (
    <section id="trailer" className="z-3 flex flex-col gap-2">
      <SectionTitle color={isSeries ? "warning" : undefined}>Trailer</SectionTitle>
      <Card className="bg-secondary-background">
        <CardBody className="gap-3">
          {embedUrl && (
            <iframe
              className="rounded-large aspect-video w-full"
              src={embedUrl}
              title={`${anime.title} trailer`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
          )}
          {youtubeUrl && (
            <Link
              href={youtubeUrl}
              target="_blank"
              rel="noopener noreferrer"
              size="sm"
              color="foreground"
            >
              Watch on YouTube
            </Link>
          )}
        </CardBody>
      </Card>
    </section>
  );
};

export default AnimeTrailerSection;
