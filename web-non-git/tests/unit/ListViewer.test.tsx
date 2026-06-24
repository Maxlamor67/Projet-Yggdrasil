import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import ListViewer from '@/components/ListViewer';
import { describe, it, expect, vi } from 'vitest';

type MockItem = {
    id: number;
    name: string;
    team: string;
};

const mockItems: MockItem[] = [
    { id: 1, name: 'Item 1', team: 'Équipe A' },
    { id: 2, name: 'Item 2', team: 'Équipe B' },
    { id: 3, name: 'Item 3', team: 'Équipe A' },
];

describe('ListViewer', () => {
    it('affiche le titre fourni', () => {
        render(
            <ListViewer
                items={mockItems}
                getId={(item) => item.id}
                getLabel={(item) => item.name}
                title="Mes éléments"
            />
        );

        expect(screen.getByText('Mes éléments')).toBeInTheDocument();
    });

    it('affiche tous les éléments sans filtre', () => {
        render(
            <ListViewer
                items={mockItems}
                getId={(item) => item.id}
                getLabel={(item) => item.name}
            />
        );

        expect(screen.getByText('Item 1')).toBeInTheDocument();
        expect(screen.getByText('Item 2')).toBeInTheDocument();
        expect(screen.getByText('Item 3')).toBeInTheDocument();
    });

    it('cache les avatars quand showAvatar est false', () => {
        render(
            <ListViewer
                items={mockItems}
                getId={(item) => item.id}
                getLabel={(item) => item.name}
                showAvatar={false}
            />
        );

        expect(screen.queryByText('IT')).not.toBeInTheDocument();
    });

    it('utilise getAvatarLetters quand fourni', () => {
        render(
            <ListViewer
                items={mockItems}
                getId={(item) => item.id}
                getLabel={(item) => item.name}
                getAvatarLetters={(item) => `#${item.id}`}
            />
        );

        expect(screen.getByText('#1')).toBeInTheDocument();
    });

    it('appelle onAdd lors du clic sur le bouton Ajouter', async () => {
        const user = userEvent.setup();
        const onAdd = vi.fn();

        render(
            <ListViewer
                items={mockItems}
                getId={(item) => item.id}
                getLabel={(item) => item.name}
                onAdd={onAdd}
            />
        );

        await user.click(screen.getByText('Ajouter'));
        expect(onAdd).toHaveBeenCalledTimes(1);
    });

    it('n\'affiche pas les boutons edit/delete si callbacks absents', () => {
        render(
            <ListViewer
                items={mockItems}
                getId={(item) => item.id}
                getLabel={(item) => item.name}
            />
        );

        const buttons = screen.queryAllByRole('button');
        expect(buttons).toHaveLength(1);
    });

    it('applique la className personnalisée', () => {
        const { container } = render(
            <ListViewer
                items={mockItems}
                getId={(item) => item.id}
                getLabel={(item) => item.name}
                className="custom-class"
            />
        );

        expect(container.firstChild).toHaveClass('custom-class');
    });
});
