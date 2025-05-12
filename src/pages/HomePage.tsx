import { MapContainer } from "@/components/MapContainer"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col">
      <header className="bg-green-700 text-white p-4 shadow-md">
        <div className="container mx-auto">
          <h1 className="text-2xl font-bold">RutasVerdes Castilla y León</h1>
          <p className="text-sm">Explora senderos y espacios naturales de la región</p>
        </div>
      </header>

      <div className="flex flex-col md:flex-row flex-1">
        <div className="flex-1 flex flex-col">
          <MapContainer />
        </div>
      </div>

      <footer className="bg-gray-100 p-4 text-center text-sm text-gray-600">
        <p>© 2025 RutasVerdes Castilla y León - Datos proporcionados por la Junta de Castilla y León e IGN</p>
      </footer>
    </main>
  )
}
