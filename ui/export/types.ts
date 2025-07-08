export type ExportFormat =
  | "yolo"
  | "yolo-v8-obb"
  | "json"
  | "json-min"
  | "csv"
  | "tsv"
  | "coco"
  | "pascal-voc";

export interface ExportOption {
  id: ExportFormat;
  title: string;
  description: string;
  format: string;
  tags: string[];
  enabled: boolean;
}

export interface ExportState {
  selectedFormat: ExportFormat | null;
  isExporting: boolean;
  exportError: string | null;
}

export interface ExportActions {
  setSelectedFormat: (format: ExportFormat | null) => void;
  exportProject: (projectId: string, format: ExportFormat) => Promise<any>;
  resetState: () => void;
}
