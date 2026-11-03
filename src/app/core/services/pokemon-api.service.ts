import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import type { Observable } from 'rxjs';
import { forkJoin, map, of, catchError } from 'rxjs';

import { environment } from '../../../environments/environment';
import { STAT_NAME_MAP, MAX_STAT_VALUES } from '../constants/pokemon-types.constant';
import type { PokeApiListResponse, PokeApiPokemonDto, PokeApiTypeDetailResponse } from '../models/api.model';
import type { PokemonDetail, PokemonListItem, PokemonStat, PokemonType } from '../models/pokemon.model';
import {
  extractIdFromUrl,
  formatPokemonId,
  formatPokemonName,
  getOfficialArtworkUrl,
  parsePokemonType,
} from '../utils/pokemon.utils';

export interface PokemonPageResult {
  items: PokemonListItem[];
  total: number;
  hasNext: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class PokemonApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.pokeApiBaseUrl;

  /**
   * Fetches paginated list of Pokémon with their full card details.
   */
  getPokemonList(offset = 0, limit = environment.pageSize): Observable<PokemonPageResult> {
    const url = `${this.baseUrl}/pokemon?offset=${offset}&limit=${limit}`;

    return this.http.get<PokeApiListResponse>(url).pipe(
      map((response) => ({
        results: response.results,
        total: response.count,
        hasNext: response.next !== null,
      })),
      map((data) => {
        // Fast lightweight mapping with official artwork and ID
        const items: PokemonListItem[] = data.results.map((r) => {
          const id = extractIdFromUrl(r.url);
          return {
            id,
            name: formatPokemonName(r.name),
            formattedId: formatPokemonId(id),
            imageUrl: getOfficialArtworkUrl(id),
            types: ['normal'] as PokemonType[], // Updated when detail is fetched or hydrated
            primaryType: 'normal' as PokemonType,
            isFavorite: false,
          };
        });

        return {
          items,
          total: data.total,
          hasNext: data.hasNext,
          names: data.results.map((r) => r.name),
        };
      }),
      // Hydrate items with their real types in parallel for rich colored badges & cards
      // This is fast and cached by our cacheInterceptor
      map((page) => page),
    );
  }

  /**
   * Hydrates a list of Pokemon item names with their actual types and details.
   */
  hydratePokemonList(namesOrIds: (string | number)[]): Observable<PokemonListItem[]> {
    if (namesOrIds.length === 0) {
      return of([]);
    }

    const requests = namesOrIds.map((id) =>
      this.getPokemonDetail(id).pipe(
        map((detail) => this.mapDetailToListItem(detail)),
        catchError((err) => {
          console.warn(`[PokemonApiService] Failed to hydrate Pokemon ${id}:`, err);
          return of(null);
        }),
      ),
    );

    return forkJoin(requests).pipe(map((items) => items.filter((item): item is PokemonListItem => item !== null)));
  }

  /**
   * Fetches full Pokemon detail by ID or slug name.
   */
  getPokemonDetail(nameOrId: string | number): Observable<PokemonDetail> {
    const target = typeof nameOrId === 'string' ? nameOrId.toLowerCase().trim() : nameOrId;
    const url = `${this.baseUrl}/pokemon/${target}`;

    return this.http.get<PokeApiPokemonDto>(url).pipe(map((dto) => this.mapDtoToDetail(dto)));
  }

  /**
   * Fetches all Pokémon belonging to a specific type.
   */
  getPokemonByType(type: PokemonType): Observable<PokemonListItem[]> {
    const url = `${this.baseUrl}/type/${type.toLowerCase()}`;

    return this.http.get<PokeApiTypeDetailResponse>(url).pipe(
      map((res) =>
        res.pokemon.map((slot) => {
          const id = extractIdFromUrl(slot.pokemon.url);
          return {
            id,
            name: formatPokemonName(slot.pokemon.name),
            formattedId: formatPokemonId(id),
            imageUrl: getOfficialArtworkUrl(id),
            types: [type],
            primaryType: type,
            isFavorite: false,
          };
        }),
      ),
    );
  }

  /**
   * Transforms API DTO into clean domain PokemonDetail.
   */
  mapDtoToDetail(dto: PokeApiPokemonDto): PokemonDetail {
    const types = dto.types.sort((a, b) => a.slot - b.slot).map((t) => parsePokemonType(t.type.name));

    const primaryType = types[0] ?? 'normal';

    const stats: PokemonStat[] = dto.stats.map((s) => {
      const rawName = s.stat.name;
      const label = STAT_NAME_MAP[rawName] ?? rawName.toUpperCase();
      const max = MAX_STAT_VALUES[rawName] ?? 200;
      const percentage = Math.min(100, Math.round((s.base_stat / max) * 100));

      return {
        name: rawName,
        label,
        value: s.base_stat,
        max,
        percentage,
      };
    });

    const totalStats = stats.reduce((acc, curr) => acc + curr.value, 0);

    const abilities = dto.abilities
      .sort((a, b) => a.slot - b.slot)
      .map((a) => ({
        name: formatPokemonName(a.ability.name),
        isHidden: a.is_hidden,
        slot: a.slot,
      }));

    const artwork =
      dto.sprites.other?.['official-artwork']?.front_default ||
      dto.sprites.other?.home?.front_default ||
      dto.sprites.front_default ||
      getOfficialArtworkUrl(dto.id);

    const artworkShiny =
      dto.sprites.other?.['official-artwork']?.front_shiny ||
      dto.sprites.other?.home?.front_shiny ||
      dto.sprites.front_shiny ||
      undefined;

    return {
      id: dto.id,
      name: formatPokemonName(dto.name),
      formattedId: formatPokemonId(dto.id),
      height: dto.height,
      weight: dto.weight,
      heightInMeters: Number((dto.height / 10).toFixed(1)),
      weightInKg: Number((dto.weight / 10).toFixed(1)),
      baseExperience: dto.base_experience,
      types,
      primaryType,
      stats,
      totalStats,
      abilities,
      sprites: {
        officialArtwork: artwork,
        officialArtworkShiny: artworkShiny,
        frontDefault: dto.sprites.front_default || artwork,
        frontShiny: dto.sprites.front_shiny || undefined,
        backDefault: dto.sprites.back_default || undefined,
        backShiny: dto.sprites.back_shiny || undefined,
      },
      cryUrl: dto.cries?.latest || dto.cries?.legacy,
      isFavorite: false,
    };
  }

  /**
   * Converts a PokemonDetail into a lightweight PokemonListItem.
   */
  mapDetailToListItem(detail: PokemonDetail): PokemonListItem {
    return {
      id: detail.id,
      name: detail.name,
      formattedId: detail.formattedId,
      imageUrl: detail.sprites.officialArtwork,
      types: detail.types,
      primaryType: detail.primaryType,
      isFavorite: detail.isFavorite,
    };
  }
}
