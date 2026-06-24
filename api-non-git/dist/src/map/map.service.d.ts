import { OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { SearchAddressDto } from "./dto/search-address.dto";
import { SearchResult } from "../utils/types/search-result";
export declare class MapService implements OnModuleInit, OnModuleDestroy {
    private tilesDb;
    private addressesDb;
    onModuleInit(): void;
    onModuleDestroy(): void;
    findTile(z: number, x: number, y: number): Promise<Buffer<ArrayBufferLike>>;
    private normalizeInput;
    private buildFtsQuery;
    search(searchAddressDto: SearchAddressDto): SearchResult[];
}
