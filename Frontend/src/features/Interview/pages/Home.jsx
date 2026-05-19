import React, { useState, useRef } from "react"
import "../style/home.scss"
import { useInterview } from "../hooks/useInterview.js"
import { useNavigate } from "react-router-dom"

const Home = () => {
  const { loading, generateReport, reports } = useInterview()

  const [jobDescription, setJobDescription] = useState("")
  const [selfDescription, setSelfDescription] = useState("")
  const [resumeFile, setResumeFile] = useState(null)
  const [error, setError] = useState("")

  const resumeInputRef = useRef(null)
  const navigate = useNavigate()

  const handleFileChange = (e) => {
    const file = e.target.files[0]

    if (!file) {
      setResumeFile(null)
      return
    }

    if (file.type !== "application/pdf") {
      setError("Only PDF file is allowed")
      setResumeFile(null)
      e.target.value = ""
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("PDF file size must be less than 5MB")
      setResumeFile(null)
      e.target.value = ""
      return
    }

    setError("")
    setResumeFile(file)
  }

  const handleGenerateReport = async () => {
    try {
      setError("")

      if (!jobDescription.trim()) {
        setError("Job description is required")
        return
      }

      if (!resumeFile && !selfDescription.trim()) {
        setError("Upload a resume or write a self description")
        return
      }

      const title = jobDescription
        .split(/\r?\n/)
        .map((line) => line.trim())
        .find((line) => line.length > 0)
        ?.replace(/^(Job Title:|Title:)\s*/i, "")
        .trim() || ""

      if (!title) {
        setError("Job title is required. Please write job title in the first non-empty line.")
        return
      }

      const data = await generateReport({
        title,
        jobTitle: title,
        jobDescription,
        selfDescription,
        resumeFile
      })

      console.log("Generated Report:", data)

      if (data && data._id) {
        navigate(`/interview/${data._id}`)
      } else {
        setError("Interview report generation failed")
      }
    } catch (err) {
      console.error(
        "Home generate error:",
        err?.response?.data || err.message || err
      )

      setError(
        err?.response?.data?.message ||
          "Failed to generate interview report"
      )
    }
  }

  if (loading) {
    return (
      <main className="loading-screen">
        <h1>Loading your interview plan...</h1>
      </main>
    )
  }

  return (
    <div className="home-page">
      <header className="page-header">
        <h1>
          Create Your Custom <span className="highlight">Interview Plan</span>
        </h1>
        <p>
          Let our AI analyze the job requirements and your unique profile to
          build a winning strategy.
        </p>
      </header>

      <div className="interview-card">
        <div className="interview-card__body">
          <div className="panel panel--left">
            <div className="panel__header">
              <span className="panel__icon">💼</span>
              <h2>Target Job Description</h2>
              <span className="badge badge--required">Required</span>
            </div>

            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              className="panel__textarea"
              placeholder={`First line must be job title\nExample: Senior AI/ML Engineer\n\nThen paste the full job description here...`}
              maxLength={5000}
            />

            <div className="char-counter">
              {jobDescription.length} / 5000 chars
            </div>
          </div>

          <div className="panel-divider" />

          <div className="panel panel--right">
            <div className="panel__header">
              <span className="panel__icon">👤</span>
              <h2>Your Profile</h2>
            </div>

            <div className="upload-section">
              <label className="section-label">
                Upload Resume
                <span className="badge badge--best">Best Results</span>
              </label>

              <label className="dropzone" htmlFor="resume">
                <p className="dropzone__title">
                  {resumeFile ? resumeFile.name : "Click to upload"}
                </p>

                <p className="dropzone__subtitle">PDF only (Max 5MB)</p>

                <input
                  ref={resumeInputRef}
                  hidden
                  type="file"
                  id="resume"
                  name="resume"
                  accept="application/pdf,.pdf"
                  onChange={handleFileChange}
                />
              </label>
            </div>

            <div className="or-divider">
              <span>OR</span>
            </div>

            <div className="self-description">
              <label className="section-label" htmlFor="selfDescription">
                Quick Self-Description
              </label>

              <textarea
                value={selfDescription}
                onChange={(e) => setSelfDescription(e.target.value)}
                id="selfDescription"
                name="selfDescription"
                className="panel__textarea panel__textarea--short"
                placeholder="Briefly describe your experience, skills, and years of experience..."
              />
            </div>

            <div className="info-box">
              <p>
                {error ||
                  "Either a Resume or a Self Description is required to generate a personalized plan."}
              </p>
            </div>
          </div>
        </div>

        <div className="interview-card__footer">
          <span className="footer-info">
            AI-Powered Strategy Generation &bull; Approx 30s
          </span>

          <button
            type="button"
            onClick={handleGenerateReport}
            disabled={loading}
            className="generate-btn"
          >
            {loading ? "Generating..." : "Generate My Interview Strategy"}
          </button>
        </div>
      </div>

      {reports.length > 0 && (
        <section className="recent-reports">
          <h2>My Recent Interview Plans</h2>

          <ul className="reports-list">
            {reports.map((report) => (
              <li
                key={report._id}
                className="report-item"
                onClick={() => navigate(`/interview/${report._id}`)}
              >
                <h3>{report.title || "Untitled Position"}</h3>

                <p className="report-meta">
                  Generated on {new Date(report.createdAt).toLocaleDateString()}
                </p>

                <p
                  className={`match-score ${
                    report.matchScore >= 80
                      ? "score--high"
                      : report.matchScore >= 60
                      ? "score--mid"
                      : "score--low"
                  }`}
                >
                  Match Score: {report.matchScore}%
                </p>
              </li>
            ))}
          </ul>
        </section>
      )}

      <footer className="page-footer">
        <a href="#">Privacy Policy</a>
        <a href="#">Terms of Service</a>
        <a href="#">Help Center</a>
      </footer>
    </div>
  )
}

export default Home