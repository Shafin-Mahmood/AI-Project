const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema(
  {
    question: String,
    intention: String,
    answer: String,
  },
  { _id: false }
);

const skillGapSchema = new mongoose.Schema(
  {
    skill: String,
    severity: {
      type: String,
      enum: ["low", "medium", "high"],
    },
  },
  { _id: false }
);

const preparationPlanSchema = new mongoose.Schema(
  {
    day: Number,
    focus: String,
    tasks: [String],
  },
  { _id: false }
);

const interviewReportSchema = new mongoose.Schema(
  {
    jobDescription: {
      type: String,
      required: true,
    },
    resume: String,
    selfDescription: String,
    matchScore: Number,
    title: String,
    technicalQuestions: [questionSchema],
    behavioralQuestions: [questionSchema],
    skillGaps: [skillGapSchema],
    preparationPlan: [preparationPlanSchema],
   
    user: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "users"
}
  },
  { timestamps: true }
);

const interviewReportModel = mongoose.model(
  "InterviewReport",
  interviewReportSchema
);

module.exports = interviewReportModel;