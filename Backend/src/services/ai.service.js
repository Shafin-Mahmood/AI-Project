const { GoogleGenAI } = require("@google/genai")
const { z } = require("zod")
const { zodToJsonSchema } = require("zod-to-json-schema")
const puppeteer = require("puppeteer")

const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GENAI_API_KEY
})


const interviewReportSchema = z.object({
    matchScore: z.number().describe("A score between 0 and 100 indicating how well the candidate's profile matches the job describe"),
    technicalQuestions: z.array(z.object({
        question: z.string().describe("The technical question can be asked in the interview"),
        intention: z.string().describe("The intention of interviewer behind asking this question"),
        answer: z.string().describe("How to answer this question, what points to cover, what approach to take etc.")
    })).describe("Technical questions that can be asked in the interview along with their intention and how to answer them"),
    behavioralQuestions: z.array(z.object({
        question: z.string().describe("The technical question can be asked in the interview"),
        intention: z.string().describe("The intention of interviewer behind asking this question"),
        answer: z.string().describe("How to answer this question, what points to cover, what approach to take etc.")
    })).describe("Behavioral questions that can be asked in the interview along with their intention and how to answer them"),
    skillGaps: z.array(z.object({
        skill: z.string().describe("The skill which the candidate is lacking"),
        severity: z.enum([ "low", "medium", "high" ]).describe("The severity of this skill gap, i.e. how important is this skill for the job and how much it can impact the candidate's chances")
    })).describe("List of skill gaps in the candidate's profile along with their severity"),
    preparationPlan: z.array(z.object({
        day: z.number().describe("The day number in the preparation plan, starting from 1"),
        focus: z.string().describe("The main focus of this day in the preparation plan, e.g. data structures, system design, mock interviews etc."),
        tasks: z.array(z.string()).describe("List of tasks to be done on this day to follow the preparation plan, e.g. read a specific book or article, solve a set of problems, watch a video etc.")
    })).describe("A day-wise preparation plan for the candidate to follow in order to prepare for the interview effectively"),
    title: z.string().describe("The title of the job for which the interview report is generated"),
})

function normalizeString(value) {
    return typeof value === "string" ? value.trim() : ""
}

function normalizeQuestion(item) {
    if (!item || typeof item !== "object") {
        return {
            question: normalizeString(item) || "Question not available",
            intention: "Intention not available",
            answer: "Answer not available"
        }
    }

    return {
        question: normalizeString(item.question) || "Question not available",
        intention: normalizeString(item.intention) || "Intention not available",
        answer: normalizeString(item.answer) || "Answer not available"
    }
}

function normalizeQuestions(value) {
    if (Array.isArray(value)) {
        return value.map(normalizeQuestion).filter((item) => item.question || item.intention || item.answer)
    }

    if (typeof value === "string") {
        const trimmed = normalizeString(value)
        return trimmed ? [{ question: trimmed, intention: "", answer: "" }] : []
    }

    return []
}

function normalizeSkillGaps(value) {
    if (Array.isArray(value)) {
        return value
            .map((item) => {
                if (!item || typeof item !== "object") {
                    return {
                        skill: normalizeString(item),
                        severity: "medium"
                    }
                }

                return {
                    skill: normalizeString(item.skill),
                    severity: ["low", "medium", "high"].includes(normalizeString(item.severity).toLowerCase())
                        ? normalizeString(item.severity).toLowerCase()
                        : "medium"
                }
            })
            .filter((item) => item.skill)
    }

    if (typeof value === "string") {
        const skill = normalizeString(value)
        return skill ? [{ skill, severity: "medium" }] : []
    }

    return []
}

