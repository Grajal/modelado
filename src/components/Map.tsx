/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react"
import { MapContainer, TileLayer, GeoJSON, Marker, Popup, useMapEvents } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import "leaflet-defaulticon-compatibility"
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css"
import L, { Icon, DivIcon } from "leaflet"
import type { Route } from "@/types/route"
import sendasData from "@/data/senda.json"
import lugaresData from "@/data/lugares_cyl.json"
import { useMap } from "@/context/MapContext" // Import useMap

// Define a simple type for the features in lugares_cyl.geojson
// based on its structure. Use @types/geojson for more robust typing if installed.
interface LugarFeature {
  type: "Feature"
  geometry: {
    type: "Point"
    coordinates: [number, number] // [lng, lat]
  }
  properties: {
    id?: string | number // Optional ID
    name?: string
    // Add other properties if they exist
  }
}

// Define a type for Sendas features (assuming LineString geometry)
interface SendasFeature {
  type: "Feature"
  geometry: {
    type: "LineString" | "MultiLineString" // Allow both types
    coordinates: any // Use any for flexibility with LineString/MultiLineString
  }
  properties: {
    gml_id?: string | number
    equip_b_nombre?: string
    senda_dificultad?: number
    senda_longitud?: number
    startPoint?: string
    senda_tiempo_recorrido?: string
  }
}

const fixLeafletIcons = () => {
  if (typeof window !== "undefined") {
    // @ts-expect-error Leaflet internal property
    delete L.Icon.Default.prototype._getIconUrl
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: "/marker-icon-2x.png",
      iconUrl: "/marker-icon.png",
      shadowUrl: "/marker-shadow.png",
    })
  }
}

const createPlaceLabelIcon = (name: string): DivIcon => {
  return L.divIcon({
    html: `<span style="font-size: 10px; white-space: nowrap;">${name}</span>`,
    className: 'map-place-label-divicon',
    iconSize: undefined,
    iconAnchor: [0, 0]
  })
}

const defaultIcon = new Icon({
  iconUrl: "/marker-icon.png",
  iconRetinaUrl: "/marker-icon-2x.png",
  shadowUrl: "/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
})

const formatDuration = (minutesStr: string | undefined): string => {
  if (minutesStr === undefined || minutesStr === null || minutesStr === "") return "N/A"

  const totalMinutes = parseInt(minutesStr, 10)

  if (isNaN(totalMinutes) || totalMinutes < 0) {
    return "N/A"
  }

  if (totalMinutes === 0) {
    return "0 min"
  }

  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60

  let result = ""
  if (hours > 0) {
    result += `${hours} h`
  }
  if (minutes > 0) {
    if (result) result += " "
    result += `${minutes} min`
  }

  return result
}

const formatDistance = (meters: number | undefined): string => {
  if (meters === undefined || meters === null || isNaN(meters) || meters < 0) {
    return "N/A"
  }

  if (meters === 0) {
    return "0 m"
  }

  if (meters < 1000) {
    return `${meters} m`
  }

  const kilometers = (meters / 1000).toFixed(1)
  return `${kilometers} km`
}

interface MapProps {
  onRouteSelect: (route: Route) => void
  selectedRoute: Route | null
}

const LABEL_VISIBILITY_ZOOM_THRESHOLD = 9

function MapEvents({ setZoomLevel }: { setZoomLevel: (zoom: number) => void }) {
  const map = useMapEvents({
    zoomend: () => {
      setZoomLevel(map.getZoom())
    },
    load: () => {
      setZoomLevel(map.getZoom())
    }
  })
  return null
}

