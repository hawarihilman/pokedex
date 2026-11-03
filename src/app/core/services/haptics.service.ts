import { Injectable } from '@angular/core';
import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics';

@Injectable({
  providedIn: 'root',
})
export class HapticsService {
  async impactLight(): Promise<void> {
    try {
      await Haptics.impact({ style: ImpactStyle.Light });
    } catch {
      // Graceful degradation when running on desktop or unsupported web
    }
  }

  async impactMedium(): Promise<void> {
    try {
      await Haptics.impact({ style: ImpactStyle.Medium });
    } catch {
      // Graceful degradation
    }
  }

  async notificationSuccess(): Promise<void> {
    try {
      await Haptics.notification({ type: NotificationType.Success });
    } catch {
      // Graceful degradation
    }
  }

  async selectionChanged(): Promise<void> {
    try {
      await Haptics.selectionChanged();
    } catch {
      // Graceful degradation
    }
  }
}
