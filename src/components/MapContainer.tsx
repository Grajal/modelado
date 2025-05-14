import { useState } from "react"
import { Button } from "./ui/button"
import Map from "@/components/Map"
import type { Route } from "@/types/route"
import { MapProvider } from "@/context/MapContext"
import { FilterPanel } from "@/components/FilterPanel"

export function MapContainer() {
  const [selectedRoute, setSelectedRoute] = useState<Route | null>(null)

  const handleRouteSelect = (route: Route) => {
    setSelectedRoute(route)
  }

  return (
    <MapProvider>
      <div className="flex h-full">
        <div className="w-80 border-r p-4 overflow-y-auto bg-gray-50">
          <FilterPanel />
        </div>

        <div className="relative flex-1">
          <Map onRouteSelect={handleRouteSelect} selectedRoute={selectedRoute} />
          <div className="absolute bottom-4 left-4 z-10">
            <Button variant="outline" className="bg-white shadow-md">
              <span className="sr-only">Mi ubicación</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5"
              >
                <circle cx="12" cy="12" r="10" />
                <circle cx="12" cy="12" r="1" />
                <line x1="12" y1="2" x2="12" y2="4" />
                <line x1="12" y1="20" x2="12" y2="22" />
                <line x1="4" y1="12" x2="2" y2="12" />
                <line x1="22" y1="12" x2="20" y2="12" />
              </svg>
            </Button>
          </div>
        </div>
      </div>
    </MapProvider>
  )
}
