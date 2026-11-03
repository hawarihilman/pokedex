import { CommonModule } from '@angular/common';
import { Component, Input, computed } from '@angular/core';

import type { PokemonStat } from '../../../core/models/pokemon.model';

@Component({
  selector: 'app-stat-bar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './stat-bar.component.html',
  styleUrls: ['./stat-bar.component.scss'],
})
export class StatBarComponent {
  @Input({ required: true }) stat!: PokemonStat;

  readonly barColor = computed(() => {
    const val = this.stat?.value ?? 0;
    if (val < 50) return '#FF5959'; // Low: Red
    if (val < 90) return '#FFB03A'; // Medium: Orange/Yellow
    if (val < 130) return '#4BC07A'; // Good: Green
    return '#00C8B3'; // Exceptional: Cyan/Teal
  });
}