export default function Map({ onRouteSelect, selectedRoute }: MapProps) {
  const { filters } = useMap()
  const [currentZoom, setCurrentZoom] = useState(8)

  useEffect(() => {
    fixLeafletIcons()
  }, [])

  const getDifficultyColor = (difficulty: number | undefined) => {
    switch (difficulty) {
      case 1:
        return "green"
      case 2:
        return "orange"
      case 3:
        return "red"
      default:
        return "blue"
    }
  }

  const filteredFeatures = (sendasData.features as SendasFeature[]).filter((feature) => {
    if (!feature || !feature.properties) return false

    const name = feature.properties.equip_b_nombre || ""
    const length = feature.properties.senda_longitud || 0
    const difficultyValue = feature.properties.senda_dificultad
    const difficulty: Route['difficulty'] = difficultyValue === 1 ? 'Fácil' :
      difficultyValue === 2 ? 'Media' :
        difficultyValue === 3 ? 'Difícil' :
          'Media'

    if (filters.search && !name.toLowerCase().includes(filters.search.toLowerCase())) {
      return false
    }

    if (filters.difficulties.length > 0 && !filters.difficulties.includes(difficulty.toLowerCase())) {
      return false
    }

    const lengthKm = length / 1000
    if (lengthKm < filters.minDistance || lengthKm > filters.maxDistance) {
      return false
    }

    return true
  })

  return (
    <MapContainer
      center={[41.6, -4.7]}
      zoom={8}
      style={{ height: "100%", width: "100%" }}
      zoomControl={false}
      attributionControl={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png"
      />

      <MapEvents setZoomLevel={setCurrentZoom} />

      <GeoJSON
        key={JSON.stringify(sendasData) + JSON.stringify(filters)}
        data={{ ...sendasData, features: filteredFeatures } as any}
        style={(feature) => {
          const featureId = feature?.properties?.gml_id ? String(feature.properties.gml_id) : null
          const isSelected = selectedRoute && featureId && featureId === selectedRoute.id
          return {
            color: getDifficultyColor(feature?.properties?.senda_dificultad),
            weight: isSelected ? 6 : 3,
            opacity: isSelected ? 1 : 0.7,
          }
        }}
      />

      {filteredFeatures.map((feature: SendasFeature, index: number) => {
        const difficultyValue = feature.properties.senda_dificultad
        const mappedDifficulty: Route['difficulty'] =
          difficultyValue === 1 ? 'Fácil' :
            difficultyValue === 2 ? 'Media' :
              difficultyValue === 3 ? 'Difícil' :
                'Media'

        const routeId = feature.properties.gml_id ? String(feature.properties.gml_id) : `generated-route-${index}`

        const route: Route = {
          id: routeId,
          name: feature.properties.equip_b_nombre || "Ruta sin nombre",
          difficulty: mappedDifficulty,
          length: feature.properties.senda_longitud || 0,
          startPoint: feature.properties.startPoint || "",
          duration: feature.properties.senda_tiempo_recorrido || "",
          geometry: feature.geometry,
        }

        let lat: number | null = null
        let lng: number | null = null

        if (feature.geometry?.coordinates && feature.geometry.coordinates.length > 0) {
          let firstCoord: number[] | null = null
          if (feature.geometry.type === 'LineString') {
            firstCoord = feature.geometry.coordinates[0]
          } else if (feature.geometry.type === 'MultiLineString' && feature.geometry.coordinates[0]?.length > 0) {
            firstCoord = feature.geometry.coordinates[0][0]
          }

          if (firstCoord && firstCoord.length >= 2) {
            if (Number.isFinite(firstCoord[1]) && Number.isFinite(firstCoord[0])) {
              lat = firstCoord[1]
              lng = firstCoord[0]
            }
          }
        }

        if (lat === null || lng === null) {
          console.warn("Could not determine start coordinates for route:", route.name, feature)
          return null
        }

        return (
          <Marker
            key={route.id}
            position={[lat, lng]}
            icon={defaultIcon}
            eventHandlers={{ click: () => onRouteSelect(route) }}
          >
            <Popup>
              <div>
                <h3 className="font-bold">{route.name}</h3>
                <p>Dificultad: {route.difficulty}</p>
                <p>Tiempo: {formatDuration(route.duration)}</p>
                <p>Distancia: {formatDistance(route.length)}</p>
              </div>
            </Popup>
          </Marker>
        )
      })}

      {(lugaresData.features as LugarFeature[]).map((feature: LugarFeature, index: number) => {
        if (currentZoom < LABEL_VISIBILITY_ZOOM_THRESHOLD) {
          return null
        }

        if (!feature?.geometry?.coordinates || feature.geometry.coordinates.length < 2 || feature.geometry.type !== 'Point') {
          console.warn("Invalid geometry/coordinates for place feature:", feature)
          return null
        }
        const lat = feature.geometry.coordinates[1]
        const lng = feature.geometry.coordinates[0]
        const name = feature.properties?.name || "Lugar sin nombre"

        if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
          console.warn("Invalid finite coordinates for place feature:", feature)
          return null
        }

        const placeIcon = createPlaceLabelIcon(name)

        return (
          <Marker
            key={feature.properties.id || `lugar-marker-${index}`}
            position={[lat, lng]}
            icon={placeIcon}
            interactive={false}
          >
          </Marker>
        )
      })}
    </MapContainer>
  )
}
