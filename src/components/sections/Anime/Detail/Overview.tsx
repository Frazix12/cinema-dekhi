"use client";

import { Image, Chip, Button } from "@heroui/react";
import { useDocumentTitle } from "@mantine/hooks";
import { siteConfig } from "@/config/site";
import { FaCirclePlay } from "react-icons/fa6";
import SectionTitle from "@/components/ui/other/SectionTitle";
import { Calendar, Clock } from "@/utils/icons";
import Link from "next/link";
import Rating from "@/components/ui/other/Rating";

interface OverviewSectionProps {
  anime: any;
}

const OverviewSection: React.FC<OverviewSectionProps> = ({ anime }) => {
  const title = anime.title;
  const posterImage = anime.images?.jpg?.large_image_url || anime.images?.jpg?.image_url;
  const rating = anime.rating || "";
  const isAdult = rating.includes("R+") || rating.includes("Rx");

  useDocumentTitle(`${title} | ${siteConfig.name}`);

  return (
    <section id="overview" className="relative z-3 flex flex-col gap-8 pt-[20vh] md:pt-[40vh]">
      <div className="md:grid md:grid-cols-[auto_1fr] md:gap-6">
        <Image
          isBlurred
          shadow="md"
          alt={title}
          classNames={{
            wrapper: "w-52 max-h-min aspect-2/3 hidden md:block",
          }}
          className="object-cover object-center"
          src={posterImage}
        />

        <div className="flex flex-col gap-8">
          <div id="title" className="flex flex-col gap-1 md:gap-2">
            <div className="flex gap-3">
              <Chip
                color="primary"
                variant="faded"
                className="md:text-md text-xs"
                classNames={{ content: "font-bold" }}
              >
                Anime
              </Chip>
              {isAdult && (
                <Chip color="danger" variant="faded">
                  18+
                </Chip>
              )}
              {anime.status && (
                <Chip color="secondary" variant="dot">
                  {anime.status}
                </Chip>
              )}
            </div>
            <h2 className="text-2xl font-black md:text-4xl">{title}</h2>
            <div className="md:text-md flex flex-wrap gap-1 text-xs md:gap-2">
              <div className="flex items-center gap-1">
                <Clock />
                <span>{anime.duration || "N/A"}</span>
              </div>
              <p>&#8226;</p>
              <div className="flex items-center gap-1">
                <Calendar />
                <span>{anime.year || anime.aired?.prop?.from?.year || "Unknown"}</span>
              </div>
              <p>&#8226;</p>
              <Rating rate={anime.score || 0} />
            </div>

            <div className="flex flex-wrap gap-2 mt-2">
              {anime.genres?.map((g: any) => (
                <Chip key={g.mal_id} size="sm" variant="flat">
                  {g.name}
                </Chip>
              ))}
            </div>
          </div>

          <div id="action" className="flex w-full flex-wrap justify-between gap-4 md:gap-0">
            <div className="flex flex-wrap gap-2">
              <Button
                as={Link}
                href={`/stream/anime/${anime.mal_id}/1`}
                color="primary"
                variant="shadow"
                startContent={<FaCirclePlay size={22} />}
              >
                Play Episode 1
              </Button>
            </div>
          </div>

          <div id="story" className="flex flex-col gap-2">
            <SectionTitle>Story Line</SectionTitle>
            <p className="text-sm">{anime.synopsis || "No synopsis available."}</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OverviewSection;
