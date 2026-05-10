import { motion } from "framer-motion";
import { ArrowRight, BrainCircuit, Sparkles } from "lucide-react";

export function Hero() {
  return (
    <section className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-mesh px-6 py-14 shadow-glow md:px-10 md:py-20">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.08),transparent_55%)]" />
      <div className="relative grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-5 inline-flex items-center gap-2 rounded-full border border-aqua/30 bg-aqua/10 px-4 py-2 text-sm text-aqua"
          >
            <Sparkles className="h-4 w-4" />
            AI-Powered College Project Demo
          </motion.div>
          <h1 className="max-w-3xl font-display text-4xl font-bold leading-tight text-white md:text-6xl">
            AI Resume Analyzer that feels like a real hiring intelligence product.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-8 text-mist/85 md:text-lg">
            Upload a resume, paste a job description, and get ATS scoring, matched skills,
            missing keywords, and targeted improvement tips in one polished dashboard.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <a
              href="#analyzer"
              className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 font-semibold text-slate-950 transition hover:scale-[1.02]"
            >
              Start Analysis
              <ArrowRight className="h-4 w-4" />
            </a>
            <div className="text-sm text-mist/70">
              Supports `PDF`, `DOCX`, and `TXT`
            </div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="glass rounded-[1.75rem] p-6"
        >
          <div className="mb-5 flex items-center justify-between">
            <div>
              <div className="text-sm uppercase tracking-[0.28em] text-mist/60">Live Preview</div>
              <div className="mt-1 text-xl font-semibold text-white">Insight Snapshot</div>
            </div>
            <div className="rounded-2xl bg-lime/15 p-3 text-lime">
              <BrainCircuit className="h-6 w-6" />
            </div>
          </div>
          <div className="space-y-4">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
              <div className="text-sm text-mist/70">ATS Match</div>
              <div className="mt-2 text-4xl font-bold text-white">84%</div>
              <div className="mt-3 h-3 overflow-hidden rounded-full bg-white/10">
                <div className="h-full w-[84%] rounded-full bg-gradient-to-r from-aqua via-lime to-coral" />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                <div className="text-sm text-mist/70">Matched Skills</div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {["python", "fastapi", "sql", "nlp"].map((item) => (
                    <span key={item} className="rounded-full bg-aqua/12 px-3 py-1 text-sm text-aqua">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                <div className="text-sm text-mist/70">Missing Skills</div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {["aws", "docker", "ci/cd"].map((item) => (
                    <span key={item} className="rounded-full bg-coral/12 px-3 py-1 text-sm text-coral">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

