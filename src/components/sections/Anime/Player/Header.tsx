import { cn } from "@/utils/helpers";
import { ArrowLeft, Server } from "@/utils/icons";
import ActionButton from "@/components/sections/Movie/Player/ActionButton"; // Reusing Movie action button
import { Tab, Tabs } from "@heroui/react";

interface AnimePlayerHeaderProps {
  id: string | number;
  animeName: string;
  episode: string | number;
  hidden?: boolean;
  onOpenSource: () => void;
  type: "sub" | "dub";
  onTypeChange: (type: "sub" | "dub") => void;
}

const AnimePlayerHeader: React.FC<AnimePlayerHeaderProps> = ({
  id,
  animeName,
  episode,
  hidden,
  onOpenSource,
  type,
  onTypeChange,
}) => {
  return (
    <div
      aria-hidden={hidden ? true : undefined}
      className={cn(
        "absolute top-0 z-40 flex h-28 w-full items-start justify-between gap-4",
        "bg-linear-to-b from-black/80 to-transparent p-2 text-white transition-opacity md:p-4",
        { "opacity-0": hidden }
      )}
    >
      <ActionButton label="Back" href={`/anime/${id}`}>
        <ArrowLeft size={42} />
      </ActionButton>
      <div className="absolute left-1/2 hidden -translate-x-1/2 flex-col justify-center text-center sm:flex gap-2">
        <p className="text-sm text-white text-shadow-lg sm:text-lg lg:text-xl">
          {animeName} - <span className="opacity-80 text-base">Episode {episode}</span>
        </p>
        <div className="flex justify-center">
          <Tabs
            size="sm"
            color="primary"
            variant="solid"
            selectedKey={type}
            onSelectionChange={(key) => onTypeChange(key as "sub" | "dub")}
            classNames={{ tabList: "bg-white/10 backdrop-blur-md" }}
          >
            <Tab key="sub" title="Subtitled" />
            <Tab key="dub" title="Dubbed" />
          </Tabs>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <ActionButton label="Sources" tooltip="Servers" onClick={onOpenSource}>
          <Server size={34} />
        </ActionButton>
      </div>
    </div>
  );
};

export default AnimePlayerHeader;
