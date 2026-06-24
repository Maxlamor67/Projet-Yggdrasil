
// MAPPER DIRECTEMENT SUR L’ENUM PRISMA
export enum EquipmentType {
    REINFORCED_CONCRETE_GUARDRAILS = 'REINFORCED_CONCRETE_GUARDRAILS',
    CONCRETE_BLOCKS = 'CONCRETE_BLOCKS',
    VAUBAN_BARRIERS = 'VAUBAN_BARRIERS',
    HERAS_BARRIERS = 'HERAS_BARRIERS',
    OBSTACLES = 'OBSTACLES',
    BLOCKING_VEHICLE = 'BLOCKING_VEHICLE',
    OTHER = 'OTHER'
}

export interface SecurityEquipment {
    id: string;
    type: EquipmentType;
    label: string;
    description: string;
    dimensions: {
        width?: number;
        length?: number;
        height?: number;
    };
    variants?: string[];
}

// REMPLACER LES TYPES PAR LES ENUM PRISMA CORRESPONDANTS
export const securityEquipments: SecurityEquipment[] = [
    {
        id: 'gba-2m',
        type: EquipmentType.REINFORCED_CONCRETE_GUARDRAILS,
        label: 'GBA 2m',
        description: 'Glissière béton armé',
        dimensions: { width: 0.6, length: 2 }
    },
    {
        id: 'gba-1m',
        type: EquipmentType.REINFORCED_CONCRETE_GUARDRAILS,
        label: 'GBA 1m',
        description: 'Glissière béton armé',
        dimensions: { width: 0.6, length: 1 }
    },
    {
        id: 'bloc-petit',
        type: EquipmentType.CONCRETE_BLOCKS,
        label: 'Bloc béton 1m',
        description: 'Bloc de béton',
        dimensions: { width: 0.6, height: 0.6, length: 1 }
    },
    {
        id: 'bloc-grand',
        type: EquipmentType.CONCRETE_BLOCKS,
        label: 'Bloc béton 2,5m',
        description: 'Bloc de béton',
        dimensions: { width: 0.6, height: 0.6, length: 2.5 }
    },
    {
        id: 'barriere-vauban',
        type: EquipmentType.VAUBAN_BARRIERS,
        label: 'Barrière Vauban',
        description: 'Barrière de délimitation',
        dimensions: { length: 2 }
    },
    {
        id: 'barriere-heras',
        type: EquipmentType.HERAS_BARRIERS,
        label: 'Barrière Héras',
        description: 'Délimitation de surface d’accueil',
        dimensions: { length: 3.5 },
        variants: ['Standard', 'Avec voile d’occultation']
    },
    {
        id: 'obstacle-standard',
        type: EquipmentType.OBSTACLES,
        label: 'Obstacle standard',
        description: 'Module d’obstacle',
        dimensions: { width: 0.95 }
    },
    {
        id: 'obstacle-extremite',
        type: EquipmentType.OBSTACLES,
        label: 'Obstacle extrémité',
        description: 'Module d’obstacle extrémité',
        dimensions: { width: 1.05 }
    },
    {
        id: 'engin-8m',
        type: EquipmentType.BLOCKING_VEHICLE,
        label: 'Engin de blocage 8m',
        description: 'Engins routiers pour bloquer les rues',
        dimensions: { length: 8 }
    },
    {
        id: 'engin-935m',
        type: EquipmentType.BLOCKING_VEHICLE,
        label: 'Engin de blocage 9,35m',
        description: 'Engins routiers pour bloquer les rues',
        dimensions: { length: 9.35 }
    },
    {
        id: 'engin-95m',
        type: EquipmentType.BLOCKING_VEHICLE,
        label: 'Engin de blocage 9,5m',
        description: 'Engins routiers pour bloquer les rues',
        dimensions: { length: 9.5 }
    },
    {
        id: 'engin-11m',
        type: EquipmentType.BLOCKING_VEHICLE,
        label: 'Engin de blocage 11m',
        description: 'Engins routiers pour bloquer les rues',
        dimensions: { length: 11 }
    },
    {
        id: 'engin-16m',
        type: EquipmentType.BLOCKING_VEHICLE,
        label: 'Engin de blocage 16m',
        description: 'Engins routiers pour bloquer les rues',
        dimensions: { length: 16 }
    }
];

// LABELS MIS À JOUR POUR PRENDRE EN COMPTE LES VALEURS PRISMA
export const equipmentTypeLabels: Record<EquipmentType, string> = {
    [EquipmentType.REINFORCED_CONCRETE_GUARDRAILS]: 'Glissières béton armé (GBA)',
    [EquipmentType.CONCRETE_BLOCKS]: 'Blocs de béton',
    [EquipmentType.VAUBAN_BARRIERS]: 'Barrières Vauban',
    [EquipmentType.HERAS_BARRIERS]: 'Barrières Héras',
    [EquipmentType.OBSTACLES]: 'Obstacles',
    [EquipmentType.BLOCKING_VEHICLE]: 'Engins de blocage',
    [EquipmentType.OTHER]: 'Autre'
};

export const getEquipmentsByType = (type: EquipmentType): SecurityEquipment[] =>
    securityEquipments.filter(eq => eq.type === type);

export const getEquipmentById = (id: string): SecurityEquipment | undefined =>
    securityEquipments.find(eq => eq.id === id);
