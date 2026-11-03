import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel, IonBadge } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { heart, listOutline } from 'ionicons/icons';

import { PokemonStoreService } from '../../core/services/pokemon-store.service';

@Component({
  selector: 'app-tabs',
  standalone: true,
  imports: [CommonModule, IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel, IonBadge],
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss'],
})
export class TabsPage {
  readonly store = inject(PokemonStoreService);

  constructor() {
    addIcons({ heart, listOutline });
  }

  onTabChange(_event: { tab: string }): void {
    // When tab changes, find active ion-content and ensure it resets scroll to top
    const activeContent = document.querySelector(`ion-content`) as HTMLIonContentElement | null;
    activeContent?.scrollToTop(200);
  }
}
