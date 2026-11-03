import { CommonModule } from '@angular/common';
import type { OnInit } from '@angular/core';
import { Component, Input, ViewChild, computed, inject, signal } from '@angular/core';
import type { ViewDidEnter } from '@ionic/angular';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonBackButton,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonIcon,
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import { heart, heartOutline, sparkles, volumeHigh, volumeMediumOutline, alertCircleOutline } from 'ionicons/icons';
import { firstValueFrom } from 'rxjs';

import { POKEMON_TYPE_METAS } from '../../core/constants/pokemon-types.constant';
import type { PokemonDetail } from '../../core/models/pokemon.model';
import { PokemonApiService } from '../../core/services/pokemon-api.service';
import { PokemonStoreService } from '../../core/services/pokemon-store.service';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';
import { StatBarComponent } from '../../shared/components/stat-bar/stat-bar.component';
import { TypeBadgeComponent } from '../../shared/components/type-badge/type-badge.component';
import { DecimeterToMPipe, HectogramToKgPipe } from '../../shared/pipes/measurements.pipe';

@Component({
  selector: 'app-pokemon-detail',
  standalone: true,
  imports: [
    CommonModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButtons,
    IonBackButton,
    IonSegment,
    IonSegmentButton,
    IonLabel,
    IonIcon,
    TypeBadgeComponent,
    StatBarComponent,
    EmptyStateComponent,
    DecimeterToMPipe,
    HectogramToKgPipe,
  ],
  templateUrl: './pokemon-detail.page.html',
  styleUrls: ['./pokemon-detail.page.scss'],
})
export class PokemonDetailPage implements OnInit, ViewDidEnter {
  @ViewChild('content', { static: false }) content?: IonContent;
  @Input() id!: string;

  private readonly api = inject(PokemonApiService);
  private readonly store = inject(PokemonStoreService);

  readonly pokemon = signal<PokemonDetail | null>(null);
  readonly isLoading = signal<boolean>(true);
  readonly error = signal<string | null>(null);
  readonly isShiny = signal<boolean>(false);
  readonly isPlayingCry = signal<boolean>(false);
  readonly activeTab = signal<'about' | 'stats' | 'sprites'>('about');

  private currentAudio: HTMLAudioElement | null = null;

  ionViewDidEnter(): void {
    this.content?.scrollToTop(0);
  }

  readonly isFavorite = computed(() => {
    const p = this.pokemon();
    return p ? this.store.isFavorite(p.id) : false;
  });

  readonly primaryTypeColor = computed(() => {
    const p = this.pokemon();
    if (!p) return '#3182CE';
    return POKEMON_TYPE_METAS[p.primaryType]?.color ?? '#3182CE';
  });

  readonly primaryTypeBg = computed(() => {
    const p = this.pokemon();
    if (!p) return '#EDF2F7';
    return POKEMON_TYPE_METAS[p.primaryType]?.backgroundColor ?? '#EDF2F7';
  });

  readonly currentArtwork = computed(() => {
    const p = this.pokemon();
    if (!p) return '';
    if (this.isShiny()) {
      return p.sprites.officialArtworkShiny || p.sprites.frontShiny || p.sprites.officialArtwork;
    }
    return p.sprites.officialArtwork;
  });

  constructor() {
    addIcons({
      heart,
      heartOutline,
      sparkles,
      volumeHigh,
      volumeMediumOutline,
      alertCircleOutline,
    });
  }

  ngOnInit(): void {
    if (this.id) {
      this.loadDetail();
    }
  }

  async loadDetail(): Promise<void> {
    this.isLoading.set(true);
    this.error.set(null);

    try {
      const detail = await firstValueFrom(this.api.getPokemonDetail(this.id));
      this.pokemon.set(detail);
    } catch (err) {
      console.error('[PokemonDetail] Failed to load pokemon detail:', err);
      this.error.set(`Unable to fetch data for Pokémon "${this.id}". Please check your connection.`);
    } finally {
      this.isLoading.set(false);
    }
  }

  toggleShiny(): void {
    this.isShiny.update((val) => !val);
  }

  async toggleFavorite(): Promise<void> {
    const p = this.pokemon();
    if (p) {
      await this.store.toggleFavorite(p);
    }
  }

  playCry(): void {
    const url = this.pokemon()?.cryUrl;
    if (!url) return;

    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio = null;
    }

    try {
      this.currentAudio = new Audio(url);
      this.isPlayingCry.set(true);

      this.currentAudio.onended = () => {
        this.isPlayingCry.set(false);
        this.currentAudio = null;
      };

      this.currentAudio.onerror = () => {
        this.isPlayingCry.set(false);
        this.currentAudio = null;
      };

      this.currentAudio.play().catch(() => {
        this.isPlayingCry.set(false);
      });
    } catch {
      this.isPlayingCry.set(false);
    }
  }

  onTabChange(event: CustomEvent): void {
    const val = event.detail.value as 'about' | 'stats' | 'sprites';
    this.activeTab.set(val);
  }
}
