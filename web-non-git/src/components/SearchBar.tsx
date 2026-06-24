import React, { useState } from "react";
import type { SearchResult } from "leaflet-geosearch/lib/providers/provider.js";
import type { LatLngTuple } from "leaflet";
import type { LocalRawResult } from '@/providers/LocalAddressProvider';
import LocalAddressProvider from "@/providers/LocalAddressProvider";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface SearchBarProps {
  searchPosition: LatLngTuple | null;
  setSearchPosition: (search: LatLngTuple | null) => void;
}

export default function SearchBar({
  setSearchPosition,
  searchPosition,
}: SearchBarProps) {
  const [search, setSearch] = useState<string>("");
  const [searchResults, setSearchResults] =
    useState<SearchResult<LocalRawResult>[]>();

  const provider = new LocalAddressProvider(
    `${import.meta.env.VITE_HTTP_API_URL}/v2/maps/search`,
  );

  const handleSubmit = async (e: React.FormEvent, search: string) => {
    e.preventDefault();
    await fetchResults(search);
  };

  async function fetchResults(search: string) {
    const searchResults = await provider.search({ query: search });

    setSearchResults(searchResults);
  }

  return (
    <div className="relative w-full">
      <form
        className="flex w-full items-center gap-2"
        onSubmit={(e) => {
          handleSubmit(e, search);
        }}
      >
        <Input
          className="flex-1 border-2 border-gray-300 p-2"
          onChange={(e) => {
            setSearch(e.target.value);
          }}
          value={search}
          placeholder="Entrez une adresse"
          type="text"
        />
        {searchPosition ? (
          <Button
            variant={"outline"}
            className=" hover:cursor-pointer"
            onClick={() => setSearchPosition(null)}
          >
            Annuler
          </Button>
        ) : (
          <Button
            variant={"outline"}
            className='cursor-pointer'
            type="submit"
          >
            Rechercher
          </Button>
        )}
      </form>
      {searchResults && searchResults.length > 0 && (
        <div className="absolute top-full z-50 mt-1 max-h-96 w-full overflow-y-auto rounded-lg border-2 border-gray-300 bg-white shadow-lg">
          {searchResults.map((result) => (
            <button
              className="cursor-pointer w-full border-b border-gray-200 p-3 text-left last:border-b-0 hover:bg-gray-100"
              onClick={() => {
                setSearchPosition([+result.raw.lat, +result.raw.lon]);
                setSearchResults([]);
                setSearch("");
              }}
              key={`${result.raw.place_id}`}
            >
              {result.raw.display_name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
