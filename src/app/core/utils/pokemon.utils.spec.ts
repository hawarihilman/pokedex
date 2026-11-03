import { describe, it, expect } from 'vitest';

import {
  extractIdFromUrl,
  formatPokemonId,
  formatPokemonName,
  getOfficialArtworkUrl,
  parsePokemonType,
} from './pokemon.utils';

describe('Pokemon Utils', () => {
  describe('extractIdFromUrl', () => {
    it('should extract numeric ID from standard PokeAPI URLs', () => {
      expect(extractIdFromUrl('https://pokeapi.co/api/v2/pokemon/25/')).toBe(25);
      expect(extractIdFromUrl('https://pokeapi.co/api/v2/pokemon/1/')).toBe(1);
      expect(extractIdFromUrl('https://pokeapi.co/api/v2/pokemon/1025/')).toBe(1025);
    });

    it('should handle URLs without trailing slashes', () => {
      expect(extractIdFromUrl('https://pokeapi.co/api/v2/pokemon/4')).toBe(4);
    });

    it('should return 0 for invalid URLs', () => {
      expect(extractIdFromUrl('')).toBe(0);
      expect(extractIdFromUrl('invalid-url')).toBe(0);
    });
  });

  describe('formatPokemonId', () => {
    it('should pad IDs to 4 digits prefixed with #', () => {
      expect(formatPokemonId(1)).toBe('#0001');
      expect(formatPokemonId(25)).toBe('#0025');
      expect(formatPokemonId(151)).toBe('#0151');
      expect(formatPokemonId(1025)).toBe('#1025');
    });

    it('should handle zero or negative IDs', () => {
      expect(formatPokemonId(0)).toBe('#0000');
      expect(formatPokemonId(-5)).toBe('#0000');
    });
  });

  describe('formatPokemonName', () => {
    it('should capitalize single-word names', () => {
      expect(formatPokemonName('pikachu')).toBe('Pikachu');
      expect(formatPokemonName('charizard')).toBe('Charizard');
    });

    it('should capitalize hyphenated multi-word names', () => {
      expect(formatPokemonName('tapu-koko')).toBe('Tapu Koko');
      expect(formatPokemonName('mr-mime')).toBe('Mr Mime');
      expect(formatPokemonName('ho-oh')).toBe('Ho Oh');
    });

    it('should return empty string for falsy input', () => {
      expect(formatPokemonName('')).toBe('');
    });
  });

  describe('getOfficialArtworkUrl', () => {
    it('should generate the correct GitHub raw URL for official artwork', () => {
      const url = getOfficialArtworkUrl(25);
      expect(url).toBe(
        'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png',
      );
    });
  });

  describe('parsePokemonType', () => {
    it('should lowercase string and return as PokemonType', () => {
      expect(parsePokemonType('FIRE')).toBe('fire');
      expect(parsePokemonType('Grass')).toBe('grass');
    });
  });
});
