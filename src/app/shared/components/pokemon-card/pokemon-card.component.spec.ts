import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { describe, it, expect, vi } from 'vitest';

import type { PokemonListItem } from '../../../core/models/pokemon.model';

import { PokemonCardComponent } from './pokemon-card.component';

describe('PokemonCardComponent', () => {
  let component: PokemonCardComponent;
  let fixture: ComponentFixture<PokemonCardComponent>;

  const mockPokemon: PokemonListItem = {
    id: 25,
    name: 'Pikachu',
    formattedId: '#0025',
    imageUrl: 'https://example.com/25.png',
    types: ['electric'],
    primaryType: 'electric',
    isFavorite: false,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PokemonCardComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(PokemonCardComponent);
    component = fixture.componentInstance;
    component.pokemon = mockPokemon;
    fixture.detectChanges();
  });

  it('should create and render pokemon details', () => {
    expect(component).toBeTruthy();
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('.pokemon-name')?.textContent).toBe('Pikachu');
    expect(el.querySelector('.pokemon-id')?.textContent).toBe('#0025');
  });

  it('should emit favoriteToggled event and prevent event bubbling on click', () => {
    const spy = vi.spyOn(component.favoriteToggled, 'emit');
    const stopPropagationSpy = vi.fn();
    const preventDefaultSpy = vi.fn();

    const mockEvent = {
      stopPropagation: stopPropagationSpy,
      preventDefault: preventDefaultSpy,
    } as unknown as Event;

    component.onToggleFavorite(mockEvent);

    expect(spy).toHaveBeenCalledWith(mockPokemon);
    expect(stopPropagationSpy).toHaveBeenCalled();
    expect(preventDefaultSpy).toHaveBeenCalled();
  });

  it('should switch to fallback image on image load error', () => {
    component.onImageError();
    expect(component.pokemon.imageUrl).toContain('sprites/pokemon/25.png');
  });
});
