import { useEffect, useRef } from "react";

import {
  UTTERANCES_ISSUE_TERM,
  UTTERANCES_LABEL,
  UTTERANCES_REPO,
  UTTERANCES_THEME,
} from "@/const";

interface CommentsProps {
  title?: string;
  description?: string;
}

export default function Comments({ title = "Comentarios", description = "" }: CommentsProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !UTTERANCES_REPO) return;

    const container = containerRef.current;
    container.innerHTML = "";

    const script = document.createElement("script");
    script.src = "https://utteranc.es/client.js";
    script.async = true;
    script.crossOrigin = "anonymous";
    script.setAttribute("repo", UTTERANCES_REPO);
    script.setAttribute("issue-term", UTTERANCES_ISSUE_TERM);
    script.setAttribute("theme", UTTERANCES_THEME);
    script.setAttribute("loading", "lazy");

    if (UTTERANCES_LABEL) {
      script.setAttribute("label", UTTERANCES_LABEL);
    }

    script.onerror = () => {
      container.innerHTML =
        "<p class=\"text-sm text-muted-foreground\">No se pudo cargar el sistema de comentarios. Verifica la configuración de Utterances.</p>";
    };

    container.appendChild(script);
  }, []);

  return (
    <div className="mt-12 pt-8 border-t border-border">
      <h2 className="text-2xl font-bold mb-2 text-foreground">{title}</h2>
      {description && (
        <p className="text-muted-foreground mb-6">{description}</p>
      )}
      <div 
        ref={containerRef}
        className="w-full"
        style={{ minHeight: "400px" }}
      />
    </div>
  );
}
