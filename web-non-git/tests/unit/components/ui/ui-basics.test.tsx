import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

describe('UI Components - Basic', () => {
  describe('Button', () => {
    it('devrait rendre un bouton', () => {
      const { getByText } = render(<Button>Click me</Button>);
      expect(getByText('Click me')).toBeInTheDocument();
    });

    it('devrait supporter les variantes', () => {
      const { getByText } = render(<Button variant="outline">Outline</Button>);
      expect(getByText('Outline')).toBeInTheDocument();
    });

    it('devrait supporter les sizes', () => {
      const { getByText } = render(<Button size="lg">Large</Button>);
      expect(getByText('Large')).toBeInTheDocument();
    });

    it('devrait être désactivable', () => {
      const { getByText } = render(<Button disabled>Disabled</Button>);
      expect(getByText('Disabled')).toBeDisabled();
    });
  });

  describe('Input', () => {
    it('devrait rendre un input', () => {
      const { container } = render(<Input placeholder="Enter text" />);
      const input = container.querySelector('input');
      expect(input).toBeInTheDocument();
      expect(input).toHaveAttribute('placeholder', 'Enter text');
    });

    it('devrait avoir un type configurable', () => {
      const { container } = render(<Input type="email" />);
      const input = container.querySelector('input');
      expect(input).toHaveAttribute('type', 'email');
    });

    it('devrait supporter disabled', () => {
      const { container } = render(<Input disabled />);
      const input = container.querySelector('input');
      expect(input).toBeDisabled();
    });
  });

  describe('Label', () => {
    it('devrait rendre un label', () => {
      const { getByText } = render(<Label>Username</Label>);
      expect(getByText('Username')).toBeInTheDocument();
    });

    it('devrait être un élément label valide', () => {
      const { container } = render(<Label>User</Label>);
      expect(container.querySelector('label')).toBeInTheDocument();
    });
  });

  describe('Card', () => {
    it('devrait rendre une card', () => {
      const { getByText } = render(
        <Card>
          <CardHeader>
            <CardTitle>Title</CardTitle>
          </CardHeader>
          <CardContent>Content</CardContent>
        </Card>
      );
      expect(getByText('Title')).toBeInTheDocument();
      expect(getByText('Content')).toBeInTheDocument();
    });

    it('devrait supporter CardDescription', () => {
      const { getByText } = render(
        <Card>
          <CardHeader>
            <CardTitle>Title</CardTitle>
            <CardDescription>Description</CardDescription>
          </CardHeader>
        </Card>
      );
      expect(getByText('Description')).toBeInTheDocument();
    });
  });

  describe('Badge', () => {
    it('devrait rendre un badge', () => {
      const { getByText } = render(<Badge>New</Badge>);
      expect(getByText('New')).toBeInTheDocument();
    });

    it('devrait supporter les variantes', () => {
      const { getByText } = render(<Badge variant="secondary">Secondary</Badge>);
      expect(getByText('Secondary')).toBeInTheDocument();
    });
  });
});
