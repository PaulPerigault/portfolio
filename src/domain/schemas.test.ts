import { describe, expect, it } from '@effect/vitest';
import { Either, Schema } from 'effect';
import { Certification } from './certification';
import { Formation } from './formation';
import { Lang } from './lang';
import { YearMonth } from './year-month';

const decode = <A, I>(schema: Schema.Schema<A, I>) => Schema.decodeUnknownEither(schema);

describe('YearMonth', () => {
  it('accepte YYYY-MM', () => {
    expect(Either.isRight(decode(YearMonth)('2024-09'))).toBe(true);
  });

  it.each(['2024-13', '2024-00', '24-09', '2024-9', '2024-09-01', ''])('refuse %s', (value) => {
    expect(Either.isLeft(decode(YearMonth)(value))).toBe(true);
  });
});

describe('Lang', () => {
  it('ne connaît que fr et en', () => {
    expect(Either.isRight(decode(Lang)('fr'))).toBe(true);
    expect(Either.isLeft(decode(Lang)('de'))).toBe(true);
  });
});

describe('Certification', () => {
  const base = {
    id: 'aws-clf-c02',
    name: 'AWS Certified Cloud Practitioner',
    issuer: 'Amazon Web Services',
    status: 'achieved',
    date: '2026-11-18',
  };

  it('accepte une obtenue datée et une planifiée sans date', () => {
    expect(Either.isRight(decode(Certification)(base))).toBe(true);
    const planned = { ...base, status: 'planned', date: undefined };
    expect(Either.isRight(decode(Certification)(planned))).toBe(true);
  });

  it('refuse une obtenue sans date', () => {
    expect(Either.isLeft(decode(Certification)({ ...base, date: undefined }))).toBe(true);
  });

  it.each(['nov 2024', '2026-02-30', '2026-13', '2026-11-1'])('refuse la date %s', (date) => {
    expect(Either.isLeft(decode(Certification)({ ...base, date }))).toBe(true);
  });

  it.each(['http://credly.com/b', 'javascript:alert(1)', '//credly.com/b'])(
    'refuse le lien %s',
    (verifyUrl) => {
      expect(Either.isLeft(decode(Certification)({ ...base, verifyUrl }))).toBe(true);
    },
  );

  it('refuse un emblème hors du jeu fermé du paquet 3D', () => {
    expect(Either.isLeft(decode(Certification)({ ...base, emblem: 'medal' }))).toBe(true);
  });
});

describe('Formation', () => {
  it('exige les deux dates', () => {
    const partial = { id: 'x', school: 's', degree: 'd', speciality: 'p', description: 'x' };
    expect(Either.isLeft(decode(Formation)({ ...partial, dateStart: '2024-09' }))).toBe(true);
  });
});
