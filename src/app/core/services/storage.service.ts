import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  private isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
  }

  get<T>(key: string, defaultValue: T): T {
    if (!this.isBrowser()) {
      return defaultValue;
    }
    try {
      const item = localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : defaultValue;
    } catch (error) {
      console.warn(`[StorageService] Error reading key "${key}":`, error);
      return defaultValue;
    }
  }

  set<T>(key: string, value: T): void {
    if (!this.isBrowser()) {
      return;
    }
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.warn(`[StorageService] Error writing key "${key}":`, error);
    }
  }

  remove(key: string): void {
    if (!this.isBrowser()) {
      return;
    }
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.warn(`[StorageService] Error removing key "${key}":`, error);
    }
  }
}
