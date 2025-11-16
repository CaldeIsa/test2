import { useEffect, useState } from "react";
import { Link, useParams } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import Comments from "@/components/Comments";

interface Artista {
  id: string;
  nombre: string;
  nacimiento: string;
  fallecimiento: string;
  nacionalidad: string;
  movimiento: string;
  biografia: string;
  imagen: string;
}

interface Pintura {
  id: string;
  titulo: string;
  año: string;
  artista_id: string;
  imagen: string;
}

export default function ArtistaDetalle() {
  const params = useParams();
  const [artista, setArtista] = useState<Artista | null>(null);
  const [pinturas, setPinturas] = useState<Pintura[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function cargarDatos() {
      try {
        const artistaRes = await fetch(`/data/artistas/${params.id}.json`);
        const artistaData = await artistaRes.json();
        setArtista(artistaData);

        const indicesRes = await fetch("/data/indices.json");
        const indices = await indicesRes.json();

        const todasPinturas = await Promise.all(
          indices.pinturas.map(async (id: string) => {
            const res = await fetch(`/data/pinturas/${id}.json`);
            return res.json();
          })
        );

        const pinturasFiltradas = todasPinturas.filter(
          (p) => p.artista_id === params.id
        );
        setPinturas(pinturasFiltradas);
      } catch (error) {
        console.error("Error cargando datos:", error);
      } finally {
        setLoading(false);
      }
    }

    cargarDatos();
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!artista) {
    return (
      <div className="container py-12">
        <p>No se encontró el artista</p>
      </div>
    );
  }

  return (
    <div className="py-12">
      <div className="container">
        <Link href="/artistas">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver a artistas
          </Button>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-12">
          <div className="lg:col-span-1">
            <Card className="overflow-hidden">
              <img
                src={`/images/artistas/${artista.imagen}`}
                alt={artista.nombre}
                className="w-full h-auto"
              />
            </Card>
          </div>

          <div className="lg:col-span-2">
            <h1 className="text-4xl font-bold mb-4 text-foreground">
              {artista.nombre}
            </h1>

            <div className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase mb-2">
                    Nacimiento
                  </h3>
                  <p className="text-foreground">{artista.nacimiento}</p>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase mb-2">
                    Fallecimiento
                  </h3>
                  <p className="text-foreground">{artista.fallecimiento}</p>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase mb-2">
                    Nacionalidad
                  </h3>
                  <p className="text-foreground">{artista.nacionalidad}</p>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase mb-2">
                    Movimiento
                  </h3>
                  <p className="text-foreground">{artista.movimiento}</p>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3 text-foreground">
                  Biografía
                </h3>
                <p className="text-foreground leading-relaxed">
                  {artista.biografia}
                </p>
              </div>
            </div>
          </div>
        </div>

        {pinturas.length > 0 && (
          <div>
            <h2 className="text-3xl font-bold mb-8 text-foreground">
              Obras en el catálogo
            </h2>

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
        )}

        <Comments 
          title="Comentarios sobre este artista"
          description={`Comparte tus pensamientos sobre ${artista.nombre}`}
        />
      </div>
    </div>
  );
}
