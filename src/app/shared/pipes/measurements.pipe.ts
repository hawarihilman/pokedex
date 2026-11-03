import type { PipeTransform } from '@angular/core';
import { Pipe } from '@angular/core';

@Pipe({
  name: 'decimeterToM',
  standalone: true,
})
export class DecimeterToMPipe implements PipeTransform {
  transform(value: number | null | undefined): string {
    if (value === null || value === undefined) return '0.0 m';
    const meters = (value / 10).toFixed(1);
    const totalInches = Math.round(value * 3.937);
    const feet = Math.floor(totalInches / 12);
    const inches = totalInches % 12;
    return `${meters} m (${feet}'${inches}")`;
  }
}

@Pipe({
  name: 'hectogramToKg',
  standalone: true,
})
export class HectogramToKgPipe implements PipeTransform {
  transform(value: number | null | undefined): string {
    if (value === null || value === undefined) return '0.0 kg';
    const kg = (value / 10).toFixed(1);
    const lbs = (value * 0.220462).toFixed(1);
    return `${kg} kg (${lbs} lbs)`;
  }
}
