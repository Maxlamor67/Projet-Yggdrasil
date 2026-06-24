import { render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import SearchBar from '@/components/SearchBar';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { SearchResult } from 'leaflet-geosearch/lib/providers/provider.js';
import type { LocalRawResult } from '@/providers/LocalAddressProvider';

const mockSearch = vi.fn();

vi.mock('@/providers/LocalAddressProvider', () => {
    return {
        default: vi.fn().mockImplementation(() => ({
            search: mockSearch,
        })),
    };
});

const mockSearchResults: SearchResult<LocalRawResult>[] = [
    {
        x: 7.7521,
        y: 48.5734,
        label: '1 Rue de la Paix, Strasbourg',
        bounds: null,
        raw: {
            place_id: 1,
            lat: '48.5734',
            lon: '7.7521',
            display_name: '1 Rue de la Paix, Strasbourg, France',
        },
    },
    {
        x: 7.7500,
        y: 48.5800,
        label: '10 Avenue de la Liberté, Strasbourg',
        bounds: null,
        raw: {
            place_id: 2,
            lat: '48.5800',
            lon: '7.7500',
            display_name: '10 Avenue de la Liberté, Strasbourg, France',
        },
    },
];

describe('SearchBar', () => {
    const mockSetSearchPosition = vi.fn();
    let mockProvider: any;

    beforeEach( async () => {
        vi.clearAllMocks();
        const LocalAddressProvider = vi.mocked(
            await import('@/providers/LocalAddressProvider')
        ).default;
        mockProvider = new LocalAddressProvider('');
    });

    it('affiche le placeholder correct', () => {
        render(
            <SearchBar
                searchPosition={null}
                setSearchPosition={mockSetSearchPosition}
            />
        );

        expect(
            screen.getByPlaceholderText('Entrez une adresse')
        ).toBeInTheDocument();
    });

    it('met à jour la valeur lors de la saisie', async () => {
        const user = userEvent.setup();

        render(
            <SearchBar
                searchPosition={null}
                setSearchPosition={mockSetSearchPosition}
            />
        );

        const input = screen.getByPlaceholderText('Entrez une adresse');
        await user.type(input, 'Rue de la Paix');

        expect(input).toHaveValue('Rue de la Paix');
    });

    it('affiche le bouton Rechercher quand aucune position sélectionnée', () => {
        render(
            <SearchBar
                searchPosition={null}
                setSearchPosition={mockSetSearchPosition}
            />
        );

        expect(screen.getByText('Rechercher')).toBeInTheDocument();
        expect(screen.queryByText('Annuler')).not.toBeInTheDocument();
    });

    it('affiche le bouton Annuler quand une position est sélectionnée', () => {
        render(
            <SearchBar
                searchPosition={[48.5734, 7.7521]}
                setSearchPosition={mockSetSearchPosition}
            />
        );

        expect(screen.getByText('Annuler')).toBeInTheDocument();
        expect(screen.queryByText('Rechercher')).not.toBeInTheDocument();
    });

    it('appelle setSearchPosition(null) lors du clic sur Annuler', async () => {
        const user = userEvent.setup();

        render(
            <SearchBar
                searchPosition={[48.5734, 7.7521]}
                setSearchPosition={mockSetSearchPosition}
            />
        );

        await user.click(screen.getByText('Annuler'));

        expect(mockSetSearchPosition).toHaveBeenCalledWith(null);
    });

    it('affiche les résultats de recherche après soumission', async () => {
        const user = userEvent.setup();
        mockProvider.search.mockResolvedValue(mockSearchResults);

        render(
            <SearchBar
                searchPosition={null}
                setSearchPosition={mockSetSearchPosition}
            />
        );

        const input = screen.getByPlaceholderText('Entrez une adresse');
        await user.type(input, 'Rue de la Paix');
        await user.click(screen.getByText('Rechercher'));

        await waitFor(() => {
            expect(
                screen.getByText('1 Rue de la Paix, Strasbourg, France')
            ).toBeInTheDocument();
            expect(
                screen.getByText('10 Avenue de la Liberté, Strasbourg, France')
            ).toBeInTheDocument();
        });
    });

    it('sélectionne une adresse et met à jour la position', async () => {
        const user = userEvent.setup();
        mockProvider.search.mockResolvedValue(mockSearchResults);

        render(
            <SearchBar
                searchPosition={null}
                setSearchPosition={mockSetSearchPosition}
            />
        );

        const input = screen.getByPlaceholderText('Entrez une adresse');
        await user.type(input, 'Rue de la Paix');
        await user.click(screen.getByText('Rechercher'));

        await waitFor(() => {
            expect(
                screen.getByText('1 Rue de la Paix, Strasbourg, France')
            ).toBeInTheDocument();
        });

        await user.click(
            screen.getByText('1 Rue de la Paix, Strasbourg, France')
        );

        expect(mockSetSearchPosition).toHaveBeenCalledWith([48.5734, 7.7521]);
    });

    it('vide les résultats et le champ après sélection', async () => {
        const user = userEvent.setup();
        mockProvider.search.mockResolvedValue(mockSearchResults);

        render(
            <SearchBar
                searchPosition={null}
                setSearchPosition={mockSetSearchPosition}
            />
        );

        const input = screen.getByPlaceholderText('Entrez une adresse');
        await user.type(input, 'Rue de la Paix');
        await user.click(screen.getByText('Rechercher'));

        await waitFor(() => {
            expect(
                screen.getByText('1 Rue de la Paix, Strasbourg, France')
            ).toBeInTheDocument();
        });

        await user.click(
            screen.getByText('1 Rue de la Paix, Strasbourg, France')
        );

        expect(input).toHaveValue('');
        expect(
            screen.queryByText('1 Rue de la Paix, Strasbourg, France')
        ).not.toBeInTheDocument();
    });
});
