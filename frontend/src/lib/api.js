const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

export async function analyzeResume({ file, jobDescription }) {
  const formData = new FormData();
  formData.append("resume", file);
  formData.append("job_description", jobDescription);
  // #region agent log
  fetch("http://127.0.0.1:7753/ingest/63612bb6-5898-4706-bb65-c7771289492f", {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Debug-Session-Id": "6fe10d" },
    body: JSON.stringify({
      sessionId: "6fe10d",
      runId: "initial",
      hypothesisId: "H6",
      location: "frontend/src/lib/api.js:analyzeResume",
      message: "Analyze invoked from UI",
      data: {
        apiBaseUrl: API_BASE_URL,
        hasFile: Boolean(file),
        fileName: file?.name ?? null,
        jobDescriptionLength: (jobDescription || "").length,
      },
      timestamp: Date.now(),
    }),
  }).catch(() => {});
  // #endregion

  let response;
  try {
    response = await fetch(`${API_BASE_URL}/api/v1/analyze`, {
      method: "POST",
      body: formData,
    });
  } catch (error) {
    // #region agent log
    fetch("http://127.0.0.1:7753/ingest/63612bb6-5898-4706-bb65-c7771289492f", {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Debug-Session-Id": "6fe10d" },
      body: JSON.stringify({
        sessionId: "6fe10d",
        runId: "initial",
        hypothesisId: "H7",
        location: "frontend/src/lib/api.js:analyzeResume",
        message: "Analyze fetch failed before response",
        data: {
          errorName: error?.name ?? "UnknownError",
          errorMessage: error?.message ?? "Unknown error",
          apiBaseUrl: API_BASE_URL,
        },
        timestamp: Date.now(),
      }),
    }).catch(() => {});
    // #endregion
    throw error;
  }
  // #region agent log
  fetch("http://127.0.0.1:7753/ingest/63612bb6-5898-4706-bb65-c7771289492f", {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Debug-Session-Id": "6fe10d" },
    body: JSON.stringify({
      sessionId: "6fe10d",
      runId: "initial",
      hypothesisId: "H8",
      location: "frontend/src/lib/api.js:analyzeResume",
      message: "Analyze fetch returned response",
      data: { status: response.status, ok: response.ok, apiBaseUrl: API_BASE_URL },
      timestamp: Date.now(),
    }),
  }).catch(() => {});
  // #endregion

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || "Analysis failed.");
  }

  return data;
}

