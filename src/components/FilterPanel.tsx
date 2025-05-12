"use client"

import { useMap } from "@/context/MapContext"
import { Slider } from "@/components/ui/slider"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Filter } from "lucide-react"

export function FilterPanel() {
  const { filters, setFilters } = useMap()

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({ ...filters, search: event.target.value })
  }

  const handleDistanceChange = (value: number[]) => {
    setFilters({ ...filters, minDistance: value[0], maxDistance: value[1] })
  }

  const handleDifficultyChange = (difficultyKey: 'fácil' | 'media' | 'difícil', checked: boolean) => {
    const currentDifficulties = filters.difficulties || []
    let newDifficulties: string[]

    if (checked) {
      newDifficulties = [...currentDifficulties, difficultyKey]
    } else {
      newDifficulties = currentDifficulties.filter((d) => d !== difficultyKey)
    }
    newDifficulties = [...new Set(newDifficulties)]

    setFilters({ ...filters, difficulties: newDifficulties })
  }

  const isDifficultyChecked = (difficultyKey: string) => {
    return filters.difficulties.includes(difficultyKey)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold mb-4 flex items-center">
          <Filter className="mr-2 h-5 w-5" />
          Filtros
        </h2>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="search">Buscar por nombre</Label>
            <div className="flex space-x-2">
              <Input
                id="search"
                placeholder="Nombre de la ruta..."
                value={filters.search}
                onChange={handleSearchChange}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Dificultad</Label>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="difficulty-facil"
                  checked={isDifficultyChecked('fácil')}
                  onCheckedChange={(checked) => handleDifficultyChange("fácil", checked as boolean)}
                />
                <Label htmlFor="difficulty-facil" className="text-sm font-normal">
                  Fácil
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="difficulty-media"
                  checked={isDifficultyChecked('media')}
                  onCheckedChange={(checked) => handleDifficultyChange("media", checked as boolean)}
                />
                <Label htmlFor="difficulty-media" className="text-sm font-normal">
                  Media
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="difficulty-dificil"
                  checked={isDifficultyChecked('difícil')}
                  onCheckedChange={(checked) => handleDifficultyChange("difícil", checked as boolean)}
                />
                <Label htmlFor="difficulty-dificil" className="text-sm font-normal">
                  Difícil
                </Label>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <Label>Distancia (km)</Label>
              <span className="text-sm text-gray-500">
                {filters.minDistance} - {filters.maxDistance} km
              </span>
            </div>
            <Slider
              defaultValue={[0, 30]}
              max={50}
              step={1}
              value={[filters.minDistance, filters.maxDistance]}
              onValueChange={handleDistanceChange}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
