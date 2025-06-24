export interface ObjectLabel {
  id: string;
  name: string;
  category: string;
  icon?: string;
}

export const mockObjectLabels: ObjectLabel[] = [
  // Fruits & Légumes
  { id: '1', name: 'Pomme', category: 'Fruits' },
  { id: '2', name: 'Banane', category: 'Fruits' },
  { id: '3', name: 'Orange', category: 'Fruits' },
  { id: '4', name: 'Fraise', category: 'Fruits' },
  { id: '5', name: 'Raisin', category: 'Fruits' },
  { id: '6', name: 'Tomate', category: 'Légumes' },
  { id: '7', name: 'Carotte', category: 'Légumes' },
  { id: '8', name: 'Brocoli', category: 'Légumes' },
  { id: '9', name: 'Concombre', category: 'Légumes' },
  { id: '10', name: 'Salade', category: 'Légumes' },
  
  // Véhicules
  { id: '11', name: 'Voiture', category: 'Véhicules' },
  { id: '12', name: 'Camion', category: 'Véhicules' },
  { id: '13', name: 'Moto', category: 'Véhicules' },
  { id: '14', name: 'Vélo', category: 'Véhicules' },
  { id: '15', name: 'Bus', category: 'Véhicules' },
  { id: '16', name: 'Avion', category: 'Véhicules' },
  { id: '17', name: 'Bateau', category: 'Véhicules' },
  
  // Animaux
  { id: '18', name: 'Chien', category: 'Animaux' },
  { id: '19', name: 'Chat', category: 'Animaux' },
  { id: '20', name: 'Oiseau', category: 'Animaux' },
  { id: '21', name: 'Poisson', category: 'Animaux' },
  { id: '22', name: 'Cheval', category: 'Animaux' },
  { id: '23', name: 'Vache', category: 'Animaux' },
  { id: '24', name: 'Lapin', category: 'Animaux' },
  
  // Objets du quotidien
  { id: '25', name: 'Téléphone', category: 'Électronique' },
  { id: '26', name: 'Ordinateur', category: 'Électronique' },
  { id: '27', name: 'Télévision', category: 'Électronique' },
  { id: '28', name: 'Montre', category: 'Accessoires' },
  { id: '29', name: 'Lunettes', category: 'Accessoires' },
  { id: '30', name: 'Sac', category: 'Accessoires' },
  { id: '31', name: 'Chaussures', category: 'Vêtements' },
  { id: '32', name: 'Chapeau', category: 'Vêtements' },
  { id: '33', name: 'Table', category: 'Mobilier' },
  { id: '34', name: 'Chaise', category: 'Mobilier' },
  { id: '35', name: 'Lit', category: 'Mobilier' },
  { id: '36', name: 'Lampe', category: 'Mobilier' },
  
  // Nourriture
  { id: '37', name: 'Pain', category: 'Nourriture' },
  { id: '38', name: 'Pizza', category: 'Nourriture' },
  { id: '39', name: 'Burger', category: 'Nourriture' },
  { id: '40', name: 'Gâteau', category: 'Nourriture' },
  
  // Panneaux
  { id: '41', name: 'Stop', category: 'Signalisation' },
  { id: '42', name: 'Cédez le passage', category: 'Signalisation' },
  { id: '43', name: 'Sens interdit', category: 'Signalisation' },
  { id: '44', name: 'Limitation de vitesse', category: 'Signalisation' },
  
  // Personnes
  { id: '45', name: 'Personne', category: 'Humain' },
  { id: '46', name: 'Visage', category: 'Humain' },
  { id: '47', name: 'Main', category: 'Humain' },
  
  // Nature
  { id: '48', name: 'Arbre', category: 'Nature' },
  { id: '49', name: 'Fleur', category: 'Nature' },
  { id: '50', name: 'Montagne', category: 'Nature' },
];

export const getObjectCategories = (): string[] => {
  const categories = new Set(mockObjectLabels.map(obj => obj.category));
  return Array.from(categories).sort();
};