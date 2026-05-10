import { motion } from "framer-motion";
import { CheckCircle2, CircleAlert, Sparkles, UserRound } from "lucide-react";

function Pill({ children, tone = "default" }) {
  const styles = {
    default: "bg-white/8 text-mist",
    success: "bg-lime/12 text-lime",
    danger: "bg-coral/12 text-coral",
  };

  return <span className={`rounded-full px-3 py-1 text-sm ${styles[tone]}`}>{children}</span>;
}

export function ResultsDashboard({ result }) {
  if (!result) return null;

  const scoreBreakdown = result.score_breakdown || {
    matched_count: result.matched_skills.length,
    required_count: result.required_skills.length,
    keyword_coverage: result.ats_score,
    formatting_score: 0,
    impact_score: 0,
    overall_score: result.ats_score,
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="glass rounded-[1.75rem] p-6">
          <div className="text-sm uppercase tracking-[0.25em] text-mist/60">ATS Score</div>
          <div className="mt-4 flex items-end gap-3">
            <span className="font-display text-6xl font-bold text-white">{result.ats_score}</span>
            <span className="pb-2 text-xl text-mist/70">/100</span>
          </div>
          <div className="mt-5 h-4 overflow-hidden rounded-full bg-white/8">
            <div
              className="h-full rounded-full bg-gradient-to-r from-aqua via-lime to-coral"
              style={{ width: `${result.ats_score}%` }}
            />
          </div>
          <p className="mt-5 text-sm leading-7 text-mist/75">{result.summary}</p>
          <div className="mt-5 flex flex-wrap gap-2">
            <Pill>{result.model_used}</Pill>
            <Pill>{result.required_skills.length} required skills</Pill>
            <Pill>{result.matched_skills.length} matched</Pill>
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div className="glass rounded-[1.75rem] p-6">
            <div className="mb-4 flex items-center gap-3 text-lime">
              <CheckCircle2 className="h-5 w-5" />
              <h3 className="text-lg font-semibold text-white">Matched Skills</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {result.matched_skills.length ? result.matched_skills.map((skill) => (
                <Pill key={skill} tone="success">{skill}</Pill>
              )) : <span className="text-sm text-mist/65">No strong keyword matches found.</span>}
            </div>
          </div>

          <div className="glass rounded-[1.75rem] p-6">
            <div className="mb-4 flex items-center gap-3 text-coral">
              <CircleAlert className="h-5 w-5" />
              <h3 className="text-lg font-semibold text-white">Missing Skills</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {result.missing_skills.length ? result.missing_skills.map((skill) => (
                <Pill key={skill} tone="danger">{skill}</Pill>
              )) : <span className="text-sm text-mist/65">No major gaps detected.</span>}
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {[
          {
            label: "Keyword Coverage",
            value: scoreBreakdown.keyword_coverage,
            caption: `${scoreBreakdown.matched_count}/${scoreBreakdown.required_count || 0} required skills matched`,
          },
          {
            label: "Resume Formatting",
            value: scoreBreakdown.formatting_score,
            caption: "Checks sections, contacts, and ATS-friendly structure",
          },
          {
            label: "Impact Signals",
            value: scoreBreakdown.impact_score,
            caption: "Rewards quantified outcomes and action-oriented bullets",
          },
        ].map((item) => (
          <div key={item.label} className="glass rounded-[1.75rem] p-6">
            <div className="text-sm uppercase tracking-[0.22em] text-mist/55">{item.label}</div>
            <div className="mt-4 text-4xl font-display font-bold text-white">{item.value}</div>
            <div className="mt-4 h-3 overflow-hidden rounded-full bg-white/8">
              <div
                className="h-full rounded-full bg-gradient-to-r from-aqua via-lime to-coral"
                style={{ width: `${item.value}%` }}
              />
            </div>
            <p className="mt-4 text-sm leading-7 text-mist/75">{item.caption}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="glass rounded-[1.75rem] p-6">
          <div className="mb-4 flex items-center gap-3">
            <UserRound className="h-5 w-5 text-aqua" />
            <h3 className="text-lg font-semibold text-white">Extracted Candidate Profile</h3>
          </div>
          <div className="space-y-3 text-sm text-mist/80">
            <p><span className="text-mist/55">Name:</span> {result.candidate_name || "Not clearly detected"}</p>
            <p><span className="text-mist/55">Email:</span> {result.email || "Not detected"}</p>
            <p><span className="text-mist/55">Phone:</span> {result.phone || "Not detected"}</p>
            <p><span className="text-mist/55">Resume skills:</span> {result.skills.join(", ") || "No skills extracted"}</p>
          </div>
        </div>

        <div className="glass rounded-[1.75rem] p-6">
          <div className="mb-4 flex items-center gap-3">
            <Sparkles className="h-5 w-5 text-lime" />
            <h3 className="text-lg font-semibold text-white">AI Suggestions</h3>
          </div>
          <div className="space-y-3">
            {result.suggestions.map((item, index) => (
              <div key={`${item}-${index}`} className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm leading-7 text-mist/80">
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="glass rounded-[1.75rem] p-6">
          <h3 className="text-lg font-semibold text-white">Experience Highlights</h3>
          <div className="mt-4 space-y-3">
            {result.experience_highlights.length ? result.experience_highlights.map((item, index) => (
              <div key={`${item}-${index}`} className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm leading-7 text-mist/80">
                {item}
              </div>
            )) : <p className="text-sm text-mist/65">No clear bullet-style highlights extracted.</p>}
          </div>
        </div>

        <div className="glass rounded-[1.75rem] p-6">
          <h3 className="text-lg font-semibold text-white">Resume Preview</h3>
          <p className="mt-2 text-sm leading-6 text-mist/60">
            This is a short preview of the raw text extracted from the uploaded resume and used by the analyzer.
          </p>
          <p className="mt-4 whitespace-pre-line text-sm leading-7 text-mist/75">
            {result.resume_excerpt || "No excerpt available."}
          </p>
        </div>
      </div>
    </motion.section>
  );
}