function normalizePreparationPlan(value) {
    if (Array.isArray(value)) {
        return value
            .map((item, index) => {
                if (!item || typeof item !== "object") {
                    const focus = normalizeString(item)
                    return focus
                        ? { day: index + 1, focus, tasks: [] }
                        : null
                }

                const tasks = Array.isArray(item.tasks)
                    ? item.tasks.map(normalizeString).filter(Boolean)
                    : typeof item.tasks === "string"
                    ? item.tasks.split(/\r?\n|,|;/).map(normalizeString).filter(Boolean)
                    : []

                return {
                    day: Number(item.day) || index + 1,
                    focus: normalizeString(item.focus),
                    tasks
                }
            })
            .filter((item) => item && item.focus)
    }

    if (typeof value === "string") {
        const lines = value
            .split(/\r?\n/)
            .map(normalizeString)
            .filter(Boolean)

        return lines.map((line, index) => ({
            day: index + 1,
            focus: line,
            tasks: []
        }))
    }

    return []
}

function normalizeInterviewReportResponse(parsed, fallbackTitle) {
    const title = normalizeString(parsed.title || parsed.jobTitle || fallbackTitle)

    return {
        title: title || normalizeString(fallbackTitle),
        matchScore: typeof parsed.matchScore === "number"
            ? parsed.matchScore
            : Number(parsed.matchScore) || 0,
        technicalQuestions: normalizeQuestions(parsed.technicalQuestions),
        behavioralQuestions: normalizeQuestions(parsed.behavioralQuestions),
        skillGaps: normalizeSkillGaps(parsed.skillGaps),
        preparationPlan: normalizePreparationPlan(parsed.preparationPlan)
    }
}

async function generateInterviewReport({ title = "", jobTitle = "", resume = "", selfDescription = "", jobDescription = "" }) {
    const prompt = `Generate an interview report for a candidate with the following details:
Job Title: ${title || jobTitle}
Job Description: ${jobDescription}
Resume: ${resume}
Self Description: ${selfDescription}

Return only a valid JSON object with the following fields:
- matchScore: number
- technicalQuestions: array of objects with question, intention, answer
- behavioralQuestions: array of objects with question, intention, answer
- skillGaps: array of objects with skill and severity (low | medium | high)
- preparationPlan: array of objects with day, focus, tasks
- title: string

Do not include any explanatory text outside the JSON object.`

    const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: zodToJsonSchema(interviewReportSchema),
        }
    })

    const rawText = response.text || response.outputText || response.output?.[0]?.content?.[0]?.text

    if (!rawText) {
        throw new Error("AI response did not contain JSON text")
    }

    let parsed
    try {
        parsed = JSON.parse(rawText)
    } catch (error) {
        throw new Error("Failed to parse AI JSON response: " + error.message)
    }

    const normalized = normalizeInterviewReportResponse(parsed, title || jobTitle)
    return interviewReportSchema.parse(normalized)
}



async function generatePdfFromHtml(htmlContent) {
    const browser = await puppeteer.launch()
    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: "networkidle0" })

    const pdfBuffer = await page.pdf({
        format: "A4", margin: {
            top: "20mm",
            bottom: "20mm",
            left: "15mm",
            right: "15mm"
        }
    })

    await browser.close()

    return pdfBuffer
}

async function generateResumePdf({ resume, selfDescription, jobDescription, title = "" }) {

    const resumePdfSchema = z.object({
        html: z.string().describe("The HTML content of the resume which can be converted to PDF using any library like puppeteer")
    })

    const prompt = `Generate a professional resume for a candidate with the following details:
Job Title: ${title}
Job Description: ${jobDescription}
Resume: ${resume}
Self Description: ${selfDescription}

Return only a valid JSON object with a single field "html" containing the full resume HTML.
Make the resume suitable for the job description, ATS-friendly, concise (1-2 pages), and visually clean.`

    const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: zodToJsonSchema(resumePdfSchema),
        }
    })


    const jsonContent = JSON.parse(response.text)

    const pdfBuffer = await generatePdfFromHtml(jsonContent.html)

    return pdfBuffer

}

module.exports = { generateInterviewReport, generateResumePdf }