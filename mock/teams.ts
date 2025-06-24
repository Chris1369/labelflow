export interface Team {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  projectCount: number;
  createdAt: string;
  isOwner: boolean;
}

export const mockTeams: Team[] = [
  {
    id: '1',
    name: 'Équipe Marketing',
    description: 'Équipe en charge des campagnes marketing et de la communication',
    memberCount: 8,
    projectCount: 12,
    createdAt: '2024-01-15',
    isOwner: true,
  },
  {
    id: '2',
    name: 'Équipe Développement',
    description: 'Équipe de développement produit',
    memberCount: 15,
    projectCount: 5,
    createdAt: '2024-02-20',
    isOwner: false,
  },
  {
    id: '3',
    name: 'Équipe Design',
    description: 'Équipe créative et design UX/UI',
    memberCount: 6,
    projectCount: 8,
    createdAt: '2024-03-10',
    isOwner: false,
  },
  {
    id: '4',
    name: 'Équipe Data Science',
    description: 'Analyse de données et machine learning',
    memberCount: 10,
    projectCount: 3,
    createdAt: '2024-03-25',
    isOwner: true,
  },
];