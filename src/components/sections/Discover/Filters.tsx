import GenresSelect from "@/components/ui/input/GenresSelect";
import ContentTypeSelection from "@/components/ui/other/ContentTypeSelection";
import useDiscoverFilters from "@/hooks/useDiscoverFilters";
import { DiscoverMoviesFetchQueryType } from "@/types/movie";
import { Select, SelectItem, Button, Slider } from "@heroui/react";

const DiscoverFilters = () => {
  const { types, content, genres, queryType, sortBy, runtimeMin, runtimeMax,
    setQueryType, setGenres, setSortBy, setRuntimeMin, setRuntimeMax, resetFilters } =
    useDiscoverFilters();

  return (
    <div className="flex w-full flex-wrap justify-center gap-3">
      <ContentTypeSelection className="mb-5 justify-center" />
      <div className="flex w-full flex-wrap justify-center gap-3">
        <Select
          disallowEmptySelection
          selectionMode="single"
          size="sm"
          label="Type"
          placeholder="Select type"
          className="max-w-xs"
          selectedKeys={[queryType]}
          onChange={({ target }) => {
            setQueryType(target.value as DiscoverMoviesFetchQueryType);
            setGenres(null);
          }}
          value={queryType}
        >
          {types.map(({ name, key }) => {
            return <SelectItem key={key}>{name}</SelectItem>;
          })}
        </Select>
        <GenresSelect
          type={content}
          selectedKeys={genres}
          onGenreChange={(genres) => {
            setGenres(genres);
            setQueryType("discover");
          }}
        />
        {queryType === "discover" && content !== "anime" && (
          <Select
            size="sm"
            label="Sort By"
            placeholder="Select sorting"
            className="max-w-xs"
            selectedKeys={[sortBy]}
            onChange={({ target }) => setSortBy(target.value)}
          >
            <SelectItem key="popularity.desc">Most Popular</SelectItem>
            <SelectItem key="vote_average.desc">Top Rated</SelectItem>
            <SelectItem key="primary_release_date.desc">Release Date</SelectItem>
            <SelectItem key="revenue.desc">Revenue</SelectItem>
          </Select>
        )}
        {queryType === "discover" && content === "anime" && (
          <Select
            size="sm"
            label="Sort By"
            placeholder="Select sorting"
            className="max-w-xs"
            selectedKeys={[sortBy]}
            onChange={({ target }) => setSortBy(target.value)}
          >
            <SelectItem key="popularity">Most Popular</SelectItem>
            <SelectItem key="score">Top Rated</SelectItem>
            <SelectItem key="episodes">Most Episodes</SelectItem>
            <SelectItem key="start_date">Release Date</SelectItem>
          </Select>
        )}
      </div>

      {queryType === "discover" && content !== "anime" && (
        <div className="w-full max-w-sm px-4 py-2">
          <Slider
            label="Duration (minutes)"
            step={10}
            minValue={0}
            maxValue={400}
            defaultValue={[runtimeMin, runtimeMax]}
            onChangeEnd={(val) => {
              if (Array.isArray(val)) {
                setRuntimeMin(val[0]);
                setRuntimeMax(val[1]);
              }
            }}
            className="w-full"
            size="sm"
          />
        </div>
      )}

      <Button size="sm" onPress={resetFilters}>
        Reset Filters
      </Button>
    </div>
  );
};

export default DiscoverFilters;
