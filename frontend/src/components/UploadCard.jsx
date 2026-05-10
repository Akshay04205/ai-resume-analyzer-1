import { useState } from "react";
import { FileText, UploadCloud } from "lucide-react";

export function UploadCard({ file, onFileChange, error }) {
  const [dragActive, setDragActive] = useState(false);

  function handleDrop(event) {
    event.preventDefault();
    setDragActive(false);
    onFileChange(event.dataTransfer.files?.[0] || null);
  }

  return (
    <div className="glass rounded-[1.75rem] p-6">
      <div className="mb-4 flex items-center gap-3">
        <div className="rounded-2xl bg-aqua/10 p-3 text-aqua">
          <UploadCloud className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-white">Upload Resume</h2>
          <p className="text-sm text-mist/70">Drag and drop or browse a file</p>
        </div>
      </div>

      <label
        onDragOver={(event) => {
          event.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={handleDrop}
        className={`block cursor-pointer rounded-[1.5rem] border border-dashed p-8 text-center transition ${
          dragActive
            ? "border-aqua/60 bg-aqua/10"
            : "border-white/15 bg-white/5 hover:border-aqua/50 hover:bg-white/8"
        }`}
      >
        <input
          type="file"
          accept=".pdf,.docx,.txt"
          className="hidden"
          onChange={(event) => onFileChange(event.target.files?.[0] || null)}
        />
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-white/10">
          <FileText className="h-6 w-6 text-white" />
        </div>
        <div className="text-base font-semibold text-white">
          {file ? file.name : "Choose a resume file"}
        </div>
        <div className="mt-2 text-sm text-mist/65">Supported formats: PDF, DOCX, TXT</div>
      </label>

      {error ? <p className="mt-4 text-sm text-coral">{error}</p> : null}
    </div>
  );
}
