"use client";

import { Image } from "@heroui/image";
import { useWindowScroll } from "@mantine/hooks";

const BackdropSection: React.FC<{ anime: any }> = ({ anime }) => {
  const [{ y }] = useWindowScroll();
  const opacity = Math.min((y / 1000) * 2, 1);
  const backdropImage = anime.images?.jpg?.large_image_url || anime.images?.jpg?.image_url;

  return (
    <section id="backdrop" className="fixed inset-0 h-[35vh] md:h-[50vh] lg:h-[70vh]">
      <div className="absolute inset-0 z-10 bg-background" style={{ opacity: opacity }} />
      <div className="absolute inset-0 z-2 bg-linear-to-b from-background from-1% via-transparent via-30%" />
      <div className="absolute inset-0 z-2 translate-y-px bg-linear-to-t from-background from-1% via-transparent via-55%" />

      <Image
        radius="none"
        alt={anime.title}
        className="z-0 h-[35vh] w-screen object-cover object-center md:h-[50vh] lg:h-[70vh] opacity-30"
        src={backdropImage}
      />
    </section>
  );
};

export default BackdropSection;
