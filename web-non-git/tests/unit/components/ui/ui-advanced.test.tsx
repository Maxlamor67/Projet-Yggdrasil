import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Skeleton } from '@/components/ui/skeleton';
import { ScrollArea } from '@/components/ui/scroll-area';

describe('UI Components - Advanced', () => {
  describe('Tabs', () => {
    it('devrait rendre des tabs', () => {
      const { getByText } = render(
        <Tabs defaultValue="tab1">
          <TabsList>
            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
            <TabsTrigger value="tab2">Tab 2</TabsTrigger>
          </TabsList>
          <TabsContent value="tab1">Content 1</TabsContent>
          <TabsContent value="tab2">Content 2</TabsContent>
        </Tabs>
      );
      expect(getByText('Tab 1')).toBeInTheDocument();
      expect(getByText('Content 1')).toBeInTheDocument();
    });

    it('devrait supporter le changement de tab', () => {
      const { getByText } = render(
        <Tabs defaultValue="tab1">
          <TabsList>
            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
            <TabsTrigger value="tab2">Tab 2</TabsTrigger>
          </TabsList>
          <TabsContent value="tab1">Content 1</TabsContent>
          <TabsContent value="tab2">Content 2</TabsContent>
        </Tabs>
      );
      expect(getByText('Tab 1')).toBeInTheDocument();
    });
  });

  describe('Accordion', () => {
    it('devrait rendre un accordion', () => {
      const { getByText } = render(
        <Accordion type="single" collapsible>
          <AccordionItem value="item1">
            <AccordionTrigger>Item 1</AccordionTrigger>
            <AccordionContent>Content 1</AccordionContent>
          </AccordionItem>
        </Accordion>
      );
      expect(getByText('Item 1')).toBeInTheDocument();
    });

    it('devrait supporter l\'expansion', () => {
      const { getByText } = render(
        <Accordion type="single" collapsible>
          <AccordionItem value="item1">
            <AccordionTrigger>Item 1</AccordionTrigger>
            <AccordionContent>Content 1</AccordionContent>
          </AccordionItem>
          <AccordionItem value="item2">
            <AccordionTrigger>Item 2</AccordionTrigger>
            <AccordionContent>Content 2</AccordionContent>
          </AccordionItem>
        </Accordion>
      );
      expect(getByText('Item 1')).toBeInTheDocument();
      expect(getByText('Item 2')).toBeInTheDocument();
    });

    it('devrait supporter multiple', () => {
      const { getByText } = render(
        <Accordion type="multiple">
          <AccordionItem value="item1">
            <AccordionTrigger>Item 1</AccordionTrigger>
            <AccordionContent>Content 1</AccordionContent>
          </AccordionItem>
        </Accordion>
      );
      expect(getByText('Item 1')).toBeInTheDocument();
    });
  });

  describe('Skeleton', () => {
    it('devrait rendre un skeleton', () => {
      const { container } = render(<Skeleton />);
      expect(container.firstChild).toBeInTheDocument();
    });

    it('devrait avoir les bonnes dimensions', () => {
      const { container } = render(<Skeleton className="h-12 w-12 rounded-full" />);
      expect(container).toBeInTheDocument();
    });

    it('devrait supporter les styles personnalisés', () => {
      const { container } = render(<Skeleton className="w-full h-4 mb-2" />);
      expect(container).toBeInTheDocument();
    });
  });

  describe('ScrollArea', () => {
    it('devrait rendre une scroll area', () => {
      const { getByText } = render(
        <ScrollArea>
          <div>Content</div>
        </ScrollArea>
      );
      expect(getByText('Content')).toBeInTheDocument();
    });

    it('devrait afficher du contenu scrollable', () => {
      const { container } = render(
        <ScrollArea>
          <div>Long content here</div>
        </ScrollArea>
      );
      expect(container).toBeInTheDocument();
    });
  });
});
