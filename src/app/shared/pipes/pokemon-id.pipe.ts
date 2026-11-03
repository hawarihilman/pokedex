import type { PipeTransform } from '@angular/core';
import { Pipe } from '@angular/core';

import { formatPokemonId } from '../../core/utils/pokemon.utils';

@Pipe({
  name: 'pokemonId',
  standalone: true,
})
export class PokemonIdPipe implements PipeTransform {
  transform(value: number | string | null | undefined): string {
    if (value === null || value === undefined) return '#0000';
    const num = typeof value === 'string' ? parseInt(value, 10) : value;
    return formatPokemonId(num);
  }
}
