export type PokemonType =
  | 'normal'
  | 'fire'
  | 'water'
  | 'grass'
  | 'electric'
  | 'ice'
  | 'fighting'
  | 'poison'
  | 'ground'
  | 'flying'
  | 'psychic'
  | 'bug'
  | 'rock'
  | 'ghost'
  | 'dragon'
  | 'steel'
  | 'fairy';

export interface PokemonTypeMeta {
  name: PokemonType;
  color: string;
  backgroundColor: string;
  badgeGradient: string;
  textColor: string;
}

export interface PokemonStat {
  name: string;
  label: string;
  value: number;
  max: number;
  percentage: number;
}

export interface PokemonAbility {
  name: string;
  isHidden: boolean;
  slot: number;
}

export interface PokemonSprites {
  officialArtwork: string;
  officialArtworkShiny?: string;
  frontDefault: string;
  frontShiny?: string;
  backDefault?: string;
  backShiny?: string;
}

export interface PokemonListItem {
  id: number;
  name: string;
  formattedId: string;
  imageUrl: string;
  types: PokemonType[];
  primaryType: PokemonType;
  isFavorite: boolean;
}

export interface PokemonDetail {
  id: number;
  name: string;
  formattedId: string;
  height: number; // decimeters
  weight: number; // hectograms
  heightInMeters: number;
  weightInKg: number;
  baseExperience: number;
  types: PokemonType[];
  primaryType: PokemonType;
  stats: PokemonStat[];
  totalStats: number;
  abilities: PokemonAbility[];
  sprites: PokemonSprites;
  cryUrl?: string;
  isFavorite: boolean;
}

export interface PokemonFilter {
  query: string;
  type: PokemonType | null;
}
