import { Injectable, computed, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';

import { environment } from '../../../environments/environment';
import type { PokemonDetail, PokemonListItem, PokemonType } from '../models/pokemon.model';

import { HapticsService } from './haptics.service';
import { PokemonApiService } from './pokemon-api.service';
import { StorageService } from './storage.service';

const FAVORITES_STORAGE_KEY = 'pokedex_favorite_ids';
const FAVORITES_DETAILS_KEY = 'pokedex_favorite_items';

@Injectable({
  providedIn: 'root',
})
export class PokemonStoreService {
  private readonly api = inject(PokemonApiService);
  private readonly storage = inject(StorageService);
  private readonly haptics = inject(HapticsService);

  // Core State Signals
  readonly rawPokemonList = signal<PokemonListItem[]>([]);
  readonly currentOffset = signal<number>(0);
  readonly totalCount = signal<number>(0);
  readonly hasMore = signal<boolean>(true);
  readonly isLoading = signal<boolean>(false);
  readonly isLoadingMore = signal<boolean>(false);
  readonly error = signal<string | null>(null);

  // Filters
  readonly selectedType = signal<PokemonType | null>(null);
  readonly searchQuery = signal<string>('');

  // Type Filter Cache / All results for active type
  readonly typeFilteredList = signal<PokemonListItem[]>([]);
  readonly typeFilterOffset = signal<number>(0);

  // Favorites state
  readonly favoriteIds = signal<number[]>(this.storage.get<number[]>(FAVORITES_STORAGE_KEY, []));
  readonly favoriteItems = signal<PokemonListItem[]>(this.storage.get<PokemonListItem[]>(FAVORITES_DETAILS_KEY, []));

  // Computed signals
  readonly favoritesCount = computed(() => this.favoriteIds().length);
  readonly isTypeFiltered = computed(() => this.selectedType() !== null);

  /**
   * Main list displayed to the user.
   * Merges favorite statuses, filters by search query and selected type.
   */
  readonly displayPokemon = computed(() => {
    const favSet = new Set(this.favoriteIds());
    const query = this.searchQuery().trim().toLowerCase();
    const isFiltered = this.isTypeFiltered();

    const baseList = isFiltered ? this.typeFilteredList().slice(0, this.typeFilterOffset()) : this.rawPokemonList();

    const withFavStatus = baseList.map((item) => ({
      ...item,
      isFavorite: favSet.has(item.id),
    }));

    if (!query) {
      return withFavStatus;
    }

    const cleanNumericQuery = query.replace('#', '');
    return withFavStatus.filter((p) => {
      const nameMatch = p.name.toLowerCase().includes(query);
      const idMatch = p.id.toString().includes(cleanNumericQuery);
      return nameMatch || idMatch;
    });
  });

  /**
   * Favorites list with query search applied.
   */
  readonly displayFavorites = computed(() => {
    const query = this.searchQuery().trim().toLowerCase();
    const cleanNumericQuery = query.replace('#', '');
    const items = this.favoriteItems().map((item) => ({
      ...item,
      isFavorite: true,
    }));

    if (!query) {
      return items;
    }

    return items.filter((p) => {
      const nameMatch = p.name.toLowerCase().includes(query);
      const idMatch = p.id.toString().includes(cleanNumericQuery);
      return nameMatch || idMatch;
    });
  });

  /**
   * Initial page load.
   */
  async loadInitial(): Promise<void> {
    if (this.rawPokemonList().length > 0) {
      return;
    }

    this.isLoading.set(true);
    this.error.set(null);

    try {
      const pageResult = await firstValueFrom(this.api.getPokemonList(0, environment.pageSize));

      // Display initial page items immediately
      this.rawPokemonList.set(pageResult.items);
      this.currentOffset.set(pageResult.items.length);
      this.totalCount.set(pageResult.total);
      this.hasMore.set(pageResult.hasNext);

      // Enrich types in the background without blocking render
      this.hydrateSlice(pageResult.items.map((i) => i.id));
    } catch (err) {
      console.error('[PokemonStore] Failed to load initial pokemon:', err);
      this.error.set('Could not load Pokémon. Please check your connection.');
    } finally {
      this.isLoading.set(false);
    }
  }

  /**
   * Infinite scroll load more.
   */
  async loadMore(): Promise<boolean> {
    if (this.isLoading() || this.isLoadingMore()) {
      return this.hasMore();
    }

    // Type filter mode
    if (this.isTypeFiltered()) {
      const allForType = this.typeFilteredList();
      const current = this.typeFilterOffset();
      if (current >= allForType.length) {
        this.hasMore.set(false);
        return false;
      }

      this.isLoadingMore.set(true);
      const nextOffset = Math.min(current + environment.pageSize, allForType.length);

      this.typeFilterOffset.set(nextOffset);
      const moreAvailable = nextOffset < allForType.length;
      this.hasMore.set(moreAvailable);

      // Enrich newly visible slice with types
      const sliceToHydrate = allForType.slice(current, nextOffset);
      this.hydrateTypeFilterSlice(
        sliceToHydrate.map((i) => i.id),
        current,
      );

      this.isLoadingMore.set(false);
      return moreAvailable;
    }

    // Standard infinite scroll mode
    if (!this.hasMore()) {
      return false;
    }

    this.isLoadingMore.set(true);
    try {
      const offset = this.currentOffset();
      const pageResult = await firstValueFrom(this.api.getPokemonList(offset, environment.pageSize));

      if (pageResult.items.length === 0) {
        this.hasMore.set(false);
        return false;
      }

      // Append items immediately so trainer sees them without lag
      this.rawPokemonList.update((prev) => [...prev, ...pageResult.items]);
      this.currentOffset.set(offset + pageResult.items.length);

      const moreExist = pageResult.hasNext && this.rawPokemonList().length < pageResult.total;
      this.hasMore.set(moreExist);

      // Enrich in the background
      this.hydrateSlice(pageResult.items.map((i) => i.id));

      return moreExist;
    } catch (err) {
      console.error('[PokemonStore] Failed to load more pokemon:', err);
      return this.hasMore();
    } finally {
      this.isLoadingMore.set(false);
    }
  }

  /**
   * Background hydration helper for standard list.
   */
  private hydrateSlice(ids: number[]): void {
    if (ids.length === 0) return;

    this.api.hydratePokemonList(ids).subscribe({
      next: (hydrated) => {
        if (!hydrated || hydrated.length === 0) return;
        const lookup = new Map(hydrated.map((h) => [h.id, h]));
        this.rawPokemonList.update((list) =>
          list.map((item) => (lookup.has(item.id) ? { ...item, ...lookup.get(item.id)! } : item)),
        );
      },
      error: (err) => {
        console.warn('[PokemonStore] Background hydration issue:', err);
      },
    });
  }

  /**
   * Background hydration helper for type filtered list.
   */
  private hydrateTypeFilterSlice(ids: number[], startIndex: number): void {
    if (ids.length === 0) return;

    this.api.hydratePokemonList(ids).subscribe({
      next: (hydrated) => {
        if (!hydrated || hydrated.length === 0) return;
        const currentList = [...this.typeFilteredList()];
        hydrated.forEach((item, idx) => {
          if (startIndex + idx < currentList.length) {
            currentList[startIndex + idx] = item;
          }
        });
        this.typeFilteredList.set(currentList);
      },
      error: (err) => {
        console.warn('[PokemonStore] Type filter background hydration issue:', err);
      },
    });
  }

  /**
   * Filter Pokémon by type.
   */
  async setSelectedType(type: PokemonType | null): Promise<void> {
    if (this.selectedType() === type) {
      return;
    }

    this.selectedType.set(type);

    if (!type) {
      this.typeFilteredList.set([]);
      this.typeFilterOffset.set(0);
      this.hasMore.set(this.rawPokemonList().length < this.totalCount());
      return;
    }

    this.isLoading.set(true);
    this.error.set(null);

    try {
      const list = await firstValueFrom(this.api.getPokemonByType(type));
      this.typeFilteredList.set(list);

      const initialSliceSize = Math.min(environment.pageSize, list.length);
      this.typeFilterOffset.set(initialSliceSize);
      this.hasMore.set(initialSliceSize < list.length);

      if (initialSliceSize > 0) {
        const slice = list.slice(0, initialSliceSize);
        this.hydrateTypeFilterSlice(
          slice.map((s) => s.id),
          0,
        );
      }
    } catch (err) {
      console.error('[PokemonStore] Failed to filter by type:', err);
      this.error.set(`Could not filter by type ${type}.`);
    } finally {
      this.isLoading.set(false);
    }
  }

  /**
   * Search input update.
   */
  setSearchQuery(query: string): void {
    this.searchQuery.set(query);
  }

  /**
   * Toggle a Pokemon in favorites.
   */
  async toggleFavorite(target: PokemonListItem | PokemonDetail): Promise<boolean> {
    await this.haptics.impactMedium();

    const id = target.id;
    const currentFavIds = this.favoriteIds();
    const isCurrentlyFav = currentFavIds.includes(id);

    let updatedIds: number[];
    let updatedItems: PokemonListItem[];

    if (isCurrentlyFav) {
      updatedIds = currentFavIds.filter((favId) => favId !== id);
      updatedItems = this.favoriteItems().filter((item) => item.id !== id);
    } else {
      updatedIds = [...currentFavIds, id];
      const itemToSave: PokemonListItem = 'stats' in target ? this.api.mapDetailToListItem(target) : target;

      updatedItems = [...this.favoriteItems(), { ...itemToSave, isFavorite: true }];
      await this.haptics.notificationSuccess();
    }

    this.favoriteIds.set(updatedIds);
    this.favoriteItems.set(updatedItems);
    this.storage.set(FAVORITES_STORAGE_KEY, updatedIds);
    this.storage.set(FAVORITES_DETAILS_KEY, updatedItems);

    return !isCurrentlyFav;
  }

  isFavorite(id: number): boolean {
    return this.favoriteIds().includes(id);
  }

  /**
   * Pull-to-refresh action.
   */
  async refresh(): Promise<void> {
    this.rawPokemonList.set([]);
    this.currentOffset.set(0);
    this.hasMore.set(true);

    if (this.selectedType()) {
      const type = this.selectedType();
      this.selectedType.set(null);
      await this.setSelectedType(type);
    } else {
      await this.loadInitial();
    }
  }
}
