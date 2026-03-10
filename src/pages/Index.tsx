import { useState, useRef, useCallback } from "react";
import { parseLoot, findWeeklyMatches } from "@/lib/loot-parser";
import { WeeklyItem, MatchedItem } from "@/lib/types";
import ResultsPanel from "@/components/ResultsPanel";

const Index = () => {
  const [weeklyJson, setWeeklyJson] = useState("");
  const [analyzerText, setAnalyzerText] = useState("");
  const [results, setResults] = useState<MatchedItem[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAnalyze = useCallback(() => {
    setError(null);

    let weeklyItems: WeeklyItem[];
    try {
      weeklyItems = JSON.parse(weeklyJson);
      if (!Array.isArray(weeklyItems)) throw new Error();
    } catch {
      setError("Invalid JSON. Paste a valid weekly items array.");
      setResults(null);
      return;
    }

    const lootItems = parseLoot(analyzerText);
    if (lootItems.length === 0) {
      setError("No looted items found. Make sure the text contains 'Looted Items:' section.");
      setResults(null);
      return;
    }

    const matches = findWeeklyMatches(lootItems, weeklyItems);
    setResults(matches);
  }, [weeklyJson, analyzerText]);

  const handleClear = useCallback(() => {
    setWeeklyJson("");
    setAnalyzerText("");
    setResults(null);
    setError(null);
  }, []);

  const handleLoadFile = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        setWeeklyJson(ev.target?.result as string);
      };
      reader.readAsText(file);
      e.target.value = "";
    },
    []
  );

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background">
      {/* Left: Two input columns */}
      <div className="flex w-2/5 min-w-0 flex-col border-r border-border lg:flex-row">
        {/* Weekly JSON */}
        <div className="flex flex-1 flex-col border-b border-border lg:border-b-0 lg:border-r">
          <label className="border-b border-border px-4 py-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Weekly Items JSON
          </label>
          <textarea
            className="flex-1 resize-none bg-card p-4 text-sm text-card-foreground placeholder:text-muted-foreground focus:outline-none"
            placeholder='Paste weekly delivery JSON array here...'
            value={weeklyJson}
            onChange={(e) => setWeeklyJson(e.target.value)}
            spellCheck={false}
          />
        </div>

        {/* Hunting Analyzer */}
        <div className="flex flex-1 flex-col">
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
      </div>

      {/* Action bar between input and results */}
      <div className="flex flex-col items-center justify-center gap-3 border-r border-border bg-background px-3">
        <button
          onClick={handleAnalyze}
          className="whitespace-nowrap bg-primary px-4 py-2 font-mono text-xs font-bold uppercase tracking-wider text-primary-foreground transition-colors hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-ring"
        >
          Analyze Loot
        </button>
        <button
          onClick={handleLoadFile}
          className="whitespace-nowrap bg-secondary px-4 py-2 font-mono text-xs font-medium uppercase tracking-wider text-secondary-foreground transition-colors hover:brightness-125 focus:outline-none"
        >
          Load JSON File
        </button>
        <button
          onClick={handleClear}
          className="whitespace-nowrap bg-secondary px-4 py-2 font-mono text-xs font-medium uppercase tracking-wider text-secondary-foreground transition-colors hover:brightness-125 focus:outline-none"
        >
          Clear
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>

      {/* Results */}
      <div className="flex flex-1 flex-col min-w-0">
        <label className="border-b border-border px-4 py-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Results
        </label>
        <ResultsPanel results={results} error={error} />
      </div>
    </div>
  );
};

export default Index;
