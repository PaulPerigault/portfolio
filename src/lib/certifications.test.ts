import { describe, expect, it } from 'vitest';
import type { Certification } from '@/domain/certification';
import { certificationLabel, toMilestones } from './certifications';

const planned = {
  id: 'saa',
  name: 'Solutions Architect',
  issuer: 'AWS',
  status: 'planned',
} as const;
const achieved = {
  id: 'clf',
  name: 'Cloud Practitioner',
  issuer: 'AWS',
  code: 'CLF-C02',
  status: 'achieved',
  date: '2026-11-18',
  verifyUrl: 'https://example.org/badge',
  emblem: 'check',
} as Certification;

describe('toMilestones', () => {
  it('ordonne par date, sans date en dernier, et reprend les champs du paquet', () => {
    const [first, second] = toMilestones([planned as Certification, achieved]);
    expect(first).toEqual({
      id: 'clf',
      label: 'Cloud Practitioner (CLF-C02)',
      status: 'achieved',
      group: 'AWS',
      date: '2026-11-18',
      href: 'https://example.org/badge',
      emblem: 'check',
    });
    expect(second).toEqual({
      id: 'saa',
      label: 'Solutions Architect',
      status: 'planned',
      group: 'AWS',
    });
  });

  it('omet les champs absents plutôt que de les mettre à undefined', () => {
    expect(Object.keys(toMilestones([planned as Certification])[0] ?? {})).not.toContain('date');
  });
});

describe('certificationLabel', () => {
  it('ajoute le code entre parenthèses quand il existe', () => {
    expect(certificationLabel(achieved)).toBe('Cloud Practitioner (CLF-C02)');
    expect(certificationLabel(planned as Certification)).toBe('Solutions Architect');
  });
});
