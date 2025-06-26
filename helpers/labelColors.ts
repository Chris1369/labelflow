// Predefined color palette for labels
const colorPalette = [
  '#FF6B6B', // Red
  '#4ECDC4', // Teal
  '#45B7D1', // Blue
  '#FFA07A', // Light Salmon
  '#98D8C8', // Mint
  '#F7DC6F', // Yellow
  '#BB8FCE', // Purple
  '#85C1F2', // Light Blue
  '#F8B500', // Orange
  '#6C5CE7', // Violet
  '#A29BFE', // Lavender
  '#74B9FF', // Sky Blue
  '#FD79A8', // Pink
  '#55A3FF', // Bright Blue
  '#FD6E6E', // Coral
  '#32FF7E', // Green
  '#7158E2', // Deep Purple
  '#FFDA79', // Light Yellow
  '#FF6348', // Tomato
  '#17C0EB', // Cyan
];

// Store label to color mapping
const labelColorMap = new Map<string, string>();
let colorIndex = 0;

export const getLabelColor = (label: string | undefined): string => {
  if (!label) return '#FF7557'; // Default color (theme primary)
  
  // If label already has a color, return it
  if (labelColorMap.has(label)) {
    return labelColorMap.get(label)!;
  }
  
  // Assign a new color from the palette
  const color = colorPalette[colorIndex % colorPalette.length];
  labelColorMap.set(label, color);
  colorIndex++;
  
  return color;
};

export const resetLabelColors = () => {
  labelColorMap.clear();
  colorIndex = 0;
};