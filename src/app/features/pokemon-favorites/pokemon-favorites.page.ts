import { CommonModule } from '@angular/common';
import { Component, ViewChild, computed, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import type { ViewDidEnter } from '@ionic/angular';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonSearchbar, IonIcon } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { heart, heartOutline, heartDislikeOutline, listOutline, searchOutline } from 'ionicons/icons';

import type { PokemonListItem } from '../../core/models/pokemon.model';
import { PokemonStoreService } from '../../core/services/pokemon-store.service';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';
import { PokemonCardComponent } from '../../shared/components/pokemon-card/pokemon-card.component';

@Component({
  selector: 'app-pokemon-favorites',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonSearchbar,
    IonIcon,
    PokemonCardComponent,
    EmptyStateComponent,
  ],
  templateUrl: './pokemon-favorites.page.html',
  styleUrls: ['./pokemon-favorites.page.scss'],
})
export class PokemonFavoritesPage implements ViewDidEnter {
  @ViewChild('content', { static: false }) content?: IonContent;

  readonly store = inject(PokemonStoreService);
  private readonly router = inject(Router);

  readonly searchQuery = signal<string>('');

  readonly filteredFavorites = computed(() => {
    const q = this.searchQuery().trim().toLowerCase();
    const cleanNum = q.replace('#', '');
    const items = this.store.favoriteItems().map((p) => ({
      ...p,
      isFavorite: true,
    }));

    if (!q) {
      return items;
    }

    return items.filter((p) => {
      const nameMatch = p.name.toLowerCase().includes(q);
      const idMatch = p.id.toString().includes(cleanNum);
      return nameMatch || idMatch;
    });
  });

  constructor() {
    addIcons({
      heart,
      heartOutline,
      heartDislikeOutline,
      listOutline,
      searchOutline,
    });
  }

  ionViewDidEnter(): void {
    // Reset scroll to top when entering favorites tab
    this.scrollToTop(150);
  }

  scrollToTop(duration = 300): void {
    this.content?.scrollToTop(duration);
  }

  onSearchChange(event: CustomEvent): void {
    const val = (event.detail.value ?? '') as string;
    this.searchQuery.set(val);
    this.scrollToTop(200);
  }

  clearSearch(): void {
    this.searchQuery.set('');
    this.scrollToTop(200);
  }

  async onFavoriteToggle(item: PokemonListItem): Promise<void> {
    await this.store.toggleFavorite(item);
  }

  goToPokedex(): void {
    this.router.navigate(['/tabs/list']);
  }
}
