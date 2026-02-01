import React, { useState } from "react";
import "./App.css";
import logo from "./deep-dive-logo.png"; // add your new logo here in src/

const questions = [
  "What passage of Scripture will you be studying today?",
  "What did you see, hear, or feel as you read this passage?",
  "If this passage is true, what must you CHANGE in your beliefs to align your thinking to what the scripture teaches?",
  "What specific step of obedience is the Holy Spirit inviting you into today? Complete the sentence: 'Starting today, I will…'",
  "Where or when will this be hardest to live out?",
  "How will you measure your obedience to this step?",
  "What story or phrase will you tell yourself in that moment?",
  "Optional: Any additional insights or reflections?",
  "Reword the lesson into a present-tense statement that is true for you (e.g., 'I am a strong and courageous follower of Christ.')"
];

function App() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState(Array(questions.length).fill(""));

  const handleChange = (e) => {
    const newAnswers = [...answers];
    newAnswers[step] = e.target.value;
    setAnswers(newAnswers);
  };

  const nextStep = () => {
    if (step < questions.length - 1) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 0) setStep(step - 1);
  };

  const completeDeepDive = () => {
    const result = answers.map((a, i) => `${questions[i]} \n${a}`).join("\n\n");
    alert("Deep Dive Complete! Copy your responses:\n\n" + result);
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="logo" alt="Deep Dive Logo" />
        <h1>Deep Dive</h1>
        <p className="tagline">Transformation happens in the Deep</p>
      </header>

      <div className="question-box">
        <p className="question">{questions[step]}</p>
        <textarea
          className="answer-box"
          value={answers[step]}
          onChange={handleChange}
          placeholder="Type your answer here..."
        />
        <div className="navigation">
          {step > 0 && <button onClick={prevStep}>Back</button>}
          {step < questions.length - 1 ? (
            <button onClick={nextStep}>Next</button>
          ) : (
            <button onClick={completeDeepDive}>Complete</button>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;

