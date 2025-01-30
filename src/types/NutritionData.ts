import { ReactNode } from "react";

export interface NutritionData {
  yield: ReactNode;
  calories: number;
  totalNutrients: {
    [key: string]: {
      label: string;
      quantity: number;
      unit: string;
    };
  };
  healthLabels?: string[];
  cautions?: string[];
  totalDaily?: {
    [key: string]: {
      label: string;
      quantity: number;
      unit: string;
    };
  };
  dietLabels?: string[];
  nutrients?: Array<{
    name: string;
    amount: number;
    unit: string;
  }>;
} 