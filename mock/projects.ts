import { Project } from '../types/project';

export const mockProjects: Project[] = [
  {
    id: '1',
    name: 'Fruits & Légumes',
    description: 'Dataset pour reconnaître différents fruits et légumes',
    itemCount: 245,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-02-20'),
  },
  {
    id: '2',
    name: 'Panneaux de signalisation',
    description: 'Collection de panneaux routiers',
    itemCount: 178,
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-02-18'),
  },
  {
    id: '3',
    name: 'Animaux domestiques',
    description: 'Chiens, chats et autres animaux',
    itemCount: 89,
    createdAt: new Date('2024-02-10'),
    updatedAt: new Date('2024-02-15'),
  },
  {
    id: '4',
    name: 'Objets du quotidien',
    description: 'Objets courants de la maison',
    itemCount: 312,
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-02-22'),
  },
  {
    id: '5',
    name: 'Véhicules',
    description: 'Voitures, motos, vélos',
    itemCount: 156,
    createdAt: new Date('2024-02-05'),
    updatedAt: new Date('2024-02-21'),
  },
];