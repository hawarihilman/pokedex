import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';

import type { PokeApiPokemonDto } from '../models/api.model';

import { PokemonApiService } from './pokemon-api.service';

describe('PokemonApiService', () => {
  let service: PokemonApiService;
  let httpMock: HttpTestingController;

  const mockDto: PokeApiPokemonDto = {
    id: 25,
    name: 'pikachu',
    height: 4,
    weight: 60,
    base_experience: 112,
    types: [
      {
        slot: 1,
        type: { name: 'electric', url: 'https://pokeapi.co/api/v2/type/13/' },
      },
    ],
    stats: [
      {
        base_stat: 35,
        effort: 0,
        stat: { name: 'hp', url: '' },
      },
      {
        base_stat: 55,
        effort: 0,
        stat: { name: 'attack', url: '' },
      },
    ],
    abilities: [
      {
        ability: { name: 'static', url: '' },
        is_hidden: false,
        slot: 1,
      },
      {
        ability: { name: 'lightning-rod', url: '' },
        is_hidden: true,
        slot: 3,
      },
    ],
    sprites: {
      front_default: 'https://example.com/front.png',
      front_shiny: 'https://example.com/front_shiny.png',
      back_default: 'https://example.com/back.png',
      back_shiny: 'https://example.com/back_shiny.png',
      other: {
        'official-artwork': {
          front_default: 'https://example.com/artwork.png',
          front_shiny: 'https://example.com/artwork_shiny.png',
        },
      },
    },
    cries: {
      latest: 'https://example.com/cry.ogg',
    },
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PokemonApiService, provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(PokemonApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('mapDtoToDetail', () => {
    it('should correctly transform PokeApiPokemonDto to PokemonDetail', () => {
      const detail = service.mapDtoToDetail(mockDto);

      expect(detail.id).toBe(25);
      expect(detail.name).toBe('Pikachu');
      expect(detail.formattedId).toBe('#0025');
      expect(detail.heightInMeters).toBe(0.4);
      expect(detail.weightInKg).toBe(6.0);
      expect(detail.primaryType).toBe('electric');
      expect(detail.types).toEqual(['electric']);
      expect(detail.abilities.length).toBe(2);
      expect(detail.abilities[1].isHidden).toBe(true);
      expect(detail.abilities[1].name).toBe('Lightning Rod');
      expect(detail.sprites.officialArtwork).toBe('https://example.com/artwork.png');
      expect(detail.sprites.officialArtworkShiny).toBe('https://example.com/artwork_shiny.png');
      expect(detail.cryUrl).toBe('https://example.com/cry.ogg');
      expect(detail.totalStats).toBe(90);
    });
  });

  describe('getPokemonDetail', () => {
    it('should fetch and map pokemon detail', () => {
      service.getPokemonDetail(25).subscribe((detail) => {
        expect(detail.id).toBe(25);
        expect(detail.name).toBe('Pikachu');
      });

      const req = httpMock.expectOne('https://pokeapi.co/api/v2/pokemon/25');
      expect(req.request.method).toBe('GET');
      req.flush(mockDto);
    });
  });

  describe('getPokemonByType', () => {
    it('should fetch pokemon list for a specific type', () => {
      service.getPokemonByType('electric').subscribe((list) => {
        expect(list.length).toBe(1);
        expect(list[0].id).toBe(25);
        expect(list[0].name).toBe('Pikachu');
        expect(list[0].primaryType).toBe('electric');
      });

      const req = httpMock.expectOne('https://pokeapi.co/api/v2/type/electric');
      expect(req.request.method).toBe('GET');
      req.flush({
        id: 13,
        name: 'electric',
        pokemon: [
          {
            slot: 1,
            pokemon: { name: 'pikachu', url: 'https://pokeapi.co/api/v2/pokemon/25/' },
          },
        ],
      });
    });
  });
});
