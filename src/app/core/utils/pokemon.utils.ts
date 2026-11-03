import type { PokemonType } from '../models/pokemon.model';

/**
 * Extracts numeric Pokemon ID from a PokeAPI resource URL.
 * e.g. "https://pokeapi.co/api/v2/pokemon/25/" -> 25
 */
export function extractIdFromUrl(url: string): number {
  const parts = url.split('/').filter(Boolean);
  const idStr = parts[parts.length - 1];
  const id = parseInt(idStr, 10);
  return Number.isNaN(id) ? 0 : id;
}

/**
 * Formats numeric Pokemon ID to Pokédex display format.
 * e.g. 1 -> "#0001", 25 -> "#0025", 151 -> "#0151", 1025 -> "#1025"
 */
export function formatPokemonId(id: number): string {
  if (!id || id < 0) return '#0000';
  return '#' + id.toString().padStart(4, '0');
}

/**
 * Capitalizes a hyphenated or lower-case Pokemon name.
 * e.g. "tapu-koko" -> "Tapu Koko", "pikachu" -> "Pikachu"
 */
export function formatPokemonName(name: string): string {
  if (!name) return '';
  return name
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(' ');
}

/**
 * Returns official artwork sprite URL from Pokemon ID.
 */
export function getOfficialArtworkUrl(id: number): string {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
}

/**
 * Safely parses a string into a valid PokemonType, or returns null.
 */
export function parsePokemonType(typeStr: string): PokemonType {
  return typeStr.toLowerCase() as PokemonType;
}
