const { PDFParse } = require("pdf-parse")

const {
  generateInterviewReport,
  generateResumePdf
} = require("../services/ai.service")

function extractJobTitleFromDescription(jobDescription = "") {
  if (!jobDescription || !jobDescription.trim()) {
    return ""
  }

  const firstNonEmptyLine = jobDescription
    .split(/\r?\n/)
    .map((line) => line.trim())
    .find((line) => line.length > 0)

  return (
    firstNonEmptyLine
      ?.replace(/^(Job Title:|Title:)\s*/i, "")
      .trim() || ""
  )
}

const interviewReportModel = require("../models/interviewReport.model")

async function generateInterViewReportController(req, res) {
  try {
    const {
      title = "",
      jobTitle = "",
      selfDescription = "",
      jobDescription = ""
    } = req.body

    const finalTitle = title || jobTitle || extractJobTitleFromDescription(jobDescription)

    console.log("Body:", req.body)
    console.log("File:", req.file ? req.file.originalname : "No file")

    if (!finalTitle.trim()) {
      return res.status(400).json({
        message: "Job title is required"
      })
    }

    if (!jobDescription.trim()) {
      return res.status(400).json({
        message: "Job description is required"
      })
    }

    if (!req.file && !selfDescription.trim()) {
      return res.status(400).json({
        message: "Resume or self description is required"
      })
    }

    let resumeText = ""

    if (req.file) {
      const parser = new PDFParse({
        data: req.file.buffer
      })

      const pdfData = await parser.getText()
      resumeText = pdfData.text || ""
    }

    const interViewReportByAi = await generateInterviewReport({
      title: finalTitle,
      jobTitle: finalTitle,
      resume: resumeText,
      selfDescription,
      jobDescription
    })

    if (!interViewReportByAi) {
      return res.status(500).json({
        message: "AI failed to generate interview report"
      })
    }

    const interviewReport = await interviewReportModel.create({
      user: req.user.id,
      title: finalTitle,
      resume: resumeText,
      selfDescription,
      jobDescription,
      ...interViewReportByAi
    })

    return res.status(201).json({
      message: "Interview report generated successfully.",
      interviewReport
    })
  } catch (error) {
    console.error("Generate Interview Report Error:", error)

    return res.status(500).json({
      message: error.message || "Something went wrong"
    })
  }
}

async function getInterviewReportByIdController(req, res) {
  try {
    const { interviewId } = req.params

    const interviewReport = await interviewReportModel.findOne({
      _id: interviewId,
      user: req.user.id
    })

    if (!interviewReport) {
      return res.status(404).json({
        message: "Interview report not found."
      })
    }

    return res.status(200).json({
      message: "Interview report fetched successfully.",
      interviewReport
    })
  } catch (error) {
    console.error("Get Interview Report Error:", error)

    return res.status(500).json({
      message: error.message || "Something went wrong"
    })
  }
}

async function getAllInterviewReportsController(req, res) {
  try {
    const interviewReports = await interviewReportModel
      .find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .select(
        "-resume -selfDescription -jobDescription -__v -technicalQuestions -behavioralQuestions -skillGaps -preparationPlan"
      )

    return res.status(200).json({
      message: "Interview reports fetched successfully.",
      interviewReports
    })
  } catch (error) {
    console.error("Get All Interview Reports Error:", error)

    return res.status(500).json({
      message: error.message || "Something went wrong"
    })
  }
}

async function generateResumePdfController(req, res) {
  try {
    const { interviewReportId } = req.params

    const interviewReport = await interviewReportModel.findOne({
      _id: interviewReportId,
      user: req.user.id
    })

    if (!interviewReport) {
      return res.status(404).json({
        message: "Interview report not found."
      })
    }

    const { resume, jobDescription, selfDescription, title } = interviewReport

    const pdfBuffer = await generateResumePdf({
      resume,
      jobDescription,
      selfDescription,
      title
    })

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename=resume_${interviewReportId}.pdf`
    })

    return res.send(pdfBuffer)
  } catch (error) {
    console.error("Generate Resume PDF Error:", error)

    return res.status(500).json({
      message: error.message || "Something went wrong"
    })
  }
}

module.exports = {
  generateInterViewReportController,
  getInterviewReportByIdController,
  getAllInterviewReportsController,
  generateResumePdfController
}