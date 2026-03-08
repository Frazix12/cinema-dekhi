import Rating from "@/components/ui/other/Rating";
import useBreakpoints from "@/hooks/useBreakpoints";
import { Card, CardBody, CardFooter, CardHeader, Chip, Image } from "@heroui/react";
import { Icon } from "@iconify/react";
import { useHover } from "@mantine/hooks";
import Link from "next/link";
import { AnimeData } from "../AnimeList";

interface AnimePosterCardProps {
  anime: AnimeData;
  variant?: "full" | "bordered";
}

const AnimePosterCard: React.FC<AnimePosterCardProps> = ({ anime, variant = "full" }) => {
  const { hovered, ref } = useHover();
  const releaseYear = anime.year || "N/A";
  const posterImage = anime.images?.jpg?.large_image_url || anime.images?.jpg?.image_url;
  const title = anime.title || "Unknown Title";
  const rating = anime.rating || "";

  // Show mature label if the rating indicates it
  const isAdult = rating.includes("R+") || rating.includes("Rx");

  return (
    <Link href={`/anime/${anime.mal_id}`} ref={ref}>
      {variant === "full" && (
        <div className="group motion-preset-focus relative aspect-2/3 overflow-hidden rounded-xl border border-white/5 bg-white/5 text-white transition-all duration-300 hover:scale-[1.02] hover:border-white/20 hover:shadow-2xl hover:shadow-black/50">
          {hovered && (
            <Icon
              icon="line-md:play-filled"
              width="64"
              height="64"
              className="absolute-center z-20 text-white"
            />
          )}
          {isAdult && (
            <Chip
              color="danger"
              size="sm"
              variant="flat"
              className="absolute left-2 top-2 z-20"
            >
              18+
            </Chip>
          )}
          <div className="absolute bottom-0 z-2 h-1/2 w-full bg-linear-to-t from-black from-1%"></div>
          <div className="absolute bottom-0 z-3 flex w-full flex-col gap-1 px-4 py-3">
            <h6 className="truncate text-sm font-semibold">{title}</h6>
            <div className="flex justify-between text-xs">
              <p>{releaseYear}</p>
              <Rating rate={anime.score} />
            </div>
          </div>
          <Image
            alt={title}
            src={posterImage}
            radius="none"
            className="z-0 aspect-2/3 h-[250px] object-cover object-center transition group-hover:scale-110 md:h-[300px]"
            classNames={{
              img: "group-hover:opacity-70",
            }}
          />
        </div>
      )}

      {variant === "bordered" && (
        <Card
          isHoverable
          fullWidth
          shadow="md"
          className="group h-full bg-secondary-background"
        >
          <CardHeader className="flex items-center justify-center pb-0">
            <div className="relative size-full">
              {hovered && (
                <Icon
                  icon="line-md:play-filled"
                  width="64"
                  height="64"
                  className="absolute-center z-20 text-white"
                />
              )}
              {isAdult && (
                <Chip
                  color="danger"
                  size="sm"
                  variant="shadow"
                  className="absolute left-2 top-2 z-20"
                >
                  18+
                </Chip>
              )}
              <div className="relative overflow-hidden rounded-large">
                <Image
                  isBlurred
                  alt={title}
                  className="aspect-2/3 rounded-lg object-cover object-center group-hover:scale-110"
                  src={posterImage}
                />
              </div>
            </div>
          </CardHeader>
          <CardBody className="justify-end pb-1">
            <p className="text-md truncate font-bold">{title}</p>
          </CardBody>
          <CardFooter className="justify-between pt-0 text-xs">
            <p>{releaseYear}</p>
            <Rating rate={anime.score} />
          </CardFooter>
        </Card>
      )}
    </Link>
  );
};

export default AnimePosterCard;
