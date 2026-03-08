"use client";

import { JikanAnimeCharacter, JikanAnimeStaff } from "@/api/jikan";
import SectionTitle from "@/components/ui/other/SectionTitle";
import Carousel from "@/components/ui/wrapper/Carousel";
import { Tab, Tabs, User } from "@heroui/react";

interface AnimeCastsSectionProps {
  characters: JikanAnimeCharacter[];
  staff: JikanAnimeStaff[];
  isSeries?: boolean;
}

const AnimeCastsSection: React.FC<AnimeCastsSectionProps> = ({
  characters,
  staff,
  isSeries = true,
}) => {
  const topCharacters = characters.slice(0, 20);
  const topStaff = staff.slice(0, 20);

  if (topCharacters.length === 0 && topStaff.length === 0) {
    return null;
  }

  return (
    <section id="casts" className="z-3 flex flex-col gap-2">
      <SectionTitle color={isSeries ? "warning" : undefined}>Cast & Staff</SectionTitle>
      <Tabs
        aria-label="Anime cast and staff"
        variant="underlined"
        classNames={{
          cursor: isSeries ? "bg-warning h-1 rounded-full" : "bg-primary h-1 rounded-full",
        }}
      >
        {topCharacters.length > 0 && (
          <Tab key="characters" title="Characters">
            <Carousel classNames={{ container: "gap-5" }}>
              {topCharacters.map((cast) => {
                const avatar =
                  cast.character.images?.jpg?.image_url || cast.character.images?.webp?.image_url;
                const jpVoice = cast.voice_actors.find((voice) => voice.language === "Japanese");

                return (
                  <div
                    key={cast.character.mal_id}
                    className="flex max-w-fit items-center px-1 py-2"
                  >
                    <User
                      name={cast.character.name}
                      description={
                        jpVoice ? `${cast.role} • CV: ${jpVoice.person.name}` : cast.role
                      }
                      avatarProps={{
                        src: avatar,
                        size: "lg",
                        showFallback: true,
                        isBordered: true,
                      }}
                    />
                  </div>
                );
              })}
            </Carousel>
          </Tab>
        )}
        {topStaff.length > 0 && (
          <Tab key="staff" title="Staff">
            <Carousel classNames={{ container: "gap-5" }}>
              {topStaff.map((member) => {
                const avatar =
                  member.person.images?.jpg?.image_url || member.person.images?.webp?.image_url;

                return (
                  <div key={member.person.mal_id} className="flex max-w-fit items-center px-1 py-2">
                    <User
                      name={member.person.name}
                      description={member.positions.join(", ") || "Staff"}
                      avatarProps={{
                        src: avatar,
                        size: "lg",
                        showFallback: true,
                        isBordered: true,
                      }}
                    />
                  </div>
                );
              })}
            </Carousel>
          </Tab>
        )}
      </Tabs>
    </section>
  );
};

export default AnimeCastsSection;
