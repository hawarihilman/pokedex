import type { HttpEvent, HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { HttpResponse } from '@angular/common/http';
import type { Observable } from 'rxjs';
import { of, tap } from 'rxjs';

interface CacheEntry {
  response: HttpResponse<unknown>;
  timestamp: number;
}

const cache = new Map<string, CacheEntry>();
const CACHE_TTL_MS = 1000 * 60 * 30; // 30 minutes cache for static PokeAPI data

export function cacheInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
  // Only cache GET requests destined for pokeapi.co
  if (req.method !== 'GET' || !req.url.includes('pokeapi.co')) {
    return next(req);
  }

  const cached = cache.get(req.urlWithParams);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return of(cached.response.clone());
  }

  return next(req).pipe(
    tap((event) => {
      if (event instanceof HttpResponse) {
        cache.set(req.urlWithParams, {
          response: event.clone(),
          timestamp: Date.now(),
        });
      }
    }),
  );
}

export function clearHttpCache(): void {
  cache.clear();
}
