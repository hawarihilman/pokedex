import { TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach } from 'vitest';

import { StorageService } from './storage.service';

describe('StorageService', () => {
  let service: StorageService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [StorageService],
    });
    service = TestBed.inject(StorageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return defaultValue if key does not exist', () => {
    const result = service.get('non_existent_key', [1, 2, 3]);
    expect(result).toEqual([1, 2, 3]);
  });

  it('should store and retrieve data correctly', () => {
    service.set('test_key', { name: 'Pikachu', id: 25 });
    const result = service.get<{ name: string; id: number } | null>('test_key', null);
    expect(result).toEqual({ name: 'Pikachu', id: 25 });
  });

  it('should remove data correctly', () => {
    service.set('key_to_remove', 'hello');
    expect(service.get('key_to_remove', '')).toBe('hello');

    service.remove('key_to_remove');
    expect(service.get('key_to_remove', 'fallback')).toBe('fallback');
  });

  it('should handle invalid JSON in localStorage gracefully', () => {
    localStorage.setItem('corrupted_key', '{invalid-json');
    const result = service.get('corrupted_key', 'fallback_value');
    expect(result).toBe('fallback_value');
  });
});
