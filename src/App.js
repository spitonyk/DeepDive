import React, { useState } from "react";
import "./App.css";

function App() {
  // State for the first input: Scripture passage
  const [scripture, setScripture] = useState("");

  // Example state for other questions (can expand later)
  const [answer, setAnswer] = useState("");

  return (
    <div className="App">
      {/* Logo Section */}
      <div className="logo">
        <h1>Deep Dive</h1>
        <p className="tagline">Transformation happens in the deep</p>
      </div>

      {/* Holy Spirit Invitation */}
      <div className="invitation">
        <p>
          Let’s invite the Holy Spirit to guide us through this Deep Dive into
          His Word.
        </p>
      </div>

      {/* Scripture Passage Input */}
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

      {/* Example placeholder for the first reflection question */}
      <div className="question-block">
        <label className="question">
          What did you see, hear, or feel as you read this passage?
        </label>
        <textarea
          placeholder="Type your response here..."
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
        />
      </div>

      {/* Complete Button Placeholder */}
      <div className="complete-button">
        <button onClick={() => alert("Complete button pressed!")}>
          Complete
        </button>
      </div>
    </div>
  );
}

export default App;
