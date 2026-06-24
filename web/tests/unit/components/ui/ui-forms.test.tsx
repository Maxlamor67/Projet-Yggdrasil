import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Spinner } from '@/components/ui/spinner';
import { Separator } from '@/components/ui/separator';

describe('UI Components - Forms & Interactive', () => {
  describe('Checkbox', () => {
    it('devrait rendre une checkbox', () => {
      const { container } = render(<Checkbox />);
      expect(container.querySelector('[role="checkbox"]')).toBeInTheDocument();
    });

    it('devrait supporter checked state', () => {
      const { container } = render(<Checkbox checked />);
      expect(container.querySelector('[role="checkbox"]')).toHaveAttribute('data-state', 'checked');
    });

    it('devrait être désactivable', () => {
      const { container } = render(<Checkbox disabled />);
      expect(container.querySelector('[role="checkbox"]')).toBeDisabled();
    });
  });

  describe('Switch', () => {
    it('devrait rendre un switch', () => {
      const { container } = render(<Switch />);
      expect(container.querySelector('[role="switch"]')).toBeInTheDocument();
    });

    it('devrait supporter checked state', () => {
      const { container } = render(<Switch checked />);
      expect(container.querySelector('[role="switch"]')).toHaveAttribute('data-state', 'checked');
    });

    it('devrait être désactivable', () => {
      const { container } = render(<Switch disabled />);
      expect(container.querySelector('[role="switch"]')).toBeDisabled();
    });
  });

  describe('RadioGroup', () => {
    it('devrait rendre un groupe radio', () => {
      const { container } = render(
        <RadioGroup>
          <RadioGroupItem value="option1" id="option1" />
        </RadioGroup>
      );
      expect(container.querySelector('[role="radiogroup"]')).toBeInTheDocument();
    });

    it('devrait supporter la sélection', () => {
      const { container } = render(
        <RadioGroup defaultValue="option1">
          <RadioGroupItem value="option1" id="option1" />
          <RadioGroupItem value="option2" id="option2" />
        </RadioGroup>
      );
      expect(container.querySelector('[role="radiogroup"]')).toBeInTheDocument();
    });
  });

  describe('Spinner', () => {
    it('devrait rendre un spinner ou un élément de chargement', () => {
      const { container } = render(<Spinner />);
      expect(container).toBeInTheDocument();
    });

    it('devrait supporter les variantes de size', () => {
      const { container } = render(<Spinner className="size-8" />);
      expect(container).toBeInTheDocument();
    });
  });

  describe('Separator', () => {
    it('devrait rendre un séparateur', () => {
      const { container } = render(<Separator />);
      expect(container).toBeInTheDocument();
    });

    it('devrait supporter orientation', () => {
      const { container } = render(<Separator orientation="vertical" />);
      expect(container).toBeInTheDocument();
    });
  });
});
