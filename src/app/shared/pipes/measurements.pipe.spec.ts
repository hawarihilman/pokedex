import { describe, it, expect } from 'vitest';

import { DecimeterToMPipe, HectogramToKgPipe } from './measurements.pipe';
import { PokemonIdPipe } from './pokemon-id.pipe';

describe('Shared Pipes', () => {
  describe('PokemonIdPipe', () => {
    const pipe = new PokemonIdPipe();

    it('should format numbers to 4 digits prefixed with #', () => {
      expect(pipe.transform(1)).toBe('#0001');
      expect(pipe.transform(25)).toBe('#0025');
      expect(pipe.transform(151)).toBe('#0151');
      expect(pipe.transform(1025)).toBe('#1025');
    });

    it('should format numeric strings', () => {
      expect(pipe.transform('7')).toBe('#0007');
    });

    it('should handle null or undefined', () => {
      expect(pipe.transform(null)).toBe('#0000');
      expect(pipe.transform(undefined)).toBe('#0000');
    });
  });

  describe('DecimeterToMPipe', () => {
    const pipe = new DecimeterToMPipe();

    it('should convert decimeters to meters and feet/inches', () => {
      expect(pipe.transform(7)).toBe('0.7 m (2\'4")');
      expect(pipe.transform(17)).toBe('1.7 m (5\'7")');
    });

    it('should handle null/undefined', () => {
      expect(pipe.transform(null)).toBe('0.0 m');
    });
  });

  describe('HectogramToKgPipe', () => {
    const pipe = new HectogramToKgPipe();

    it('should convert hectograms to kilograms and pounds', () => {
      expect(pipe.transform(69)).toBe('6.9 kg (15.2 lbs)');
      expect(pipe.transform(905)).toBe('90.5 kg (199.5 lbs)');
    });

    it('should handle null/undefined', () => {
      expect(pipe.transform(null)).toBe('0.0 kg');
    });
  });
});
