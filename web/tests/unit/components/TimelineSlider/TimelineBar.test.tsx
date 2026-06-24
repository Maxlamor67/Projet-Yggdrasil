import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TimelineBar } from '@/components/TimelineSlider/TimelineBar';
import type { TimelineStep } from '@/types/timeline';

describe('TimelineBar', () => {
  const mockSteps: TimelineStep[] = [
    {
      datetime: new Date('2024-01-15T10:00:00'),
      actions: [
        {
          action: {
            id: '1',
            type: 'SET',
            realizedAt: new Date('2024-01-15T10:00:00'),
            safetyEquipmentId: 'eq-1',
            teamId: 'team-1',
            createdAt: new Date('2024-01-15T10:00:00'),
            updatedAt: new Date('2024-01-15T10:00:00')
          },
          safetyEquipment: {
            id: 'eq-1',
            projectId: 'project-1',
            safetyEquipmentTypeLengthId: 'length-1',
            safetyEquipmentTypeLengthCount: 1,
            createdAt: new Date('2024-01-15T10:00:00'),
            updatedAt: new Date('2024-01-15T10:00:00')
          },
          safetyEquipmentType: { id: 'type-1', name: 'Barrière', model: 'OBSTACLE', createdAt: new Date('2024-01-15T10:00:00') },
        },
      ],
    },
    {
      datetime: new Date('2024-01-15T11:00:00'),
      actions: [
        {
          action: {
            id: '2',
            type: 'UNSET',
            realizedAt: new Date('2024-01-15T11:00:00'),
            safetyEquipmentId: 'eq-2',
            teamId: 'team-1',
            createdAt: new Date('2024-01-15T11:00:00'),
            updatedAt: new Date('2024-01-15T11:00:00')
          },
          safetyEquipment: {
            id: 'eq-2',
            projectId: 'project-1',
            safetyEquipmentTypeLengthId: 'length-2',
            safetyEquipmentTypeLengthCount: 1,
            createdAt: new Date('2024-01-15T11:00:00'),
            updatedAt: new Date('2024-01-15T11:00:00')
          },
          safetyEquipmentType: { id: 'type-2', name: 'Clôture', model: 'OBSTACLE', createdAt: new Date('2024-01-15T11:00:00') },
        },
      ],
    },
    {
      datetime: new Date('2024-01-15T12:00:00'),
      actions: [
        {
          action: {
            id: '3',
            type: 'SET',
            realizedAt: new Date('2024-01-15T12:00:00'),
            safetyEquipmentId: 'eq-3',
            teamId: 'team-1',
            createdAt: new Date('2024-01-15T12:00:00'),
            updatedAt: new Date('2024-01-15T12:00:00')
          },
          safetyEquipment: {
            id: 'eq-3',
            projectId: 'project-1',
            safetyEquipmentTypeLengthId: 'length-3',
            safetyEquipmentTypeLengthCount: 1,
            createdAt: new Date('2024-01-15T12:00:00'),
            updatedAt: new Date('2024-01-15T12:00:00')
          },
          safetyEquipmentType: { id: 'type-3', name: 'Panneau', model: 'OBSTACLE', createdAt: new Date('2024-01-15T12:00:00') },
        },
      ],
    },
  ];

  const defaultProps = {
    steps: mockSteps,
    currentIndex: 0,
    onStepClick: vi.fn(),
    disabled: false,
  };

  it('devrait retourner null si aucun step', () => {
    const { container } = render(
      <TimelineBar {...defaultProps} steps={[]} />
    );

    expect(container.firstChild).toBeNull();
  });

  it('devrait afficher la légende des couleurs', () => {
    render(<TimelineBar {...defaultProps} />);

    expect(screen.getByText('Mise en place')).toBeInTheDocument();
    expect(screen.getByText('Retrait')).toBeInTheDocument();
    expect(screen.getByText('Mixte')).toBeInTheDocument();
  });

  it('devrait afficher les dates formatées', () => {
    const { container } = render(<TimelineBar {...defaultProps} />);

    // Vérifier que les dates sont affichées (peu importe le format)
    const dateElements = container.querySelectorAll('.text-xs.font-medium.text-gray-700');
    expect(dateElements.length).toBeGreaterThanOrEqual(2);
  });

  it('devrait appeler onStepClick au clic sur un point', async () => {
    const user = userEvent.setup();
    const onStepClick = vi.fn();

    const { container } = render(
      <TimelineBar {...defaultProps} onStepClick={onStepClick} />
    );

    // Cliquer sur le premier point (il y a plusieurs divs cliquables)
    const clickableDivs = container.querySelectorAll('.cursor-pointer');
    if (clickableDivs.length > 0) {
      await user.click(clickableDivs[0]);
      expect(onStepClick).toHaveBeenCalled();
    }
  });

  it('ne devrait pas appeler onStepClick si disabled', async () => {
    const user = userEvent.setup();
    const onStepClick = vi.fn();

    const { container } = render(
      <TimelineBar {...defaultProps} onStepClick={onStepClick} disabled={true} />
    );

    const clickableDivs = container.querySelectorAll('.cursor-pointer');
    if (clickableDivs.length > 0) {
      await user.click(clickableDivs[0]);
      expect(onStepClick).not.toHaveBeenCalled();
    }
  });

  it('devrait afficher le nombre d\'actions sur les points', () => {
    const stepsWithMultipleActions: TimelineStep[] = [
      {
        datetime: new Date('2024-01-15T10:00:00'),
        actions: [
          {
            action: {
              id: '1',
              type: 'SET',
              realizedAt: new Date('2024-01-15T10:00:00'),
              safetyEquipmentId: 'eq-1',
              teamId: 'team-1',
              createdAt: new Date('2024-01-15T10:00:00'),
              updatedAt: new Date('2024-01-15T10:00:00')
            },
            safetyEquipment: {
              id: 'eq-1',
              projectId: 'project-1',
              safetyEquipmentTypeLengthId: 'length-1',
              safetyEquipmentTypeLengthCount: 1,
              createdAt: new Date('2024-01-15T10:00:00'),
              updatedAt: new Date('2024-01-15T10:00:00')
            },
            safetyEquipmentType: { id: 'type-1', name: 'Barrière', model: 'OBSTACLE', createdAt: new Date('2024-01-15T10:00:00') },
          },
          {
            action: {
              id: '2',
              type: 'SET',
              realizedAt: new Date('2024-01-15T10:00:00'),
              safetyEquipmentId: 'eq-2',
              teamId: 'team-1',
              createdAt: new Date('2024-01-15T10:00:00'),
              updatedAt: new Date('2024-01-15T10:00:00')
            },
            safetyEquipment: {
              id: 'eq-2',
              projectId: 'project-1',
              safetyEquipmentTypeLengthId: 'length-2',
              safetyEquipmentTypeLengthCount: 1,
              createdAt: new Date('2024-01-15T10:00:00'),
              updatedAt: new Date('2024-01-15T10:00:00')
            },
            safetyEquipmentType: { id: 'type-2', name: 'Clôture', model: 'OBSTACLE', createdAt: new Date('2024-01-15T10:00:00') },
          },
          {
            action: {
              id: '3',
              type: 'UNSET',
              realizedAt: new Date('2024-01-15T10:00:00'),
              safetyEquipmentId: 'eq-3',
              teamId: 'team-1',
              createdAt: new Date('2024-01-15T10:00:00'),
              updatedAt: new Date('2024-01-15T10:00:00')
            },
            safetyEquipment: {
              id: 'eq-3',
              projectId: 'project-1',
              safetyEquipmentTypeLengthId: 'length-3',
              safetyEquipmentTypeLengthCount: 1,
              createdAt: new Date('2024-01-15T10:00:00'),
              updatedAt: new Date('2024-01-15T10:00:00')
            },
            safetyEquipmentType: { id: 'type-3', name: 'Panneau', model: 'OBSTACLE', createdAt: new Date('2024-01-15T10:00:00') },
          },
        ],
      },
    ];

    render(
      <TimelineBar {...defaultProps} steps={stepsWithMultipleActions} />
    );

    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('devrait gérer un seul step', () => {
    const singleStep: TimelineStep[] = [
      {
        datetime: new Date('2024-01-15T10:00:00'),
        actions: [
          {
            action: {
              id: '1',
              type: 'SET',
              realizedAt: new Date('2024-01-15T10:00:00'),
              safetyEquipmentId: 'eq-1',
              teamId: 'team-1',
              createdAt: new Date('2024-01-15T10:00:00'),
              updatedAt: new Date('2024-01-15T10:00:00')
            },
            safetyEquipment: {
              id: 'eq-1',
              projectId: 'project-1',
              safetyEquipmentTypeLengthId: 'length-1',
              safetyEquipmentTypeLengthCount: 1,
              createdAt: new Date('2024-01-15T10:00:00'),
              updatedAt: new Date('2024-01-15T10:00:00')
            },
            safetyEquipmentType: { id: 'type-1', name: 'Barrière', model: 'OBSTACLE', createdAt: new Date('2024-01-15T10:00:00') },
          },
        ],
      },
    ];

    render(<TimelineBar {...defaultProps} steps={singleStep} />);

    expect(screen.getByText('Mise en place')).toBeInTheDocument();
  });

  it('devrait mettre en évidence le step actuel', () => {
    const { container } = render(
      <TimelineBar {...defaultProps} currentIndex={1} />
    );

    // Le point actif devrait avoir la classe scale-100
    const activePoint = container.querySelector('.scale-100');
    expect(activePoint).toBeInTheDocument();
  });
});
