import axios from "axios"

const api = axios.create({
  baseURL: "http://localhost:3000",
  withCredentials: true
})

export const generateInterviewReport = async ({
  title,
  jobTitle,
  jobDescription,
  selfDescription,
  resumeFile
}) => {
  try {
    const formData = new FormData()

    const finalTitle = title || jobTitle

    formData.append("title", finalTitle)
    formData.append("jobTitle", finalTitle)
    formData.append("jobDescription", jobDescription)

    if (selfDescription) {
      formData.append("selfDescription", selfDescription)
    }

    if (resumeFile) {
      formData.append("resume", resumeFile)
    }

    const response = await api.post("/api/interview", formData)

    return response.data
  } catch (error) {
    console.log("Generate Interview Report Error:", error)

    if (error.response) {
      console.log(error.response.data)
    }

    throw error
  }
}

export const getInterviewReportById = async (interviewId) => {
  try {
    const response = await api.get(`/api/interview/report/${interviewId}`)
    return response.data
  } catch (error) {
    console.log("Get Interview Report Error:", error)

    if (error.response) {
      console.log(error.response.data)
    }

    throw error
  }
}

export const getAllInterviewReports = async () => {
  try {
    const response = await api.get("/api/interview")
    return response.data
  } catch (error) {
    console.log("Get All Reports Error:", error)

    if (error.response) {
      console.log(error.response.data)
    }

    throw error
  }
}

export const generateResumePdf = async ({ interviewReportId }) => {
  try {
    const response = await api.post(
      `/api/interview/resume/pdf/${interviewReportId}`,
      {},
      {
        responseType: "blob"
      }
    )

    return response.data
  } catch (error) {
    console.log("Generate Resume PDF Error:", error)

    if (error.response) {
      console.log(error.response.data)
    }

    throw error
  }
}

export default api