import { createContext, useContext, useState, type ReactNode } from "react"

interface MapFilters {
  search: string
  minDistance: number
  maxDistance: number
  difficulties: string[]
}

interface MapContextType {
  filters: MapFilters
  setFilters: (filters: MapFilters) => void
}

const MapContext = createContext<MapContextType | undefined>(undefined)

export function MapProvider({ children }: { children: ReactNode }) {
  const [filters, setFilters] = useState<MapFilters>({
    search: "",
    minDistance: 0,
    maxDistance: 30,
    difficulties: ["fácil", "media", "difícil"],
  })

  return <MapContext.Provider value={{ filters, setFilters }}>{children}</MapContext.Provider>
}

export function useMap() {
  const context = useContext(MapContext)
  if (context === undefined) {
    throw new Error("useMap must be used within a MapProvider")
  }
  return context
}
