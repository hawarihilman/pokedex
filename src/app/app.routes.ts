import type { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'tabs',
    loadComponent: () => import('./features/tabs/tabs.page').then((m) => m.TabsPage),
    children: [
      {
        path: 'list',
        loadComponent: () => import('./features/pokemon-list/pokemon-list.page').then((m) => m.PokemonListPage),
      },
      {
        path: 'favorites',
        loadComponent: () =>
          import('./features/pokemon-favorites/pokemon-favorites.page').then((m) => m.PokemonFavoritesPage),
      },
      {
        path: '',
        redirectTo: 'list',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: 'pokemon/:id',
    loadComponent: () => import('./features/pokemon-detail/pokemon-detail.page').then((m) => m.PokemonDetailPage),
  },
  {
    path: '',
    redirectTo: '/tabs/list',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: '/tabs/list',
  },
];
