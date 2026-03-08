import { SpacingClasses } from "@/utils/constants";
import { siteConfig } from "@/config/site";
import useBreakpoints from "@/hooks/useBreakpoints";
import { cn } from "@/utils/helpers";
import { getAnimePlayers } from "@/utils/players";
import { Card, Skeleton } from "@heroui/react";
import { useDisclosure, useDocumentTitle, useIdle } from "@mantine/hooks";
import dynamic from "next/dynamic";
import { parseAsInteger, parseAsStringEnum, useQueryState } from "nuqs";
import { useMemo } from "react";
import { usePlayerEvents } from "@/hooks/usePlayerEvents";
import { AnimeData } from "../AnimeList";

const AnimePlayerHeader = dynamic(() => import("./Header"));
const AnimePlayerSourceSelection = dynamic(() => import("./SourceSelection"));

interface AnimePlayerProps {
  anime: AnimeData;
  anilistId: string | number;
  episode: string | number;
}

const AnimePlayer: React.FC<AnimePlayerProps> = ({ anime, anilistId, episode }) => {
  const idle = useIdle(3000);
  const { mobile } = useBreakpoints();
  const [opened, handlers] = useDisclosure(false);
  const [selectedSource, setSelectedSource] = useQueryState<number>(
    "src",
    parseAsInteger.withDefault(0)
  );

  const [type, setType] = useQueryState<"sub" | "dub">(
    "type",
    parseAsStringEnum(["sub", "dub"]).withDefault("sub")
  );

  const players = getAnimePlayers(anilistId, episode, type);
  const title = anime.title || "Anime";

  // usePlayerEvents({ saveHistory: true });
  useDocumentTitle(`Play ${title} EP ${episode} | ${siteConfig.name}`);

  const PLAYER = useMemo(() => players[selectedSource] || players[0], [players, selectedSource]);

  return (
    <>
      <div className={cn("relative", SpacingClasses.reset)}>
        <AnimePlayerHeader
          id={anime.mal_id}
          animeName={title}
          episode={episode}
          onOpenSource={handlers.open}
          hidden={idle && !mobile}
          type={type}
          onTypeChange={setType}
        />
        <Card shadow="md" radius="none" className="relative h-screen">
          <Skeleton className="absolute h-full w-full" />
          <iframe
            allowFullScreen
            key={`${PLAYER.title}-${type}`}
            src={PLAYER.source}
            className={cn("z-10 h-full", { "pointer-events-none": idle && !mobile })}
          />
        </Card>
      </div>

      <AnimePlayerSourceSelection
        opened={opened}
        onClose={handlers.close}
        players={players}
        selectedSource={selectedSource}
        setSelectedSource={setSelectedSource}
      />
    </>
  );
};

export default AnimePlayer;
