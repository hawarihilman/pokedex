export interface PokeApiNamedResource {
  name: string;
  url: string;
}

export interface PokeApiListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: PokeApiNamedResource[];
}

export interface PokeApiAbilitySlot {
  ability: PokeApiNamedResource;
  is_hidden: boolean;
  slot: number;
}

export interface PokeApiTypeSlot {
  slot: number;
  type: PokeApiNamedResource;
}

export interface PokeApiStatSlot {
  base_stat: number;
  effort: number;
  stat: PokeApiNamedResource;
}

export interface PokeApiSprites {
  front_default: string | null;
  front_shiny: string | null;
  back_default: string | null;
  back_shiny: string | null;
  other?: {
    'official-artwork'?: {
      front_default: string | null;
      front_shiny?: string | null;
    };
    home?: {
      front_default: string | null;
      front_shiny?: string | null;
    };
    dream_world?: {
      front_default: string | null;
    };
  };
}

export interface PokeApiCries {
  latest?: string;
  legacy?: string;
}

export interface PokeApiPokemonDto {
  id: number;
  name: string;
  height: number;
  weight: number;
  base_experience: number;
  types: PokeApiTypeSlot[];
  stats: PokeApiStatSlot[];
  abilities: PokeApiAbilitySlot[];
  sprites: PokeApiSprites;
  cries?: PokeApiCries;
}

export interface PokeApiTypePokemonSlot {
  slot: number;
  pokemon: PokeApiNamedResource;
}

export interface PokeApiTypeDetailResponse {
  id: number;
  name: string;
  pokemon: PokeApiTypePokemonSlot[];
}
