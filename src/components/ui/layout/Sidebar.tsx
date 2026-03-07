"use client";

import { siteConfig } from "@/config/site";
import { useSearchModal } from "@/hooks/useSearchModal";
import { cn } from "@/utils/helpers";
import { Search } from "@/utils/icons";
import { usePathname } from "next/navigation";
import Link from "next/link";
import BrandLogo from "../other/BrandLogo";

const Sidebar: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathName = usePathname();
  const hrefs = siteConfig.navItems.map((item) => item.href);
  const shouldShowSidebar = hrefs.includes(pathName);
  const { open: openSearch } = useSearchModal();

  return (
    <div className="flex h-full">
      {shouldShowSidebar && (
        <div className="hidden md:block">
          <div className="w-52" />
          <aside className="fixed left-0 top-0 h-screen w-52 border-r border-white/5">
            <div className="flex h-full flex-col bg-background/80 backdrop-blur-xl">
              {/* Brand */}
              <div className="flex h-16 items-center px-5">
                <BrandLogo />
              </div>

              {/* Nav Items */}
              <nav className="flex flex-1 flex-col gap-1 px-3 pt-4">
                {siteConfig.navItems.map((item) => {
                  const isActive = pathName === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                        "text-foreground/50 hover:text-foreground hover:bg-white/5",
                        {
                          "text-foreground bg-white/5 border-l-2 border-primary pl-[10px]": isActive,
                        }
                      )}
                    >
                      <span className="size-5 shrink-0">
                        {isActive ? item.activeIcon : item.icon}
                      </span>
                      <span>{item.label}</span>
                    </Link>
                  );
                })}

                {/* Search trigger */}
                <button
                  onClick={openSearch}
                  type="button"
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                    "text-foreground/50 hover:text-foreground hover:bg-white/5 w-full"
                  )}
                >
                  <span className="size-5 shrink-0">
                    <Search className="size-full" />
                  </span>
                  <span>Search</span>
                  <kbd className="bg-default-100 text-default-400 ml-auto rounded px-1 py-0.5 text-[10px]">
                    ⌃K
                  </kbd>
                </button>
              </nav>

              {/* Footer */}
              <div className="p-4 text-center text-xs text-foreground/20">
                © 2026 Cinema Dekhi
              </div>
            </div>
          </aside>
        </div>
      )}
      {children}
    </div>
  );
};

export default Sidebar;
