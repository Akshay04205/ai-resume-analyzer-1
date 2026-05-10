import { motion } from "framer-motion";

const loadingSteps = [
  "Extracting resume text",
  "Mapping job description keywords",
  "Scoring ATS compatibility",
  "Drafting improvement suggestions",
];

export function LoadingOverlay({ visible }) {
  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 backdrop-blur-md">
      <div className="glass relative w-[min(92vw,30rem)] overflow-hidden rounded-[2rem] p-8 text-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 2.2, ease: "linear" }}
          className="ring-gradient mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full p-[2px]"
        >
          <div className="flex h-full w-full items-center justify-center rounded-full bg-slate-950">
            <motion.div
              animate={{ scale: [0.9, 1.06, 0.9] }}
              transition={{ repeat: Infinity, duration: 1.8 }}
              className="h-10 w-10 rounded-full bg-gradient-to-br from-aqua via-lime to-coral"
            />
          </div>
        </motion.div>
        <h3 className="text-2xl font-semibold text-white">Analyzing Resume...</h3>
        <p className="mt-3 text-sm leading-7 text-mist/75">
          Extracting content, comparing JD keywords, scoring ATS fit, and generating
          targeted improvement suggestions.
        </p>
        <div className="mt-6 space-y-2 text-left">
          {loadingSteps.map((step, index) => (
            <motion.div
              key={step}
              initial={{ opacity: 0.25, x: -8 }}
              animate={{ opacity: [0.35, 1, 0.35], x: [0, 4, 0] }}
              transition={{ repeat: Infinity, duration: 2.4, delay: index * 0.2 }}
              className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-mist/80"
            >
              {step}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
