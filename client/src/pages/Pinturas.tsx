import { useEffect, useState } from "react";
import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import Comments from "@/components/Comments";

interface Pintura {
  id: string;
  titulo: string;
  año: string;
  artista_id: string;
  imagen: string;
}

export default function Pinturas() {
  const [pinturas, setPinturas] = useState<Pintura[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function cargarPinturas() {
      try {
        const response = await fetch("/data/indices.json");
        const indices = await response.json();

        const pinturasData = await Promise.all(
          indices.pinturas.map(async (id: string) => {
            const res = await fetch(`/data/pinturas/${id}.json`);
            return res.json();
          })
        );

        setPinturas(pinturasData);
      } catch (error) {
        console.error("Error cargando pinturas:", error);
      } finally {
        setLoading(false);
      }
    }

    cargarPinturas();
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
            Pinturas Famosas
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Explora una colección de las obras maestras más icónicas de la historia del arte
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {pinturas.map((pintura) => (
            <Link key={pintura.id} href={`/pintura/${pintura.id}`}>
              <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer h-full">
                <div className="aspect-[4/3] overflow-hidden bg-muted">
                  <img
                    src={`/images/pinturas/${pintura.imagen}`}
                    alt={pintura.titulo}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-2 text-foreground">
                    {pintura.titulo}
                  </h3>
                  <p className="text-sm text-muted-foreground">{pintura.año}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      <Comments 
        title="Comentarios"
        description="Comparte tu opinión sobre estas obras maestras de la historia del arte."
      />
    </div>
  );
}
