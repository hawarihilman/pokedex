import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { describe, it, expect, beforeEach, vi } from 'vitest';

import type { PokemonListItem } from '../models/pokemon.model';

import { HapticsService } from './haptics.service';
import { PokemonApiService } from './pokemon-api.service';
import { PokemonStoreService } from './pokemon-store.service';
import { StorageService } from './storage.service';

describe('PokemonStoreService', () => {
  let store: PokemonStoreService;
  let mockApi: Partial<PokemonApiService>;
  let mockStorage: Partial<StorageService>;
  let mockHaptics: Partial<HapticsService>;

  const mockItem1: PokemonListItem = {
    id: 1,
    name: 'Bulbasaur',
    formattedId: '#0001',
    imageUrl: 'https://example.com/1.png',
    types: ['grass', 'poison'],
    primaryType: 'grass',
    isFavorite: false,
  };

  const mockItem2: PokemonListItem = {
    id: 4,
    name: 'Charmander',
    formattedId: '#0004',
    imageUrl: 'https://example.com/4.png',
    types: ['fire'],
    primaryType: 'fire',
    isFavorite: false,
  };

  beforeEach(() => {
    mockApi = {
      getPokemonList: vi.fn().mockReturnValue(of({ items: [mockItem1, mockItem2], total: 2, hasNext: false })),
      hydratePokemonList: vi.fn().mockReturnValue(of([mockItem1, mockItem2])),
      getPokemonByType: vi.fn().mockReturnValue(of([mockItem2])),
      mapDetailToListItem: vi.fn().mockImplementation((d) => ({
        id: d.id,
        name: d.name,
        formattedId: d.formattedId,
        imageUrl: d.sprites.officialArtwork,
        types: d.types,
        primaryType: d.primaryType,
        isFavorite: d.isFavorite,
      })),
    };

    mockStorage = {
      get: vi.fn().mockImplementation((key, def) => def),
      set: vi.fn(),
      remove: vi.fn(),
    };

    mockHaptics = {
      impactMedium: vi.fn().mockResolvedValue(undefined),
      notificationSuccess: vi.fn().mockResolvedValue(undefined),
    };

    TestBed.configureTestingModule({
      providers: [
        PokemonStoreService,
        { provide: PokemonApiService, useValue: mockApi },
        { provide: StorageService, useValue: mockStorage },
        { provide: HapticsService, useValue: mockHaptics },
      ],
    });

    store = TestBed.inject(PokemonStoreService);
  });

  it('should initialize with empty list and correct defaults', () => {
    expect(store.rawPokemonList()).toEqual([]);
    expect(store.isLoading()).toBe(false);
    expect(store.error()).toBeNull();
    expect(store.selectedType()).toBeNull();
    expect(store.searchQuery()).toBe('');
    expect(store.favoritesCount()).toBe(0);
  });

  it('should load initial pokemon list', async () => {
    await store.loadInitial();

    expect(store.rawPokemonList().length).toBe(2);
    expect(store.totalCount()).toBe(2);
    expect(store.isLoading()).toBe(false);
    expect(store.displayPokemon().length).toBe(2);
  });

  it('should filter pokemon by text search query', async () => {
    await store.loadInitial();

    store.setSearchQuery('char');
    const result = store.displayPokemon();
    expect(result.length).toBe(1);
    expect(result[0].name).toBe('Charmander');
  });

  it('should filter pokemon by numeric ID search query', async () => {
    await store.loadInitial();

    store.setSearchQuery('1');
    const result = store.displayPokemon();
    expect(result.length).toBe(1);
    expect(result[0].name).toBe('Bulbasaur');
  });

  it('should filter pokemon by 4-digit formatted ID like "0004" and "#0004"', async () => {
    await store.loadInitial();

    store.setSearchQuery('0004');
    let result = store.displayPokemon();
    expect(result.length).toBe(1);
    expect(result[0].name).toBe('Charmander');
    expect(result[0].formattedId).toBe('#0004');

    store.setSearchQuery('#0004');
    result = store.displayPokemon();
    expect(result.length).toBe(1);
    expect(result[0].name).toBe('Charmander');
  });

  it('should toggle favorite status, persist to storage and trigger haptics', async () => {
    await store.loadInitial();

    // Toggle on
    const isFavNow = await store.toggleFavorite(mockItem1);
    expect(isFavNow).toBe(true);
    expect(store.isFavorite(1)).toBe(true);
    expect(store.favoritesCount()).toBe(1);
    expect(mockStorage.set).toHaveBeenCalled();
    expect(mockHaptics.impactMedium).toHaveBeenCalled();

    // Check displayPokemon reflects favorite state
    const currentList = store.displayPokemon();
    expect(currentList.find((p) => p.id === 1)?.isFavorite).toBe(true);

    // Toggle off
    const isFavAfter = await store.toggleFavorite(mockItem1);
    expect(isFavAfter).toBe(false);
    expect(store.isFavorite(1)).toBe(false);
    expect(store.favoritesCount()).toBe(0);
  });

  it('should filter pokemon by type', async () => {
    await store.setSelectedType('fire');

    expect(store.selectedType()).toBe('fire');
    expect(mockApi.getPokemonByType).toHaveBeenCalledWith('fire');
  });
});
