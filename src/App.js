import React, { useMemo, useState } from "react";
import "./App.css";
import deepDiveLogo from "./deep-dive-logo.png";
import jsPDF from "jspdf";

const questions = [
  {
    title: "SEE",
    prompt:
      "What did you SEE? What did you hear? What did you feel as you read the passage?"
  },
  {
    title: "BELIEVE",
    prompt:
      "If this passage is true, what must you CHANGE in your beliefs to align your thinking with what Scripture teaches?"
  },
  { title: "LEARN", prompt: "What lesson is God teaching you through this passage?" },
  {
    title: "OBEY",
    prompt:
      "What specific step of obedience is the Holy Spirit inviting you into today?"
  },
  { title: "LIVING IT OUT", prompt: "Where or when will this be hardest to live out?" },
  {
    title: "PREPARE",
    prompt:
      "What story or phrase will you tell yourself in that moment to stay aligned with obedience?"
  },
  {
    title: "SPEAK IT — Identity Alignment",
    prompt:
      "Reword the lesson into a present-tense truth you can speak over yourself. Use “I am…” rather than “I will…”."
  },
  { title: "CONFIRM", prompt: "Who can you share this with for encouragement or accountability?" }
];

function formatDate(d = new Date()) {
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function safeFilename(text) {
  return (text || "deep-dive")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 60);
}

function getAnswerByTitle(answers, title) {
  const idx = questions.findIndex((q) => q.title === title);
  return idx >= 0 ? (answers[idx] || "").trim() : "";
}

/** --- PDF helpers --- **/
function createPdfBase(title) {
  const doc = new jsPDF({ unit: "pt", format: "letter" });
  doc.setFont("times", "normal");
  doc.setFontSize(18);
  doc.text(title, 72, 72);
  doc.setFontSize(11);
  return doc;
}

function addWrappedText(doc, text, x, y, maxWidth, lineHeight) {
  const lines = doc.splitTextToSize(text, maxWidth);
  for (const line of lines) {
    if (y > 720) {
      doc.addPage();
      y = 72;
    }
    doc.text(line, x, y);
    y += lineHeight;
  }
  return y;
}

function addSection(doc, heading, body, y) {
  const x = 72;
  const maxWidth = 468;
  const lineHeight = 16;

  doc.setFont("times", "bold");
  doc.setFontSize(12);
  y = addWrappedText(doc, heading, x, y, maxWidth, lineHeight);

  doc.setFont("times", "normal");
  doc.setFontSize(11);
  y = addWrappedText(doc, body || "(no response)", x, y, maxWidth, lineHeight);

  return y + 10;
}

function exportSummaryPdf({ scripture, answers }) {
  const date = formatDate();
  const name = safeFilename(scripture);
  const filename = `${name}-summary-${date}.pdf`;

  const lesson = getAnswerByTitle(answers, "LEARN");
  const obey = getAnswerByTitle(answers, "OBEY");
  const identity = getAnswerByTitle(answers, "SPEAK IT — Identity Alignment");

  const doc = createPdfBase("Deep Dive — Summary");
  let y = 100;

  y = addSection(doc, "Passage", scripture || "(not provided)", y);
  y = addSection(doc, "Lesson (LEARN)", lesson, y);
  y = addSection(doc, "Call to Obedience (OBEY)", obey, y);
  y = addSection(doc, "Positive Identity Statement (SPEAK IT)", identity, y);

  doc.setFont("times", "italic");
  doc.setFontSize(10);
  addWrappedText(doc, "Transformation happens in the deep.", 72, y + 10, 468, 14);

  doc.save(filename);
}

function exportFullPdf({ scripture, answers }) {
  const date = formatDate();
  const name = safeFilename(scripture);
  const filename = `${name}-full-${date}.pdf`;

  const doc = createPdfBase("Deep Dive — Full");
  let y = 100;

  y = addSection(doc, "Passage", scripture || "(not provided)", y);

  questions.forEach((q, i) => {
    y = addSection(doc, q.title, q.prompt, y);
    y = addSection(doc, "My Response", (answers[i] || "").trim(), y);
    y += 6;
  });

  doc.setFont("times", "italic");
  doc.setFontSize(10);
  addWrappedText(doc, "Transformation happens in the deep.", 72, y + 10, 468, 14);

  doc.save(filename);
}

