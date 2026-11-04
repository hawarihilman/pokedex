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

/**
 * Checks if a Pokemon matches a search query (by name, numeric ID, or formatted ID).
 * Handles queries like "0004", "#0004", "4", "#4", "04", "char", "charmander".
 */
export function matchesPokemonQuery(
  pokemon: { id: number; name: string; formattedId: string },
  rawQuery: string,
): boolean {
  if (!rawQuery) return true;

  const query = rawQuery.trim().toLowerCase();
  if (!query) return true;

  // 1. Name match
  if (pokemon.name.toLowerCase().includes(query)) {
    return true;
  }

  // 2. Exact or substring match on formatted ID (e.g. "#0004" matches "#0004", "0004", "004")
  if (pokemon.formattedId.toLowerCase().includes(query)) {
    return true;
  }

  const cleanQuery = query.replace('#', '').trim();
  const cleanFormattedId = pokemon.formattedId.replace('#', '');

  if (cleanFormattedId.includes(cleanQuery)) {
    return true;
  }

  // 3. Numeric ID match (handles "0004" -> 4, "4" -> 4, etc.)
  const queryNum = parseInt(cleanQuery, 10);
  if (!Number.isNaN(queryNum)) {
    // If exact ID matches numeric value (e.g. "0004" matches ID 4)
    if (pokemon.id === queryNum) {
      return true;
    }
    // Substring of numeric ID (e.g. "4" matches 4, 14, 24, 40)
    if (pokemon.id.toString().includes(cleanQuery)) {
      return true;
    }
  }

  return false;
}
