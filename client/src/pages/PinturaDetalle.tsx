import { useEffect, useState } from "react";
import { Link, useParams } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2, User, Building2 } from "lucide-react";
import Comments from "@/components/Comments";

interface Pintura {
  id: string;
  titulo: string;
  año: string;
  tecnica: string;
  descripcion: string;
  dimensiones: string;
  artista_id: string;
  museo_id: string;
  imagen: string;
  precio: number;
}

interface Artista {
  id: string;
  nombre: string;
}

interface Museo {
  id: string;
  nombre: string;
  ciudad: string;
  pais: string;
}

export default function PinturaDetalle() {
  const params = useParams();
  const [pintura, setPintura] = useState<Pintura | null>(null);
  const [artista, setArtista] = useState<Artista | null>(null);
  const [museo, setMuseo] = useState<Museo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function cargarDatos() {
      try {
        const pinturaRes = await fetch(`/data/pinturas/${params.id}.json`);
        const pinturaData = await pinturaRes.json();
        setPintura(pinturaData);

        const artistaRes = await fetch(`/data/artistas/${pinturaData.artista_id}.json`);
        const artistaData = await artistaRes.json();
        setArtista(artistaData);

        const museoRes = await fetch(`/data/museos/${pinturaData.museo_id}.json`);
        const museoData = await museoRes.json();
        setMuseo(museoData);
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

  if (!pintura || !artista || !museo) {
    return (
      <div className="container py-12">
        <p>No se encontró la pintura</p>
      </div>
    );
  }

  return (
    <div className="py-12">
      <div className="container">
        <Link href="/">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver a pinturas
          </Button>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <Card className="overflow-hidden">
              <img
                src={`/images/pinturas/${pintura.imagen}`}
                alt={pintura.titulo}
                className="w-full h-auto"
              />
            </Card>
          </div>

          <div>
            <h1 className="text-4xl font-bold mb-4 text-foreground">
              {pintura.titulo}
            </h1>

            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-semibold text-muted-foreground uppercase mb-2">
                  Descripción
                </h3>
                <p className="text-foreground leading-relaxed">
                  {pintura.descripcion}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase mb-2">
                    Año
                  </h3>
                  <p className="text-foreground">{pintura.año}</p>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase mb-2">
                    Técnica
                  </h3>
                  <p className="text-foreground">{pintura.tecnica}</p>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase mb-2">
                    Dimensiones
                  </h3>
                  <p className="text-foreground">{pintura.dimensiones}</p>
                </div>
              </div>

                            <div className="mt-6 pt-6 border-t border-border">
                <div className="flex items-center justify-between">
                  <p className="text-2xl font-bold text-foreground">${pintura.precio.toFixed(2)}</p>
                  <Button
                    className="snipcart-add-item"
                    data-item-id={pintura.id}
                    data-item-price={pintura.precio}
                    data-item-url={`/pintura/${pintura.id}`}
                    data-item-name={pintura.titulo}
                    data-item-image={`/images/pinturas/${pintura.imagen}`}>
                    Agregar al carrito
                  </Button>
                </div>
              </div>

              <div className="pt-6 border-t border-border">
                <h3 className="text-lg font-semibold mb-4 text-foreground">
                  Información relacionada
                </h3>

                <div className="space-y-4">
                  <Link href={`/artista/${artista.id}`}>
                    <Card className="hover:shadow-md transition-shadow cursor-pointer">
                      <CardContent className="p-4 flex items-center gap-3">
                        <User className="w-5 h-5 text-primary" />
                        <div>
                          <p className="text-sm text-muted-foreground">Artista</p>
                          <p className="font-semibold text-foreground">{artista.nombre}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>

                  <Link href={`/museo/${museo.id}`}>
                    <Card className="hover:shadow-md transition-shadow cursor-pointer">
                      <CardContent className="p-4 flex items-center gap-3">
                        <Building2 className="w-5 h-5 text-primary" />
                        <div>
                          <p className="text-sm text-muted-foreground">Museo</p>
                          <p className="font-semibold text-foreground">{museo.nombre}</p>
                          <p className="text-sm text-muted-foreground">
                            {museo.ciudad}, {museo.pais}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Comments 
          title="Comentarios sobre esta obra"
          description={`Comparte tus pensamientos sobre ${pintura.titulo}`}
        />
      </div>
    </div>
  );
}
