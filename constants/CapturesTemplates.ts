import { CaptureTemplate } from "@/types/capturesTemplate";

export const CAPTURE_TEMPLATES: CaptureTemplate[] = [
  {
    id: "retail-standard",
    name: "Standard (245 images)",
    description: "Template équilibré pour la plupart des produits de détail",
    estimatedTime: 25,
    difficulty: "medium",
    useCase: [],
    angles: [
      {
        position: "front",
        count: 40,
        maxCount: 60,
        description: "Face principale du produit",
        icon: "📦",
      },
      {
        position: "back",
        count: 25,
        maxCount: 30,
        description: "Arrière avec informations",
        icon: "📋",
      },
      {
        position: "side-left",
        count: 25,
        maxCount: 30,
        description: "Profil gauche",
        icon: "👈",
      },
      {
        position: "side-right",
        count: 25,
        maxCount: 30,
        description: "Profil droit",
        icon: "👉",
      },
      { position: "top", count: 20, description: "Vue du dessus", icon: "⬆️" },
      {
        position: "bottom",
        count: 15,
        description: "Vue du dessous",
        icon: "⬇️",
      },
      {
        position: "angle-45-tl",
        count: 20,
        description: "45° top-left",
        icon: "↖️",
      },
      {
        position: "angle-45-tr",
        count: 20,
        description: "45° top-right",
        icon: "↗️",
      },
      {
        position: "angle-45-bl",
        count: 15,
        description: "45° bottom-left",
        icon: "↙️",
      },
      {
        position: "angle-45-br",
        count: 15,
        description: "45° bottom-right",
        icon: "↘️",
      },
      { position: "hands", count: 25, description: "Tenu en main", icon: "🤲" },
    ],
    totalPhotos: 245,
  },
  {
    id: "retail-premium",
    name: "Premium (480 images)",
    description: "Template complet pour produits critiques ou complexes",
    estimatedTime: 45,
    difficulty: "hard",
    useCase: [],
    angles: [
      {
        position: "front",
        count: 60,
        lighting: "mixed",
        description: "Face principale - variations éclairage",
        icon: "📦",
      },
      {
        position: "back",
        count: 40,
        lighting: "mixed",
        description: "Arrière complet",
        icon: "📋",
      },
      {
        position: "side-left",
        count: 40,
        lighting: "natural",
        description: "Profil gauche détaillé",
        icon: "👈",
      },
      {
        position: "side-right",
        count: 40,
        lighting: "natural",
        description: "Profil droit détaillé",
        icon: "👉",
      },
      {
        position: "top",
        count: 35,
        lighting: "artificial",
        description: "Dessus avec éclairage contrôlé",
        icon: "⬆️",
      },
      {
        position: "bottom",
        count: 25,
        description: "Dessous complet",
        icon: "⬇️",
      },
      {
        position: "angle-30-tl",
        count: 25,
        description: "30° top-left",
        icon: "↖️",
      },
      {
        position: "angle-30-tr",
        count: 25,
        description: "30° top-right",
        icon: "↗️",
      },
      {
        position: "angle-45-tl",
        count: 25,
        description: "45° top-left",
        icon: "↖️",
      },
      {
        position: "angle-45-tr",
        count: 25,
        description: "45° top-right",
        icon: "↗️",
      },
      {
        position: "angle-60-tl",
        count: 20,
        description: "60° top-left",
        icon: "↖️",
      },
      {
        position: "angle-60-tr",
        count: 20,
        description: "60° top-right",
        icon: "↗️",
      },
      {
        position: "angle-45-bl",
        count: 20,
        description: "45° bottom-left",
        icon: "↙️",
      },
      {
        position: "angle-45-br",
        count: 20,
        description: "45° bottom-right",
        icon: "↘️",
      },
      {
        position: "rotation-15",
        count: 30,
        description: "Rotation 15° increments",
        icon: "🔄",
      },
      { position: "hands", count: 30, description: "Tenu en main", icon: "🤲" },
      {
        position: "close-up",
        count: 20,
        description: "Détails rapprochés",
        icon: "🔍",
      },
    ],
    totalPhotos: 480,
  },
  {
    id: "retail-fast",
    name: "Rapide (212 images)",
    description: "Template rapide pour capture en volume",
    estimatedTime: 12,
    difficulty: "easy",
    useCase: [],
    angles: [
      {
        position: "front",
        count: 30,
        description: "Face principale",
        icon: "📦",
      },
      { position: "back", count: 20, description: "Arrière basic", icon: "📋" },
      {
        position: "side-left",
        count: 20,
        description: "Profil gauche",
        icon: "👈",
      },
      {
        position: "side-right",
        count: 20,
        description: "Profil droit",
        icon: "👉",
      },
      { position: "top", count: 15, description: "Vue du dessus", icon: "⬆️" },
      {
        position: "bottom",
        count: 12,
        description: "Vue du dessous",
        icon: "⬇️",
      },
      {
        position: "angle-45-tl",
        count: 20,
        description: "45° top-left",
        icon: "↖️",
      },
      {
        position: "angle-45-tr",
        count: 20,
        description: "45° top-right",
        icon: "↗️",
      },
      {
        position: "angle-45-bl",
        count: 15,
        description: "45° bottom-left",
        icon: "↙️",
      },
      {
        position: "angle-45-br",
        count: 15,
        description: "45° bottom-right",
        icon: "↘️",
      },
      { position: "hands", count: 20, description: "Tenu en main", icon: "🤲" },
    ],
    totalPhotos: 212,
  },
  {
    id: "retail-comprehensive",
    name: "Complet (641 images)",
    description: "Template exhaustif pour dataset de référence",
    estimatedTime: 60,
    difficulty: "hard",
    useCase: [],
    angles: [
      {
        position: "front",
        count: 80,
        lighting: "mixed",
        description: "Face - toutes conditions",
        icon: "📦",
      },
      {
        position: "back",
        count: 60,
        lighting: "mixed",
        description: "Arrière complet",
        icon: "📋",
      },
      {
        position: "side-left",
        count: 50,
        lighting: "natural",
        description: "Profil gauche extensif",
        icon: "👈",
      },
      {
        position: "side-right",
        count: 50,
        lighting: "natural",
        description: "Profil droit extensif",
        icon: "👉",
      },
      {
        position: "top",
        count: 40,
        lighting: "artificial",
        description: "Dessus multi-éclairage",
        icon: "⬆️",
      },
      {
        position: "bottom",
        count: 30,
        description: "Dessous détaillé",
        icon: "⬇️",
      },
      {
        position: "angle-15-tl",
        count: 20,
        description: "15° top-left",
        icon: "↖️",
      },
      {
        position: "angle-15-tr",
        count: 20,
        description: "15° top-right",
        icon: "↗️",
      },
      {
        position: "angle-30-tl",
        count: 25,
        description: "30° top-left",
        icon: "↖️",
      },
      {
        position: "angle-30-tr",
        count: 25,
        description: "30° top-right",
        icon: "↗️",
      },
      {
        position: "angle-45-tl",
        count: 30,
        description: "45° top-left",
        icon: "↖️",
      },
      {
        position: "angle-45-tr",
        count: 30,
        description: "45° top-right",
        icon: "↗️",
      },
      {
        position: "angle-60-tl",
        count: 25,
        description: "60° top-left",
        icon: "↖️",
      },
      {
        position: "angle-60-tr",
        count: 25,
        description: "60° top-right",
        icon: "↗️",
      },
      {
        position: "angle-45-bl",
        count: 25,
        description: "45° bottom-left",
        icon: "↙️",
      },
      {
        position: "angle-45-br",
        count: 25,
        description: "45° bottom-right",
        icon: "↘️",
      },
      {
        position: "rotation-10",
        count: 36,
        description: "Rotation 10° (360°)",
        icon: "🔄",
      },
      {
        position: "close-up",
        count: 30,
        description: "Macro détails",
        icon: "🔍",
      },
      {
        position: "context",
        count: 25,
        description: "En contexte magasin",
        icon: "🏪",
      },
      { position: "hands", count: 30, description: "Tenu en main", icon: "🤲" },
    ],
    totalPhotos: 641,
  },
  // {
  //   id: "retail-small-objects",
  //   name: "Petits objets (315 images)",
  //   description: "Template spécialisé pour petits objets (< 10cm)",
  //   estimatedTime: 35,
  //   difficulty: "medium",
  //   useCase: ["bijoux", "accessoires", "composants", "médicaments"],
  //   angles: [
  //     {
  //       position: "front",
  //       count: 50,
  //       lighting: "artificial",
  //       description: "Face avec éclairage contrôlé",
  //       icon: "📦",
  //     },
  //     {
  //       position: "back",
  //       count: 35,
  //       lighting: "artificial",
  //       description: "Arrière détaillé",
  //       icon: "📋",
  //     },
  //     {
  //       position: "side-left",
  //       count: 30,
  //       description: "Profil gauche macro",
  //       icon: "👈",
  //     },
  //     {
  //       position: "side-right",
  //       count: 30,
  //       description: "Profil droit macro",
  //       icon: "👉",
  //     },
  //     {
  //       position: "top",
  //       count: 40,
  //       lighting: "natural",
  //       description: "Dessus haute résolution",
  //       icon: "⬆️",
  //     },
  //     {
  //       position: "bottom",
  //       count: 25,
  //       description: "Dessous si accessible",
  //       icon: "⬇️",
  //     },
  //     {
  //       position: "close-up-details",
  //       count: 40,
  //       description: "Détails critiques",
  //       icon: "🔍",
  //     },
  //     {
  //       position: "angle-45-tl",
  //       count: 25,
  //       description: "45° top-left",
  //       icon: "↖️",
  //     },
  //     {
  //       position: "angle-45-tr",
  //       count: 25,
  //       description: "45° top-right",
  //       icon: "↗️",
  //     },
  //     {
  //       position: "scale-reference",
  //       count: 15,
  //       description: "Avec référence taille",
  //       icon: "📏",
  //     },
  //   ],
  //   totalPhotos: 315,
  // },
];

export const getTemplateById = (id: string): CaptureTemplate | undefined => {
  return CAPTURE_TEMPLATES.find((template) => template.id === id);
};

export const getTemplatesByUseCase = (useCase: string): CaptureTemplate[] => {
  return CAPTURE_TEMPLATES.filter((template) =>
    template.useCase.includes(useCase)
  );
};

export const getTemplatesByDifficulty = (
  difficulty: "easy" | "medium" | "hard"
): CaptureTemplate[] => {
  return CAPTURE_TEMPLATES.filter(
    (template) => template.difficulty === difficulty
  );
};
