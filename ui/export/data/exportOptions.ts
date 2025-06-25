import { ExportOption } from "../types";

export const exportOptions: ExportOption[] = [
  {
    id: "yolo",
    title: "YOLO",
    description:
      "Format TXT populaire créé pour chaque fichier image. Chaque fichier txt contient les annotations pour l'image correspondante : classe d'objet, coordonnées, hauteur et largeur.",
    format: "TXT",
    tags: ["segmentation d'image", "détection d'objets"],
    enabled: true,
  },
  {
    id: "yolo-v8-obb",
    title: "YOLOv8 OBB",
    description:
      "Format TXT populaire créé pour chaque fichier image. Le format YOLO OBB désigne les boîtes englobantes par leurs quatre coins avec des coordonnées normalisées entre 0 et 1, permettant l'export d'objets pivotés.",
    format: "TXT",
    tags: ["segmentation d'image", "détection d'objets"],
    enabled: true,
  },
  {
    id: "json",
    title: "JSON",
    description:
      "Liste des éléments au format JSON brut stockée dans un seul fichier. Permet d'exporter à la fois les données et les annotations d'un dataset. Format commun Label Studio.",
    format: "JSON",
    tags: [],
    enabled: true,
  },
  {
    id: "json-min",
    title: "JSON-MIN",
    description:
      'Liste des éléments où seules les valeurs "from_name" et "to_name" du format JSON brut sont exportées. Permet d\'exporter uniquement les annotations d\'un dataset.',
    format: "JSON",
    tags: [],
    enabled: true,
  },
  {
    id: "csv",
    title: "CSV",
    description:
      'Résultats stockés sous forme de valeurs séparées par des virgules avec des noms de colonnes spécifiés par les valeurs des champs "from_name" et "to_name".',
    format: "CSV",
    tags: [],
    enabled: true,
  },
  {
    id: "tsv",
    title: "TSV",
    description:
      'Résultats stockés dans un fichier tabulaire séparé par des tabulations avec des noms de colonnes spécifiés par les valeurs "from_name" et "to_name".',
    format: "TSV",
    tags: [],
    enabled: true,
  },
  {
    id: "coco",
    title: "COCO",
    description:
      "Format populaire d'apprentissage automatique utilisé par le dataset COCO pour les tâches de détection d'objets et de segmentation d'image avec polygones et rectangles.",
    format: "JSON",
    tags: ["segmentation d'image", "détection d'objets"],
    enabled: false,
  },
  {
    id: "pascal-voc",
    title: "Pascal VOC XML",
    description:
      "Format XML populaire utilisé pour la détection d'objets et les tâches de segmentation d'image avec polygones.",
    format: "XML",
    tags: ["segmentation d'image", "détection d'objets"],
    enabled: false,
  },
];
