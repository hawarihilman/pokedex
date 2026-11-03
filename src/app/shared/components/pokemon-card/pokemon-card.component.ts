import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IonIcon } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { heart, heartOutline } from 'ionicons/icons';

import { POKEMON_TYPE_METAS } from '../../../core/constants/pokemon-types.constant';
import type { PokemonListItem } from '../../../core/models/pokemon.model';
import { TypeBadgeComponent } from '../type-badge/type-badge.component';

@Component({
  selector: 'app-pokemon-card',
  standalone: true,
  imports: [CommonModule, RouterLink, IonIcon, TypeBadgeComponent],
  templateUrl: './pokemon-card.component.html',
  styleUrls: ['./pokemon-card.component.scss'],
})
export class PokemonCardComponent {
  private readonly pokemonSignal = signal<PokemonListItem>({
    id: 1,
    name: 'Bulbasaur',
    formattedId: '#0001',
    imageUrl: '',
    types: ['grass'],
    primaryType: 'grass',
    isFavorite: false,
  });

  @Input({ required: true })
  set pokemon(val: PokemonListItem) {
    this.pokemonSignal.set(val);
  }
  get pokemon(): PokemonListItem {
    return this.pokemonSignal();
  }

  @Output() favoriteToggled = new EventEmitter<PokemonListItem>();

  constructor() {
    addIcons({ heart, heartOutline });
  }

  readonly imageSrc = computed(() => this.pokemon.imageUrl);

  readonly typeMeta = computed(() => {
    const primary = this.pokemon.primaryType || 'normal';
    return (
      POKEMON_TYPE_METAS[primary] ?? {
        name: primary,
        color: '#8A8A8A',
        backgroundColor: '#F5F5F5',
        badgeGradient: 'linear-gradient(135deg, #8A8A8A 0%, #6E6E6E 100%)',
        textColor: '#FFFFFF',
      }
    );
  });

  onToggleFavorite(event: Event): void {
    event.stopPropagation();
    event.preventDefault();
    this.favoriteToggled.emit(this.pokemon);
  }

  onImageError(): void {
    const fallback = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${this.pokemon.id}.png`;
    this.pokemon.imageUrl = fallback;
  }
}
