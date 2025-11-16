import { useEffect, useState } from "react";
import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import Comments from "@/components/Comments";

interface Artista {
  id: string;
  nombre: string;
  nacimiento: string;
  fallecimiento: string;
  nacionalidad: string;
  movimiento: string;
  imagen: string;
}

export default function Artistas() {
  const [artistas, setArtistas] = useState<Artista[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function cargarArtistas() {
      try {
        const response = await fetch("/data/indices.json");
        const indices = await response.json();

        const artistasData = await Promise.all(
          indices.artistas.map(async (id: string) => {
            const res = await fetch(`/data/artistas/${id}.json`);
            return res.json();
          })
        );

        setArtistas(artistasData);
      } catch (error) {
        console.error("Error cargando artistas:", error);
      } finally {
        setLoading(false);
      }
    }

    cargarArtistas();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="py-12">
      <div className="container">
        <div className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
            Artistas
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Conoce a los grandes maestros detrás de las obras más icónicas
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {artistas.map((artista) => (
            <Link key={artista.id} href={`/artista/${artista.id}`}>
              <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer h-full">
                <div className="aspect-square overflow-hidden bg-muted">
                  <img
                    src={`/images/artistas/${artista.imagen}`}
                    alt={artista.nombre}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-2 text-foreground">
                    {artista.nombre}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-1">
                    {artista.nacimiento} - {artista.fallecimiento}
                  </p>
                  <p className="text-sm text-primary font-medium">
                    {artista.movimiento}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      <Comments 
        title="Comentarios"
        description="Comparte tu opinión sobre estos grandes maestros del arte."
      />
    </div>
  );
}
