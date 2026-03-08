"use client";

import BackButton from "@/components/ui/button/BackButton";
import { siteConfig } from "@/config/site";
import { useSearchModal } from "@/hooks/useSearchModal";
import { cn } from "@/utils/helpers";
import { Search } from "@/utils/icons";
import { Navbar, NavbarBrand, NavbarContent, NavbarItem } from "@heroui/react";
import { useHotkeys, useWindowScroll } from "@mantine/hooks";
import { usePathname } from "next/navigation";
import FullscreenToggleButton from "../button/FullscreenToggleButton";
import SearchInput from "../input/SearchInput";
import ThemeSwitchDropdown from "../input/ThemeSwitchDropdown";
import BrandLogo from "../other/BrandLogo";

const TopNavbar = () => {
  const pathName = usePathname();
  const [{ y }] = useWindowScroll();
  const overlayOpacity = Math.min(Math.max((y / 800) * 4, 0.35), 1);
  const hrefs = siteConfig.navItems.map((item) => item.href);
  const show = hrefs.includes(pathName);
  const tv = pathName.includes("/tv/");
  const player = pathName.includes("/player") || pathName.includes("/stream/");
  const auth = pathName.includes("/auth");
  const { open: openSearch } = useSearchModal();

  useHotkeys([["ctrl+K", openSearch, { preventDefault: true }]]);

  if (auth || player) return null;

  return (
    <Navbar
      disableScrollHandler
      isBlurred={false}
      position="sticky"
      maxWidth="full"
      classNames={{ wrapper: "px-2 md:px-4" }}
      className={cn("inset-0 z-50 h-min bg-transparent", {
        "bg-background/80 border-b border-white/5 backdrop-blur-md": show,
      })}
    >
      {!show && (
        <div
          className="bg-background/80 pointer-events-none absolute inset-0 h-full w-full border-b border-white/5 backdrop-blur-md"
          aria-hidden="true"
          style={{ opacity: overlayOpacity }}
        />
      )}
      <NavbarBrand className="md:hidden">
        {show ? <BrandLogo /> : <BackButton href={tv ? "/?content=tv" : "/"} />}
      </NavbarBrand>
      {/* Desktop: brand or back button on left */}
      <NavbarBrand className="hidden shrink-0 md:flex">
        {show ? <BrandLogo /> : <BackButton href={tv ? "/?content=tv" : "/"} />}
      </NavbarBrand>
      <NavbarContent
        className="hidden w-full max-w-[400px] gap-2 md:flex lg:max-w-lg"
        justify="center"
      >
        <NavbarItem className="w-full">
          <button
            onClick={openSearch}
            className="w-full cursor-pointer"
            aria-label="Open Search"
            type="button"
          >
            <SearchInput
              className="pointer-events-none"
              placeholder="Search movies & TV shows..."
              endContent={
                <kbd className="bg-default-100 text-default-500 hidden rounded px-1.5 py-0.5 text-xs md:inline-flex">
                  CTRL+K
                </kbd>
              }
            />
          </button>
        </NavbarItem>
      </NavbarContent>
      <NavbarContent justify="end">
        <NavbarItem className="flex items-center gap-1">
          <ThemeSwitchDropdown />
          <FullscreenToggleButton />
          <button
            onClick={openSearch}
            className={cn(
              "text-foreground rounded-full p-2 transition-colors md:hidden",
              show
                ? "hover:bg-white/10"
                : "bg-background/70 hover:bg-background/80 border border-white/10 backdrop-blur-md",
            )}
            aria-label="Open Search"
            type="button"
          >
            <Search size={22} />
          </button>
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
};

export default TopNavbar;
