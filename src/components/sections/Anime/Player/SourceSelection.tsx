import { PlayersProps } from "@/types";
import { Chip } from "@heroui/react";
import { useDisclosure } from "@mantine/hooks";
import VaulDrawer from "@/components/ui/overlay/VaulDrawer";

interface AnimePlayerSourceSelectionProps {
  opened: boolean;
  onClose: () => void;
  players: PlayersProps[];
  selectedSource: number;
  setSelectedSource: (index: number) => void;
}

const AnimePlayerSourceSelection: React.FC<AnimePlayerSourceSelectionProps> = ({
  opened,
  onClose,
  players,
  selectedSource,
  setSelectedSource,
}) => {
  return (
    <VaulDrawer
      open={opened}
      onOpenChange={onClose}
      title="Select Server"
      snapPoints={["auto"]}
      activeSnapPoint="auto"
      onAnimationEnd={undefined}
      direction="bottom"
    >
      <div className="flex flex-col gap-4 p-4">
        {players.map((player, index) => (
          <button
            key={player.title}
            onClick={() => {
              setSelectedSource(index);
              onClose();
            }}
            className={`flex items-center justify-between rounded-xl p-4 transition ${selectedSource === index
                ? "bg-primary/20 text-primary"
                : "bg-secondary-background hover:bg-white/10"
              }`}
          >
            <div className="flex items-center gap-3">
              <span className="font-semibold">{player.title}</span>
              {player.recommended && (
                <Chip size="sm" color="success" variant="flat">
                  Recommended
                </Chip>
              )}
              {player.fast && (
                <Chip size="sm" color="warning" variant="flat">
                  Fast
                </Chip>
              )}
            </div>
            {selectedSource === index && <span>•</span>}
          </button>
        ))}
      </div>
    </VaulDrawer>
  );
};

export default AnimePlayerSourceSelection;
