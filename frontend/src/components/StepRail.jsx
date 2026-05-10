const steps = [
  "Upload your resume",
  "Paste the target job description",
  "Run AI-powered ATS analysis",
  "Review score, gaps, and suggestions",
];

export function StepRail() {
  return (
    <section className="grid gap-4 md:grid-cols-4">
      {steps.map((step, index) => (
        <div key={step} className="glass rounded-[1.5rem] p-5">
          <div className="mb-3 text-sm text-aqua">0{index + 1}</div>
          <div className="text-lg font-semibold text-white">{step}</div>
        </div>
      ))}
    </section>
  );
}

