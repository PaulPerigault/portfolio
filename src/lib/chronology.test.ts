import { describe, expect, it } from 'vitest';
import { certificationsInOrder, newestFirst } from './chronology';

const item = (id: string, dateStart: string, dateEnd: string | null) => ({
  id,
  dateStart,
  dateEnd,
});
const ids = (items: readonly { id: string }[]) => items.map(({ id }) => id);

describe('newestFirst', () => {
  it('place la période en cours en tête, puis trie par fin décroissante', () => {
    const sorted = newestFirst([
      item('42', '2022-08', '2022-08'),
      item('patounes', '2022-01', '2022-12'),
      item('wevii', '2023-09', null),
    ]);
    expect(ids(sorted)).toEqual(['wevii', 'patounes', '42']);
  });

  it('départage à fin égale par début décroissant', () => {
    const sorted = newestFirst([item('a', '2020-01', '2022-06'), item('b', '2021-01', '2022-06')]);
    expect(ids(sorted)).toEqual(['b', 'a']);
  });

  it("ne modifie pas le tableau d'origine", () => {
    const original = [item('a', '2020-01', '2020-02'), item('b', '2021-01', null)];
    newestFirst(original);
    expect(ids(original)).toEqual(['a', 'b']);
  });
});

describe('certificationsInOrder', () => {
  it('trie par date croissante, mois avant jour, et met les certifications sans date en dernier', () => {
    const sorted = certificationsInOrder([
      { id: 'saa' },
      { id: 'aif', date: '2026-12-02' },
      { id: 'clf', date: '2026-11-18' },
      { id: 'cdl', date: '2024-11' },
    ]);
    expect(ids(sorted)).toEqual(['cdl', 'clf', 'aif', 'saa']);
  });
});
