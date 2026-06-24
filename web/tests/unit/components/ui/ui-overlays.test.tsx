import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

describe('UI Components - Overlays & Containers', () => {
  describe('Dialog', () => {
    it('devrait rendre une dialog', () => {
      const { getByText } = render(
        <Dialog open={true}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Dialog Title</DialogTitle>
              <DialogDescription>Dialog description</DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      );
      expect(getByText('Dialog Title')).toBeInTheDocument();
    });

    it('devrait supporter DialogDescription', () => {
      const { getByText } = render(
        <Dialog open={true}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Title</DialogTitle>
              <DialogDescription>Description</DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      );
      expect(getByText('Description')).toBeInTheDocument();
    });
  });

  describe('Sheet', () => {
    it('devrait rendre une sheet', () => {
      const { getByText } = render(
        <Sheet open={true}>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Sheet Title</SheetTitle>
              <SheetDescription>Sheet description</SheetDescription>
            </SheetHeader>
          </SheetContent>
        </Sheet>
      );
      expect(getByText('Sheet Title')).toBeInTheDocument();
    });

    it('devrait supporter les côtés', () => {
      const { getByText } = render(
        <Sheet open={true}>
          <SheetContent side="right">
            <SheetHeader>
              <SheetTitle>Right Sheet</SheetTitle>
              <SheetDescription>Right sheet description</SheetDescription>
            </SheetHeader>
          </SheetContent>
        </Sheet>
      );
      expect(getByText('Right Sheet')).toBeInTheDocument();
    });
  });

  describe('Popover', () => {
    it('devrait rendre un popover', () => {
      const { getByText } = render(
        <Popover open={true}>
          <PopoverTrigger>Open</PopoverTrigger>
          <PopoverContent>Content</PopoverContent>
        </Popover>
      );
      expect(getByText('Content')).toBeInTheDocument();
    });
  });

  describe('Alert', () => {
    it('devrait rendre une alerte', () => {
      const { getByText } = render(
        <Alert>
          <AlertTitle>Alert Title</AlertTitle>
          <AlertDescription>Alert Description</AlertDescription>
        </Alert>
      );
      expect(getByText('Alert Title')).toBeInTheDocument();
      expect(getByText('Alert Description')).toBeInTheDocument();
    });

    it('devrait supporter les variantes', () => {
      const { getByText } = render(
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
        </Alert>
      );
      expect(getByText('Error')).toBeInTheDocument();
    });
  });
});
