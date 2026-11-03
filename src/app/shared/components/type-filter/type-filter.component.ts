import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

import { ALL_POKEMON_TYPES, POKEMON_TYPE_METAS } from '../../../core/constants/pokemon-types.constant';
import type { PokemonType } from '../../../core/models/pokemon.model';

@Component({
  selector: 'app-type-filter',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './type-filter.component.html',
  styleUrls: ['./type-filter.component.scss'],
})
export class TypeFilterComponent {
  readonly types = ALL_POKEMON_TYPES;
  readonly typeMetas = POKEMON_TYPE_METAS;

  @Input() selectedType: PokemonType | null = null;
  @Output() typeSelected = new EventEmitter<PokemonType | null>();

  onSelect(type: PokemonType | null): void {
    this.typeSelected.emit(type);
  }
}
