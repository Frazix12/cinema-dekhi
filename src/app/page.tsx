import { NextPage } from "next";
import dynamic from "next/dynamic";
const HeroBanner = dynamic(() => import("@/components/sections/Home/HeroBanner"));
const CategoryScroll = dynamic(() => import("@/components/sections/Home/CategoryScroll"));
const ContinueWatching = dynamic(() => import("@/components/sections/Home/ContinueWatching"));
const HomePageList = dynamic(() => import("@/components/sections/Home/List"));

const HomePage: NextPage = () => {
  return (
    <div className="flex flex-col gap-3 md:gap-8">
      <HeroBanner />
      <CategoryScroll />
      <ContinueWatching />
      <HomePageList />
    </div>
  );
};

export default HomePage;
