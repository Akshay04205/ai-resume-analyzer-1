import { useState } from "react";
import { motion } from "framer-motion";

import { Hero } from "./components/Hero";
import { JobDescriptionCard } from "./components/JobDescriptionCard";
import { LoadingOverlay } from "./components/LoadingOverlay";
import { ResultsDashboard } from "./components/ResultsDashboard";
import { StepRail } from "./components/StepRail";
import { UploadCard } from "./components/UploadCard";
import { analyzeResume } from "./lib/api";

export default function App() {
  const [file, setFile] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState(null);
  const [fileError, setFileError] = useState("");
  const [jdError, setJdError] = useState("");
  const [apiError, setApiError] = useState("");

  async function handleAnalyze() {
    let valid = true;
    setFileError("");
    setJdError("");
    setApiError("");

    if (!file) {
      setFileError("Please upload a resume file before analyzing.");
      valid = false;
    }

    if (file && !["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "text/plain"].includes(file.type) && !/\.(pdf|docx|txt)$/i.test(file.name)) {
      setFileError("Unsupported file type. Please upload a PDF, DOCX, or TXT file.");
      valid = false;
    }

    if (!jobDescription.trim()) {
      setJdError("Please paste a job description.");
      valid = false;
    }

    if (!valid) return;

    try {
      setBusy(true);
      setResult(null);
      const data = await analyzeResume({ file, jobDescription });
      setResult(data);
    } catch (error) {
      setApiError(error.message || "Something went wrong while analyzing the resume.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="relative">
      <LoadingOverlay visible={busy} />

      <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-10 px-4 py-6 md:px-6 md:py-10">
        <Hero />
        <StepRail />

        <section id="analyzer" className="grid gap-6 lg:grid-cols-2">
          <UploadCard file={file} onFileChange={setFile} error={fileError} />
          <JobDescriptionCard
            value={jobDescription}
            onChange={setJobDescription}
            onAnalyze={handleAnalyze}
            busy={busy}
            error={jdError}
          />
        </section>

        {apiError ? (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-[1.5rem] border border-coral/30 bg-coral/10 p-4 text-sm text-coral"
          >
            {apiError}
          </motion.div>
        ) : null}

        <ResultsDashboard result={result} />
      </main>
    </div>
  );
}
