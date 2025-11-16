import { useEffect, useState } from "react";
import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, MapPin } from "lucide-react";
import Comments from "@/components/Comments";

interface Museo {
  id: string;
  nombre: string;
  ciudad: string;
  pais: string;
  fundacion: string;
  imagen: string;
}

export default function Museos() {
  const [museos, setMuseos] = useState<Museo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function cargarMuseos() {
      try {
        const response = await fetch("/data/indices.json");
        const indices = await response.json();

        const museosData = await Promise.all(
          indices.museos.map(async (id: string) => {
            const res = await fetch(`/data/museos/${id}.json`);
            return res.json();
          })
        );

        setMuseos(museosData);
      } catch (error) {
        console.error("Error cargando museos:", error);
      } finally {
        setLoading(false);
      }
    }

    cargarMuseos();
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
            Museos
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Descubre los museos más importantes que albergan estas obras maestras
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {museos.map((museo) => (
            <Link key={museo.id} href={`/museo/${museo.id}`}>
              <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer h-full">
                <div className="aspect-video overflow-hidden bg-muted">
                  <img
                    src={`/images/museos/${museo.imagen}`}
                    alt={museo.nombre}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-3 text-foreground">
                    {museo.nombre}
                  </h3>
                  <div className="flex items-start gap-2 text-sm text-muted-foreground mb-2">
                    <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>
                      {museo.ciudad}, {museo.pais}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Fundado en {museo.fundacion}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      <Comments 
        title="Comentarios"
        description="Comparte tu opinión sobre estos museos y sus colecciones."
      />
    </div>
  );
}
