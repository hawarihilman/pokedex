import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { describe, it, expect } from 'vitest';

import { TypeBadgeComponent } from './type-badge.component';

describe('TypeBadgeComponent', () => {
  let component: TypeBadgeComponent;
  let fixture: ComponentFixture<TypeBadgeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TypeBadgeComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TypeBadgeComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    component.type = 'fire';
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should display the correct type label and badge styling', () => {
    component.type = 'electric';
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const badge = compiled.querySelector('.type-badge');
    expect(badge?.textContent?.trim()).toBe('electric');
    expect(component.meta().color).toBe('#E8AB00');
  });
});
