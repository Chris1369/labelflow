export interface ObjectLabel {
  id: string;
  name: string;
  category: string;
  icon?: string;
  isDynamic?: boolean;
  isRecent?: boolean;
}

export const mockObjectLabels: ObjectLabel[] = [
  // Fruits & Légumes
  { id: "1", name: "pomme", category: "Fruits" },
  { id: "2", name: "banane", category: "Fruits" },
  { id: "3", name: "orange", category: "Fruits" },
  { id: "4", name: "fraise", category: "Fruits" },
  { id: "5", name: "raisin", category: "Fruits" },
  { id: "6", name: "tomate", category: "Légumes" },
  { id: "7", name: "carotte", category: "Légumes" },
  { id: "8", name: "brocoli", category: "Légumes" },
  { id: "9", name: "concombre", category: "Légumes" },
  { id: "10", name: "salade", category: "Légumes" },
  { id: "51", name: "champignon", category: "Légumes" },

  // Véhicules
  { id: "11", name: "voiture", category: "Véhicules" },
  { id: "12", name: "camion", category: "Véhicules" },
  { id: "13", name: "moto", category: "Véhicules" },
  { id: "14", name: "vélo", category: "Véhicules" },
  { id: "15", name: "bus", category: "Véhicules" },
  { id: "16", name: "avion", category: "Véhicules" },
  { id: "17", name: "bateau", category: "Véhicules" },

  // Animaux
  { id: "18", name: "chien", category: "Animaux" },
  { id: "19", name: "chat", category: "Animaux" },
  { id: "20", name: "oiseau", category: "Animaux" },
  { id: "21", name: "poisson", category: "Animaux" },
  { id: "22", name: "cheval", category: "Animaux" },
  { id: "23", name: "vache", category: "Animaux" },
  { id: "24", name: "lapin", category: "Animaux" },

  // Objets du quotidien
  { id: "25", name: "téléphone", category: "Électronique" },
  { id: "26", name: "ordinateur", category: "Électronique" },
  { id: "27", name: "télévision", category: "Électronique" },
  { id: "28", name: "montre", category: "Accessoires" },
  { id: "29", name: "lunettes", category: "Accessoires" },
  { id: "30", name: "sac", category: "Accessoires" },
  { id: "31", name: "chaussures", category: "Vêtements" },
  { id: "32", name: "chapeau", category: "Vêtements" },
  { id: "33", name: "table", category: "Mobilier" },
  { id: "34", name: "chaise", category: "Mobilier" },
  { id: "35", name: "lit", category: "Mobilier" },
  { id: "36", name: "lampe", category: "Mobilier" },

  // Nourriture
  { id: "37", name: "pain", category: "Nourriture" },
  { id: "38", name: "pizza", category: "Nourriture" },
  { id: "39", name: "burger", category: "Nourriture" },
  { id: "40", name: "gâteau", category: "Nourriture" },

  // Panneaux
  { id: "41", name: "stop", category: "Signalisation" },
  { id: "42", name: "cédez le passage", category: "Signalisation" },
  { id: "43", name: "sens interdit", category: "Signalisation" },
  { id: "44", name: "limitation de vitesse", category: "Signalisation" },

  // Personnes
  { id: "45", name: "personne", category: "Humain" },
  { id: "46", name: "visage", category: "Humain" },
  { id: "47", name: "main", category: "Humain" },

  // Nature
  { id: "48", name: "arbre", category: "Nature" },
  { id: "49", name: "fleur", category: "Nature" },
  { id: "50", name: "montagne", category: "Nature" },
];

export const getObjectCategories = (): string[] => {
  const categories = new Set(mockObjectLabels.map((obj) => obj.category));
  return Array.from(categories).sort();
};
