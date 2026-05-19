import {
  getAllInterviewReports,
  generateInterviewReport,
  getInterviewReportById,
  generateResumePdf
} from "../services/interview.api"

import { useContext, useEffect } from "react"
import { InterviewContext } from "../interview.context"
import { useParams } from "react-router-dom"

export const useInterview = () => {
  const context = useContext(InterviewContext)
  const { interviewId } = useParams()

  if (!context) {
    throw new Error("useInterview must be used within an InterviewProvider")
  }

  const {
    loading,
    setLoading,
    report,
    setReport,
    reports,
    setReports
  } = context

  const generateReport = async ({
    title,
    jobTitle,
    jobDescription,
    selfDescription,
    resumeFile
  }) => {
    setLoading(true)

    try {
      const finalTitle = title || jobTitle

      const response = await generateInterviewReport({
        title: finalTitle,
        jobTitle: finalTitle,
        jobDescription,
        selfDescription,
        resumeFile
      })

      if (!response?.interviewReport) {
        throw new Error("Interview report not found in API response")
      }

      setReport(response.interviewReport)
      return response.interviewReport
    } catch (error) {
      console.error(
        "Generate report error:",
        error?.response?.data || error.message || error
      )

      throw error
    } finally {
      setLoading(false)
    }
  }

  const getReportById = async (id) => {
    if (!id) return null

    setLoading(true)

    try {
      const response = await getInterviewReportById(id)

      if (!response?.interviewReport) {
        throw new Error("Interview report not found")
      }

      setReport(response.interviewReport)
      return response.interviewReport
    } catch (error) {
      console.error(
        "Get report by id error:",
        error?.response?.data || error.message || error
      )

      return null
    } finally {
      setLoading(false)
    }
  }

  const getReports = async () => {
    setLoading(true)

    try {
      const response = await getAllInterviewReports()
      const interviewReports = response?.interviewReports || []

      setReports(interviewReports)
      return interviewReports
    } catch (error) {
      console.error(
        "Get reports error:",
        error?.response?.data || error.message || error
      )

      setReports([])
      return []
    } finally {
      setLoading(false)
    }
  }

  const getResumePdf = async (interviewReportId) => {
    if (!interviewReportId) return

    setLoading(true)

    try {
      const response = await generateResumePdf({ interviewReportId })

      const blob = new Blob([response], {
        type: "application/pdf"
      })

      const url = window.URL.createObjectURL(blob)

      const link = document.createElement("a")
      link.href = url
      link.download = `resume_${interviewReportId}.pdf`

      document.body.appendChild(link)
      link.click()

      link.remove()
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error(
        "Resume PDF download error:",
        error?.response?.data || error.message || error
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (interviewId) {
      getReportById(interviewId)
    } else {
      getReports()
    }
  }, [interviewId])

  return {
    loading,
    report,
    reports,
    generateReport,
    getReportById,
    getReports,
    getResumePdf
  }
}