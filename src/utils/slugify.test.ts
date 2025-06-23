import { slugify } from './slugify';

describe('slugify', () => {
  it('converts spaces and uppercase to lowercase hyphenated form', () => {
    expect(slugify('Hello World')).toBe('hello-world');
  });

  it('removes accents and special characters', () => {
    expect(slugify('Éléphant 3000!')).toBe('elephant-3000');
  });
});