export default function App() {
  const [step, setStep] = useState(0);
  const [scripture, setScripture] = useState("");
  const [answers, setAnswers] = useState(Array(questions.length).fill(""));

  const isOnScripturePage = step === 0;
  const isOnQuestionPage = step >= 1 && step <= questions.length;
  const isCompletePage = step === questions.length + 1;

  const currentQuestionIndex = step - 1;

  const setCurrentAnswer = (val) => {
    const next = [...answers];
    next[currentQuestionIndex] = val;
    setAnswers(next);
  };

  const handleBegin = () => {
    if (!scripture.trim()) return;
    setStep(1);
  };

  const handleNext = () => {
    if (step < questions.length) setStep(step + 1);
    else setStep(questions.length + 1);
  };

  const handleBack = () => setStep(Math.max(0, step - 1));

  const handleStartOver = () => {
    setStep(0);
    setScripture("");
    setAnswers(Array(questions.length).fill(""));
  };

  const baseName = useMemo(() => safeFilename(scripture), [scripture]);

  return (
    <div className="app">
      <div className="card">
        <div className="logo">
          <img src={deepDiveLogo} alt="Deep Dive Logo" className="logo-image" />
        </div>

        {isOnScripturePage && (
          <>
            <p className="invitation">
              Let’s invite the Holy Spirit to guide us through this Deep Dive into His Word.
            </p>

            <div className="question-block">
              <label className="question">
                What passage of Scripture will you be studying today?
              </label>
              <input
                type="text"
                placeholder="Example: Isaiah 6, Joshua 1:9, Ephesians 5:25–33"
                value={scripture}
                onChange={(e) => setScripture(e.target.value)}
              />
            </div>

            <button
              className="primary-button"
              onClick={handleBegin}
              disabled={!scripture.trim()}
            >
              Begin
            </button>
          </>
        )}

        {isOnQuestionPage && (
          <>
            <div className="step-header">
              <div className="step-title">{questions[currentQuestionIndex].title}</div>
              <div className="step-count">
                {step} / {questions.length}
              </div>
            </div>

            <div className="question-block">
              <label className="question">{questions[currentQuestionIndex].prompt}</label>
              <textarea
                placeholder="Type your response here..."
                value={answers[currentQuestionIndex]}
                onChange={(e) => setCurrentAnswer(e.target.value)}
              />
            </div>

            <div className="buttons">
              <button className="secondary-button" onClick={handleBack}>
                Back
              </button>
              <button className="primary-button" onClick={handleNext}>
                {step === questions.length ? "Complete" : "Next"}
              </button>
            </div>
          </>
        )}

        {isCompletePage && (
          <>
            <h2 className="complete-title">Deep Dive Complete</h2>
            <p className="complete-subtitle">
              Passage: <span className="complete-scripture">{scripture}</span>
            </p>

            <div className="save-grid">
              <div className="save-card">
                <h3>Save Summary PDF</h3>
                <p>Passage + Lesson + Obedience + Identity statement.</p>
                <button
                  className="primary-button"
                  onClick={() => exportSummaryPdf({ scripture, answers })}
                >
                  Download Summary PDF
                </button>
              </div>

              <div className="save-card">
                <h3>Save Full Deep Dive PDF</h3>
                <p>Every question + everything you wrote.</p>
                <button
                  className="primary-button"
                  onClick={() => exportFullPdf({ scripture, answers })}
                >
                  Download Full PDF
                </button>
                <p className="tiny-note">
                  File name preview: <strong>{baseName}</strong>-full-{formatDate()}.pdf
                </p>
              </div>
            </div>

            <div className="buttons" style={{ marginTop: "1.5rem" }}>
              <button className="secondary-button" onClick={handleBack}>
                Back
              </button>
              <button className="primary-button" onClick={handleStartOver}>
                Start a New Deep Dive
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
