"use client";

import { useState } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";

type Props = {
  placeholder?: string;
  onFilter: (query: string) => void;
};

export function ProductSearch({ placeholder = "Search medicines by name, composition...", onFilter }: Props) {
  const [query, setQuery] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    onFilter(value.toLowerCase());
  };

  const handleClear = () => {
    setQuery("");
    onFilter("");
  };

  return (
    <div className="relative">
      <div className="relative flex items-center">
        <Search className="absolute left-3 size-4 text-muted-foreground" />
        <Input
          type="text"
          value={query}
          onChange={handleChange}
          placeholder={placeholder}
          className="pl-9 transition-all focus:ring-2 ring-primary/20"
        />
        {query && (
          <motion.button
            type="button"
            onClick={handleClear}
            className="absolute right-3 p-1 hover:text-foreground text-muted-foreground transition-colors"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
          >
            <X className="size-4" />
          </motion.button>
        )}
      </div>
    </div>
  );
}
