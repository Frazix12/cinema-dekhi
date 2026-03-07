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
import UserProfileButton from "../button/UserProfileButton";
import SearchInput from "../input/SearchInput";
import ThemeSwitchDropdown from "../input/ThemeSwitchDropdown";
import BrandLogo from "../other/BrandLogo";

const TopNavbar = () => {
  const pathName = usePathname();
  const [{ y }] = useWindowScroll();
  const opacity = Math.min((y / 800) * 4, 1);
  const hrefs = siteConfig.navItems.map((item) => item.href);
  const show = hrefs.includes(pathName);
  const tv = pathName.includes("/tv/");
  const player = pathName.includes("/player");
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
      className={cn("inset-0 h-min bg-transparent", {
        "bg-background border-b border-white/5": show,
      })}
    >
      {!show && (
        <div
          className="border-background bg-background absolute inset-0 h-full w-full border-b"
          style={{ opacity: opacity }}
        />
      )}
      <NavbarBrand className="md:hidden">
        {show ? <BrandLogo /> : <BackButton href={tv ? "/?content=tv" : "/"} />}
      </NavbarBrand>
      {/* Desktop: on inner pages, show back button */}
      {!show && (
        <NavbarBrand className="hidden md:flex">
          <BackButton href={tv ? "/?content=tv" : "/"} />
        </NavbarBrand>
      )}
      {show && (
        <NavbarContent className="hidden w-full max-w-lg gap-2 md:flex" justify="center">
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
      )}
      <NavbarContent justify="end">
        <NavbarItem className="flex gap-1">
          <ThemeSwitchDropdown />
          <FullscreenToggleButton />
          <UserProfileButton />
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
};

export default TopNavbar;
