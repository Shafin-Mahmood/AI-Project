# IntelliPrep AI

An AI-powered interview preparation and resume analysis platform built using the MERN stack and Generative AI technologies. The system helps candidates prepare for technical and behavioral interviews by analyzing resumes, understanding job descriptions, identifying skill gaps, and generating intelligent interview reports with personalized feedback.InterviewIQ AI is designed to simulate a modern AI-driven interview preparation environment. Users can upload resumes, provide job descriptions, and receive detailed interview preparation reports generated using Generative AI.

The platform focuses on:
* Resume analysis
* AI-generated interview questions
* Technical and behavioral assessment
* Skill gap detection
* Personalized feedback generation
* Interview readiness evaluation

The system aims to improve candidate confidence, technical preparation, and overall interview performance.

---
# Some Project Screenshot
<img width="1288" height="851" alt="image" src="https://github.com/user-attachments/assets/6ee8be56-9396-4574-a655-ac257ba4e8f5" />
<img width="1225" height="891" alt="image (1)" src="https://github.com/user-attachments/assets/1930ca0e-d874-49bd-92ed-46ba27941149" />
<img width="1218" height="870" alt="image (3)" src="https://github.com/user-attachments/assets/7dbfa44c-acb4-43fc-863f-7b49ea097e16" />
<img width="1207" height="858" alt="image (4)" src="https://github.com/user-attachments/assets/766e4942-8f35-45ac-aef6-942bee898f04" />
<img width="619" height="863" alt="image (2)" src="https://github.com/user-attachments/assets/3eb0e327-8427-4f26-9c10-b55348adaea1" />







# Features

## Authentication System

* Secure user registration and login
* JWT-based authentication
* Protected routes
* HTTP-only cookie authentication
* Logout functionality

## AI Resume Analysis

* PDF resume upload support
* Resume parsing and text extraction
* Resume content analysis
* Candidate profile understanding

## Job Description Matching

* Analyze job descriptions
* Compare candidate skills with requirements
* Generate role-specific preparation reports

## AI Interview Preparation

* Technical interview question generation
* Behavioral interview question generation
* Personalized interview feedback
* AI-generated answers and explanations

## Skill Gap Detection

* Detect missing skills
* Categorize skill gaps by severity
* Suggest improvement areas

## Report Management

* Save interview reports
* View previous reports
* Generate downloadable PDF reports

## Modern Frontend

* Responsive UI
* Smooth user experience
* Dynamic React-based interface
* Context API state management

---

# Tech Stack

## Frontend

* React.js
* React Router DOM
* Context API
* Axios
* Tailwind CSS
* Vite

## Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT Authentication
* Multer

## AI & Utilities

* Google Generative AI API
* PDF Parsing
* AI-based report generation

---

# System Architecture

```text
Frontend (React + Tailwind)
        |
        v
REST API (Express.js)
        |
        v
Authentication Layer (JWT + Cookies)
        |
        v
AI Service Layer
        |
        +---- Resume Parsing
        +---- Job Description Analysis
        +---- AI Interview Report Generation
        |
        v
MongoDB Database
```

---

# Folder Structure

```text
project-root/
│
├── frontend/
│   ├── src/
│   ├── components/
│   ├── pages/
│   ├── context/
│   ├── services/
│   └── routes/
│
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── services/
│   ├── utils/
│   └── config/
│
├── uploads/
├── package.json
└── README.md
```

---

# Installation Guide

## Clone the Repository

```bash
git clone <repository-url>
cd interviewiq-ai
```

---

# Backend Setup

## Navigate to Backend

```bash
cd backend
```

## Install Dependencies

```bash
npm install
```

## Create Environment Variables

Create a `.env` file inside the backend directory.

```env
PORT=3000

MONGODB_URI=your_mongodb_connection

JWT_SECRET=your_jwt_secret

GOOGLE_GEMINI_API_KEY=your_api_key
```

## Start Backend Server

```bash
npm run dev
```

---

# Frontend Setup

## Navigate to Frontend

```bash
cd frontend
```

## Install Dependencies

```bash
npm install
```

## Start Frontend

```bash
npm run dev
```

---

# API Endpoints

## Authentication Routes

### Register User

```http
POST /api/auth/register
```

### Login User

```http
POST /api/auth/login
```

### Logout User

```http
GET /api/auth/logout
```

---

## Interview Routes

### Generate Interview Report

```http
POST /api/interview/generate
```

### Get Report By ID

```http
GET /api/interview/:id
```

### Get All Reports

```http
GET /api/interview
```

---

# AI Workflow

## Step 1

User uploads resume or writes self-description.

## Step 2

User provides target job description.

## Step 3

System extracts and analyzes resume content.

## Step 4

AI compares candidate profile with job requirements.

## Step 5

AI generates:

* Technical questions
* Behavioral questions
* Skill gap analysis
* Personalized feedback
* Interview preparation report

---

# Database Models

## User Model

* Username
* Email
* Password

## Interview Report Model

* Resume
* Self Description
* Job Description
* Technical Questions
* Behavioral Questions
* Skill Gaps
* Feedback
* User Reference

---

# Security Features

* Password hashing using bcrypt
* JWT authentication
* Protected API routes
* HTTP-only cookies
* Input validation
* File upload restrictions

---

# Future Improvements

* Real-time mock interviews
* Voice-based interview simulation
* AI scoring system
* Multi-language support
* Video interview analysis
* Advanced analytics dashboard
* Resume optimization suggestions

---

# Use Cases

* Students preparing for placements
* Software engineer interview preparation
* HR screening assistance
* Resume evaluation systems
* AI-driven recruitment platforms

---

# Learning Outcomes

This project demonstrates practical implementation of:

* Full Stack MERN Development
* REST API Development
* Authentication Systems
* Generative AI Integration
* File Upload Handling
* PDF Parsing
* Database Design
* Context API State Management
* Secure Backend Architecture

---

