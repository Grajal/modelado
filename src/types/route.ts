/* eslint-disable @typescript-eslint/no-explicit-any */
export interface Route {
  id: string;
  name: string;
  difficulty: "Fácil" | "Media" | "Difícil";
  length: number;
  startPoint: string;
  endPoint?: string; // Optional for circular routes
  duration: string; // e.g., "2h 30m"
  geometry: any; // GeoJSON geometry
} 