import { useEffect, useState } from "react";
import { Link, useParams } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2, MapPin, Calendar, ExternalLink } from "lucide-react";
import Comments from "@/components/Comments";

interface Museo {
  id: string;
  nombre: string;
  ciudad: string;
  pais: string;
  fundacion: string;
  descripcion: string;
  sitio_web: string;
  imagen: string;
}

interface Pintura {
  id: string;
  titulo: string;
  año: string;
  museo_id: string;
  imagen: string;
}

export default function MuseoDetalle() {
  const params = useParams();
  const [museo, setMuseo] = useState<Museo | null>(null);
  const [pinturas, setPinturas] = useState<Pintura[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function cargarDatos() {
      try {
        const museoRes = await fetch(`/data/museos/${params.id}.json`);
        const museoData = await museoRes.json();
        setMuseo(museoData);

        const indicesRes = await fetch("/data/indices.json");
        const indices = await indicesRes.json();

        const todasPinturas = await Promise.all(
          indices.pinturas.map(async (id: string) => {
            const res = await fetch(`/data/pinturas/${id}.json`);
            return res.json();
          })
        );

        const pinturasFiltradas = todasPinturas.filter(
          (p) => p.museo_id === params.id
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

  if (!museo) {
    return (
      <div className="container py-12">
        <p>No se encontró el museo</p>
      </div>
    );
  }

  return (
    <div className="py-12">
      <div className="container">
        <Link href="/museos">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver a museos
          </Button>
        </Link>

        <div className="mb-12">
          <Card className="overflow-hidden mb-8">
            <div className="aspect-[21/9] overflow-hidden bg-muted">
              <img
                src={`/images/museos/${museo.imagen}`}
                alt={museo.nombre}
                className="w-full h-full object-cover"
              />
            </div>
          </Card>

          <h1 className="text-4xl font-bold mb-6 text-foreground">
            {museo.nombre}
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardContent className="p-6 flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase mb-1">
                    Ubicación
                  </h3>
                  <p className="text-foreground">
                    {museo.ciudad}, {museo.pais}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 flex items-start gap-3">
                <Calendar className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase mb-1">
                    Fundación
                  </h3>
                  <p className="text-foreground">{museo.fundacion}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 flex items-start gap-3">
                <ExternalLink className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase mb-1">
                    Sitio web
                  </h3>
                  <a
                    href={museo.sitio_web}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    Visitar sitio
                  </a>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="prose max-w-none">
            <h2 className="text-2xl font-bold mb-4 text-foreground">
              Acerca del museo
            </h2>
            <p className="text-foreground leading-relaxed text-lg">
              {museo.descripcion}
            </p>
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
          title="Comentarios sobre este museo"
          description={`Comparte tus experiencias y opiniones sobre ${museo.nombre}`}
        />
      </div>
    </div>
  );
}
