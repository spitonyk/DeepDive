import { useState } from "react";
import "./App.css";

const questions = [
  {
    title: "Invite the Holy Spirit",
    prompt:
      "Take a quiet moment and invite the Holy Spirit to guide you into truth as you study this passage."
  },
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
    prompt:
      "What lesson is God teaching you through this passage?"
  },
  {
    title: "OBEY",
    prompt:
      "What specific step of obedience is the Holy Spirit inviting you into today?"
  },
  {
    title: "LIVING IT OUT",
    prompt:
      "Where or when will this be hardest to live out?"
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
    prompt:
      "Who can you share this with for encouragement or accountability?"
  }
];

function App() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState(Array(questions.length).fill(""));

  const handleChange = (e) => {
    const newAnswers = [...answers];
    newAnswers[step] = e.target.value;
    setAnswers(newAnswers);
  };

  return (
    <div className="app">
      <div className="card">
        <h2>{questions[step].title}</h2>
        <p>{questions[step].prompt}</p>

        <textarea
          value={answers[step]}
          onChange={handleChange}
          placeholder="Type your response here..."
        />

        <div className="buttons">
          {step > 0 && (
            <button onClick={() => setStep(step - 1)}>Back</button>
          )}
          {step < questions.length - 1 ? (
            <button onClick={() => setStep(step + 1)}>Next</button>
          ) : (
            <button disabled>Complete</button>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;


