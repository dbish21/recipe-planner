import { ReactNode } from "react";

export interface CardTheme {
  name: ReactNode;
  backgroundColor: string;
  textColor: string;
  accentColor: string;
}

export const cardThemes: Record<string, CardTheme> = {
  classic: {
      backgroundColor: '#ffffff',
      textColor: '#000000',
      accentColor: '#666666',
      name: undefined
  },
  modern: {
      backgroundColor: '#f5f5f5',
      textColor: '#2c3e50',
      accentColor: '#3498db',
      name: undefined
  },
  vintage: {
      backgroundColor: '#fff8e7',
      textColor: '#5d4037',
      accentColor: '#8d6e63',
      name: undefined
  },
  minimal: {
      backgroundColor: '#ffffff',
      textColor: '#333333',
      accentColor: '#999999',
      name: undefined
  },
  bold: {
      backgroundColor: '#2c3e50',
      textColor: '#ffffff',
      accentColor: '#e74c3c',
      name: undefined
  },
};