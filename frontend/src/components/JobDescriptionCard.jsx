import { FileSearch2 } from "lucide-react";

export function JobDescriptionCard({ value, onChange, onAnalyze, busy, error }) {
  return (
    <div className="glass rounded-[1.75rem] p-6">
      <div className="mb-4 flex items-center gap-3">
        <div className="rounded-2xl bg-lime/10 p-3 text-lime">
          <FileSearch2 className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-white">Job Description</h2>
          <p className="text-sm text-mist/70">Paste the target role description</p>
        </div>
      </div>

      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        rows={12}
        placeholder="Paste the job description here..."
        className="w-full rounded-[1.5rem] border border-white/10 bg-slate-950/60 p-4 text-sm text-white outline-none transition placeholder:text-mist/40 focus:border-aqua/60"
      />

      {error ? <p className="mt-4 text-sm text-coral">{error}</p> : null}

      <button
        type="button"
        disabled={busy}
        onClick={onAnalyze}
        className="mt-5 inline-flex items-center justify-center rounded-full bg-gradient-to-r from-aqua via-lime to-coral px-6 py-3 font-semibold text-slate-950 transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {busy ? "Analyzing..." : "Analyze Resume"}
      </button>
    </div>
  );
}

