"use client";

import { cn } from "@/utils/helpers";
import { Input, InputProps, Kbd, Spinner } from "@heroui/react";
import { FaSearch } from "react-icons/fa";

interface SearchInputProps extends InputProps {
  isLoading?: boolean;
}

const SearchInput: React.FC<SearchInputProps> = ({
  onChange,
  className,
  isLoading,
  placeholder = "Search...",
  ...props
}) => {
  return (
    <Input
      autoComplete="off"
      className={cn(className, "w-full")}
      placeholder={placeholder}
      radius="full"
      onChange={onChange}
      classNames={{
        inputWrapper: "bg-secondary-background",
        input: "text-sm",
      }}
      aria-label="Search"
      type="search"
      labelPlacement="outside"
      disabled={isLoading}
      endContent={!props.value && <Kbd className="hidden md:inline-block">CTRL+K</Kbd>}
      startContent={
        <div className="text-default-400 pointer-events-none flex shrink-0 items-center pr-1">
          {isLoading ? <Spinner color="default" size="sm" /> : <FaSearch />}
        </div>
      }
      {...props}
    />
  );
};

export default SearchInput;
