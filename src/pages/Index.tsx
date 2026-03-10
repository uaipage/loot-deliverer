import { useState, useCallback } from "react";
import { parseLoot, findWeeklyMatches } from "@/lib/loot-parser";
import { MatchedItem } from "@/lib/types";
import { WEEKLY_ITEMS } from "@/lib/weekly-items";
import ResultsPanel from "@/components/ResultsPanel";

const Index = () => {
  const [analyzerText, setAnalyzerText] = useState("");
  const [results, setResults] = useState<MatchedItem[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = useCallback(() => {
    setError(null);

    const lootItems = parseLoot(analyzerText);
    if (lootItems.length === 0) {
      setError("No looted items found. Make sure the text contains 'Looted Items:' section.");
      setResults(null);
      return;
    }

    const matches = findWeeklyMatches(lootItems, WEEKLY_ITEMS);
    setResults(matches);
  }, [analyzerText]);

  const handleClear = useCallback(() => {
    setAnalyzerText("");
    setResults(null);
    setError(null);
  }, []);

  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden bg-background">
      <div className="flex flex-1 min-h-0">
        {/* Left: Hunting Analyzer Input */}
        <div className="flex w-1/3 min-w-0 flex-col border-r border-border">
          <label className="border-b border-border px-4 py-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Hunting Analyzer Input
          </label>
          <textarea
            className="flex-1 resize-none bg-card p-4 text-sm text-card-foreground placeholder:text-muted-foreground focus:outline-none"
            placeholder="Paste Hunting Analyzer clipboard here..."
            value={analyzerText}
            onChange={(e) => setAnalyzerText(e.target.value)}
            spellCheck={false}
          />
        </div>

        {/* Action bar */}
        <div className="flex flex-col items-center justify-center gap-3 border-r border-border bg-background px-3">
          <a
            href="https://github.com/M1113R"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[10px] text-muted-foreground hover:text-primary transition-colors"
          >
            feito por <span className="font-semibold">M1113R</span>
          </a>
          <button
            onClick={handleAnalyze}
            className="whitespace-nowrap bg-primary px-4 py-2 font-mono text-xs font-bold uppercase tracking-wider text-primary-foreground transition-colors hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-ring"
          >
            Analyze Loot
          </button>
          <button
            onClick={handleClear}
            className="whitespace-nowrap bg-secondary px-4 py-2 font-mono text-xs font-medium uppercase tracking-wider text-secondary-foreground transition-colors hover:brightness-125 focus:outline-none"
          >
            Clear
          </button>
        </div>

        {/* Results */}
        <div className="flex flex-1 flex-col min-w-0">
          <label className="border-b border-border px-4 py-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Results
          </label>
          <ResultsPanel results={results} error={error} />
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-border px-4 py-1.5 text-center text-[10px] text-muted-foreground">
        by{" "}
        <a
          href="https://github.com/M1113R"
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline"
        >
          M1113R
        </a>
      </footer>
    </div>
  );
};

export default Index;
