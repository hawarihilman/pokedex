import { CommonModule } from '@angular/common';
import { Component, Input, computed, signal } from '@angular/core';

import { POKEMON_TYPE_METAS } from '../../../core/constants/pokemon-types.constant';
import type { PokemonType } from '../../../core/models/pokemon.model';

@Component({
  selector: 'app-type-badge',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './type-badge.component.html',
  styleUrls: ['./type-badge.component.scss'],
})
export class TypeBadgeComponent {
  private readonly typeSignal = signal<PokemonType>('normal');

  @Input({ required: true })
  set type(val: PokemonType) {
    this.typeSignal.set(val || 'normal');
  }

  @Input() size: 'small' | 'medium' | 'large' = 'medium';

  readonly meta = computed(() => {
    const t = this.typeSignal();
    return (
      POKEMON_TYPE_METAS[t] ?? {
        name: t,
        color: '#8A8A8A',
        backgroundColor: '#F5F5F5',
        badgeGradient: 'linear-gradient(135deg, #8A8A8A 0%, #6E6E6E 100%)',
        textColor: '#FFFFFF',
      }
    );
  });
}
