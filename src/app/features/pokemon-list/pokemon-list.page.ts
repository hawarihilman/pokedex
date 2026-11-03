import { CommonModule } from '@angular/common';
import type { OnInit } from '@angular/core';
import { Component, ViewChild, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import type { ViewDidEnter } from '@ionic/angular';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonSearchbar,
  IonRefresher,
  IonRefresherContent,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonIcon,
  IonFab,
  IonFabButton,
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import { heart, heartOutline, listOutline, searchOutline, alertCircleOutline, arrowUpOutline } from 'ionicons/icons';

import type { PokemonListItem, PokemonType } from '../../core/models/pokemon.model';
import { PokemonStoreService } from '../../core/services/pokemon-store.service';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';
import { PokemonCardComponent } from '../../shared/components/pokemon-card/pokemon-card.component';
import { SkeletonGridComponent } from '../../shared/components/skeleton-grid/skeleton-grid.component';
import { TypeFilterComponent } from '../../shared/components/type-filter/type-filter.component';

@Component({
  selector: 'app-pokemon-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonSearchbar,
    IonRefresher,
    IonRefresherContent,
    IonInfiniteScroll,
    IonInfiniteScrollContent,
    IonIcon,
    IonFab,
    IonFabButton,
    PokemonCardComponent,
    TypeFilterComponent,
    SkeletonGridComponent,
    EmptyStateComponent,
  ],
  templateUrl: './pokemon-list.page.html',
  styleUrls: ['./pokemon-list.page.scss'],
})
export class PokemonListPage implements OnInit, ViewDidEnter {
  @ViewChild('content', { static: false }) content?: IonContent;

  readonly store = inject(PokemonStoreService);
  readonly showBackToTop = signal<boolean>(false);

  constructor() {
    addIcons({
      heart,
      heartOutline,
      listOutline,
      searchOutline,
      alertCircleOutline,
      arrowUpOutline,
    });
  }

  ngOnInit(): void {
    this.store.loadInitial();
  }

  ionViewDidEnter(): void {
    // Reset scroll position to top when entering view / switching tabs
    this.scrollToTop(150);
  }

  onContentScroll(event: CustomEvent): void {
    const scrollTop = event.detail.scrollTop ?? 0;
    this.showBackToTop.set(scrollTop > 400);
  }

  scrollToTop(duration = 300): void {
    this.content?.scrollToTop(duration);
  }

  onSearchChange(event: CustomEvent): void {
    const val = (event.detail.value ?? '') as string;
    this.store.setSearchQuery(val);
    this.scrollToTop(200);
  }

  async onTypeSelected(type: PokemonType | null): Promise<void> {
    this.scrollToTop(200);
    await this.store.setSelectedType(type);
  }

  async handleRefresh(event: CustomEvent): Promise<void> {
    try {
      await this.store.refresh();
    } finally {
      (event.target as HTMLIonRefresherElement).complete();
    }
  }

  async loadMoreData(event: CustomEvent): Promise<void> {
    const scrollEl = event.target as HTMLIonInfiniteScrollElement;
    try {
      await this.store.loadMore();
      if (!this.store.hasMore()) {
        scrollEl.disabled = true;
      }
    } finally {
      scrollEl.complete();
    }
  }

  async onFavoriteToggle(item: PokemonListItem): Promise<void> {
    await this.store.toggleFavorite(item);
  }

  resetFilters(): void {
    this.store.setSearchQuery('');
    this.store.setSelectedType(null);
    this.scrollToTop(200);
  }
}
