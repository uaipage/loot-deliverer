import { useEffect, useRef, useState } from "react";
import { MatchedItem } from "@/lib/types";

interface ResultsPanelProps {
  results: MatchedItem[] | null;
  error: string | null;
}

function AnimatedTotal({ value }: { value: number }) {
  const [display, setDisplay] = useState(0);
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    setDisplay(0);
    setPulse(false);
    const duration = 750;
    const start = performance.now();

    const tick = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(eased * value));

      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        setPulse(true);
        setTimeout(() => setPulse(false), 600);
      }
    };

    requestAnimationFrame(tick);
  }, [value]);

  return (
    <span
      className={`text-accent font-mono text-2xl font-bold transition-all ${
        pulse ? "scale-110 brightness-125" : ""
      }`}
      style={{ display: "inline-block" }}
    >
      {display.toLocaleString()} GP
    </span>
  );
}

export default function ResultsPanel({ results, error }: ResultsPanelProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [visibleRows, setVisibleRows] = useState<number>(0);

  useEffect(() => {
    if (results && results.length > 0) {
      scrollRef.current?.scrollTo({ top: 0 });
      setVisibleRows(0);
      let i = 0;
      const interval = setInterval(() => {
        i++;
        setVisibleRows(i);
        if (i >= results.length) clearInterval(interval);
      }, 60);
      return () => clearInterval(interval);
    }
  }, [results]);

  if (error) {
    return (
      <div className="flex flex-1 items-center justify-center p-8">
        <p className="font-mono text-sm text-destructive">{error}</p>
      </div>
    );
  }

  if (results === null) {
    return (
      <div className="flex flex-1 items-center justify-center p-8">
        <p className="font-mono text-sm text-muted-foreground">
          No Matches Found
        </p>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center p-8">
        <p className="font-mono text-sm text-muted-foreground">
          No Matches Found
        </p>
      </div>
    );
  }

  const totalValue = results.reduce((sum, item) => sum + item.total, 0);

  return (
    <div ref={scrollRef} className="flex flex-1 flex-col overflow-auto">
      <div className="flex-1 overflow-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-border text-left">
              <th className="px-4 py-3 font-mono text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Img
              </th>
              <th className="px-4 py-3 font-mono text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Item
              </th>
              <th className="px-4 py-3 font-mono text-xs font-semibold uppercase tracking-widest text-muted-foreground text-right">
                Qty
              </th>
              <th className="px-4 py-3 font-mono text-xs font-semibold uppercase tracking-widest text-muted-foreground text-right">
                Value
              </th>
              <th className="px-4 py-3 font-mono text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Market
              </th>
              <th className="px-4 py-3 font-mono text-xs font-semibold uppercase tracking-widest text-muted-foreground text-right">
                Total
              </th>
            </tr>
          </thead>
          <tbody>
            {results.map((item, index) => {
              const isHighValue = item.marketValue === "Very High";
              return (
                <tr
                  key={item.nome + index}
                  className={`border-b border-border transition-opacity duration-300 ${
                    index < visibleRows ? "opacity-100" : "opacity-0"
                  } ${isHighValue ? "bg-accent/10" : ""}`}
                >
                  <td className="px-4 py-2">
                    <img
                      src={item.img}
                      alt={item.nome}
                      className="h-8 w-8 object-contain"
                      loading="lazy"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                      }}
                    />
                  </td>
                  <td className={`px-4 py-2 font-medium ${isHighValue ? "text-accent" : "text-foreground"}`}>
                    {item.nome}
                  </td>
                  <td className="px-4 py-2 text-right tabular-nums text-foreground">
                    {item.qty}
                  </td>
                  <td className="px-4 py-2 text-right tabular-nums text-foreground">
                    {parseInt(item.valor).toLocaleString()}
                  </td>
                  <td className={`px-4 py-2 ${isHighValue ? "text-accent font-semibold" : "text-muted-foreground"}`}>
                    {item.marketValue}
                  </td>
                  <td className={`px-4 py-2 text-right tabular-nums font-semibold ${isHighValue ? "text-accent" : "text-foreground"}`}>
                    {item.total.toLocaleString()}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Total summary */}
      <div className="border-t border-border bg-card px-4 py-4 text-right">
        <span className="mr-4 font-mono text-xs uppercase tracking-widest text-muted-foreground">
          Total Weekly Value Found:
        </span>
        <AnimatedTotal value={totalValue} />
      </div>
    </div>
  );
}
