"use client";

import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";

type Props = {
  placeholder?: string;
  value: string;
  onFilter: (query: string) => void;
};

export function ProductSearch({ placeholder = "Search medicines by name, composition...", value, onFilter }: Props) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilter(e.target.value);
  };

  const handleClear = () => {
    onFilter("");
  };

  return (
    <div className="relative">
      <div className="relative flex items-center">
        <Search className="absolute left-3 size-4 text-muted-foreground" />
        <Input
          type="text"
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          className="pl-9 transition-all focus:ring-2 ring-primary/20"
        />
        {value && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 p-1 hover:text-foreground text-muted-foreground transition-colors"
            aria-label="Clear search"
          >
            <X className="size-4" />
          </button>
        )}
      </div>
    </div>
  );
}
