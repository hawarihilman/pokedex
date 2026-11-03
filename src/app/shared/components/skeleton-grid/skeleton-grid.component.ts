import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { IonSkeletonText } from '@ionic/angular';

@Component({
  selector: 'app-skeleton-grid',
  standalone: true,
  imports: [CommonModule, IonSkeletonText],
  templateUrl: './skeleton-grid.component.html',
  styleUrls: ['./skeleton-grid.component.scss'],
})
export class SkeletonGridComponent {
  @Input() count = 12;

  get skeletonItems(): number[] {
    return Array.from({ length: this.count });
  }
}
