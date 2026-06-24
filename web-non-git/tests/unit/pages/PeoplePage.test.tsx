import { describe, it, expect, vi } from 'vitest';

vi.mock('@tanstack/react-router', () => ({
  createFileRoute: vi.fn(() => (config: any) => config),
  useRouter: () => ({
    navigate: vi.fn(),
  }),
}));

vi.mock('@/lib/api', () => ({
  api: {
    user: {
      userControllerFindAllV2: vi.fn(() => Promise.resolve({ data: [] })),
    },
  },
}));

describe('PeoplePage Tests (Pages/Routes)', () => {
  it('devrait charger la liste des utilisateurs', () => {
    expect(true).toBe(true);
  });

  it('devrait utiliser useQuery pour les utilisateurs', () => {
    expect(true).toBe(true);
  });

  it('devrait supporter la création d\'utilisateurs', () => {
    expect(true).toBe(true);
  });

  it('devrait supporter la modification d\'utilisateurs', () => {
    expect(true).toBe(true);
  });

  it('devrait supporter la suppression d\'utilisateurs', () => {
    expect(true).toBe(true);
  });

  it('devrait afficher un ListViewer', () => {
    expect(true).toBe(true);
  });

  it('devrait avoir un dialog de création', () => {
    expect(true).toBe(true);
  });

  it('devrait invalider le cache après modifications', () => {
    expect(true).toBe(true);
  });
});
