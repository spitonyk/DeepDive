import React, { useState } from "react";
import "./App.css";
import deepDiveLogo from "./deep-dive-logo.png"; // logo is in src/

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
  {
    title: "LEARN",
    prompt: "What lesson is God teaching you through this passage?"
  },
  {
    title: "OBEY",
    prompt:
      "What specific step of obedience is the Holy Spirit inviting you into today?"
  },
  {
    title: "LIVING IT OUT",
    prompt: "Where or when will this be hardest to live out?"
  },
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
  {
    title: "CONFIRM",
    prompt: "Who can you share this with for encouragement or accountability?"
  }
];

export default function App() {
  // step 0 = scripture page
  // step 1..questions.length = questions
  // step questions.length + 1 = complete page
  const [step, setStep] = useState(0);

  const [scripture, setScripture] = useState("");
  const [answers, setAnswers] = useState(Array(questions.length).fill(""));

  const isOnScripturePage = step === 0;
  const isOnQuestionPage = step >= 1 && step <= questions.length;
  const isCompletePage = step === questions.length + 1;

  const currentQuestionIndex = step - 1; // step 1 => question 0

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

  return (
    <div className="app">
      <div className="card">
        {/* Logo */}
        <div className="logo">
          <img
            src={deepDiveLogo}
            alt="Deep Dive Logo"
            className="logo-image"
          />
        </div>

        {/* STEP 0: Scripture only */}
        {isOnScripturePage && (
          <>
            <p className="invitation">
              Let’s invite the Holy Spirit to guide us through this Deep Dive
              into His Word.
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
              title={!scripture.trim() ? "Enter a passage to begin" : "Begin"}
            >
              Begin
            </button>
          </>
        )}

        {/* STEP 1..N: One question per screen */}
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

        {/* COMPLETE PAGE */}
        {isCompletePage && (
          <>
            <h2 className="complete-title">Deep Dive Complete</h2>
            <p className="complete-subtitle">
              Scripture: <span className="complete-scripture">{scripture}</span>
            </p>

            <div className="buttons">
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

