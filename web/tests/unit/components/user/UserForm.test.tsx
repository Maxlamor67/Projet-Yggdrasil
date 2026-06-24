import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import UserForm from '@/components/user/UserForm';
import type { UserFormData } from '@/components/user/UserForm';

describe('UserForm', () => {
  it('devrait afficher le champ nom', () => {
    const onSubmit = vi.fn();
    render(
      <UserForm mode="create" initialState={null} onSubmit={onSubmit} />
    );

    expect(screen.getByLabelText(/Nom/i)).toBeInTheDocument();
  });

  it('devrait afficher le champ email', () => {
    const onSubmit = vi.fn();
    render(
      <UserForm mode="create" initialState={null} onSubmit={onSubmit} />
    );

    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
  });

  it('devrait afficher le champ téléphone', () => {
    const onSubmit = vi.fn();
    render(
      <UserForm mode="create" initialState={null} onSubmit={onSubmit} />
    );

    expect(screen.getByLabelText(/Téléphone/i)).toBeInTheDocument();
  });

  it('devrait afficher le placeholder pour le nom', () => {
    const onSubmit = vi.fn();
    render(
      <UserForm mode="create" initialState={null} onSubmit={onSubmit} />
    );

    const nameInput = screen.getByPlaceholderText('John Doe');
    expect(nameInput).toBeInTheDocument();
  });

  it('devrait afficher le placeholder pour l\'email', () => {
    const onSubmit = vi.fn();
    render(
      <UserForm mode="create" initialState={null} onSubmit={onSubmit} />
    );

    const emailInput = screen.getByPlaceholderText('john@email.com');
    expect(emailInput).toBeInTheDocument();
  });

  it('devrait afficher le placeholder pour le téléphone', () => {
    const onSubmit = vi.fn();
    render(
      <UserForm mode="create" initialState={null} onSubmit={onSubmit} />
    );

    const phoneInput = screen.getByPlaceholderText('06 12 34 56 78');
    expect(phoneInput).toBeInTheDocument();
  });

  it('devrait remplir le formulaire en mode edit', () => {
    const onSubmit = vi.fn();
    const initialState: UserFormData = {
      name: 'Alice',
      email: 'alice@example.com',
      phone: '06 12 34 56 78',
    };

    render(
      <UserForm mode="edit" initialState={initialState} onSubmit={onSubmit} />
    );

    const nameInput = screen.getByDisplayValue('Alice');
    const emailInput = screen.getByDisplayValue('alice@example.com');
    const phoneInput = screen.getByDisplayValue('06 12 34 56 78');

    expect(nameInput).toBeInTheDocument();
    expect(emailInput).toBeInTheDocument();
    expect(phoneInput).toBeInTheDocument();
  });

  it('devrait appeler onSubmit avec les bonnes données', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();

    render(
      <UserForm mode="create" initialState={null} onSubmit={onSubmit} />
    );

    const nameInput = screen.getByLabelText(/Nom/i) as HTMLInputElement;
    const emailInput = screen.getByLabelText(/Email/i) as HTMLInputElement;
    const phoneInput = screen.getByLabelText(/Téléphone/i) as HTMLInputElement;

    await user.type(nameInput, 'Bob');
    await user.type(emailInput, 'bob@example.com');
    await user.type(phoneInput, '07 98 76 54 32');

    const submitButton = screen.getByRole('button');
    await user.click(submitButton);

    expect(onSubmit).toHaveBeenCalledWith({
      name: 'Bob',
      email: 'bob@example.com',
      phone: '07 98 76 54 32',
    });
  });

  it('devrait rendre le form sans erreur', () => {
    const onSubmit = vi.fn();
    const { container } = render(
      <UserForm mode="create" initialState={null} onSubmit={onSubmit} />
    );

    expect(container.querySelector('form')).toBeInTheDocument();
  });

  it('devrait avoir les labels correctes', () => {
    const onSubmit = vi.fn();
    render(
      <UserForm mode="create" initialState={null} onSubmit={onSubmit} />
    );

    expect(screen.getByText(/Nom$/)).toBeInTheDocument();
    expect(screen.getByText(/Email$/)).toBeInTheDocument();
    expect(screen.getByText(/Téléphone/)).toBeInTheDocument();
  });

  it('devrait afficher un bouton de soumission', () => {
    const onSubmit = vi.fn();
    render(
      <UserForm mode="create" initialState={null} onSubmit={onSubmit} />
    );

    const submitButton = screen.getByRole('button');
    expect(submitButton).toBeInTheDocument();
  });

  it('devrait traiter le téléphone comme optionnel', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();

    render(
      <UserForm mode="create" initialState={null} onSubmit={onSubmit} />
    );

    const nameInput = screen.getByLabelText(/Nom/i);
    const emailInput = screen.getByLabelText(/Email/i);

    await user.type(nameInput, 'Charlie');
    await user.type(emailInput, 'charlie@example.com');

    const submitButton = screen.getByRole('button');
    await user.click(submitButton);

    expect(onSubmit).toHaveBeenCalledWith({
      name: 'Charlie',
      email: 'charlie@example.com',
      phone: undefined,
    });
  });

  it('devrait permettre de modifier le nom', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();

    render(
      <UserForm mode="create" initialState={null} onSubmit={onSubmit} />
    );

    const nameInput = screen.getByLabelText(/Nom/i) as HTMLInputElement;

    await user.clear(nameInput);
    await user.type(nameInput, 'David');

    expect(nameInput.value).toBe('David');
  });
});
