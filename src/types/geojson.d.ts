import * as GeoJSON from 'geojson';

declare module '*.geojson' {
  const value: GeoJSON.GeoJsonObject; // Use type from @types/geojson
  export default value;
} 