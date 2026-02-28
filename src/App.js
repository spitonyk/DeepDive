import React, { useState, useEffect } from "react";
import { BookOpen, ArrowRight, ArrowLeft, CheckCircle2, RotateCcw, Download, Library, Trash2, X } from "lucide-react";
import jsPDF from "jspdf";
import "./App.css";

const questions = [
  {
    title: "SEE",
    prompt: "What did you SEE, hear, or feel as you read this passage?"
  },
  {
    title: "BELIEVE",
    prompt: "If this passage is true, what must you CHANGE in your beliefs to align your thinking with what Scripture teaches?"
  },
  {
    title: "LEARN",
    prompt: "What lesson is God teaching you through this passage?"
  },
  {
    title: "OBEY",
    prompt: "What specific step of obedience is the Holy Spirit inviting you into today?"
  },
  {
    title: "LIVING IT OUT",
    prompt: "Where or when will this be hardest to live out?"
  },
  {
    title: "PREPARE",
    prompt: "What story or phrase will you tell yourself in that moment to stay aligned with obedience?"
  },
  {
    title: "SPEAK IT",
    prompt: "Reword the lesson into a present-tense truth you can speak over yourself. Use \"I am…\" rather than \"I will…\"."
  },
  {
    title: "CONFIRM",
    prompt: "Who can you share this with for encouragement or accountability?"
  }
];

export default function App() {
  const [step, setStep] = useState(0);
  const [scripture, setScripture] = useState("");
  const [answers, setAnswers] = useState(Array(questions.length).fill(""));
  const [isComplete, setIsComplete] = useState(false);
  const [showLibrary, setShowLibrary] = useState(false);
  const [savedStudies, setSavedStudies] = useState([]);

  // Load saved studies from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("deepDiveStudies");
    if (stored) {
      setSavedStudies(JSON.parse(stored));
    }
  }, []);

  const handleAnswerChange = (e) => {
    const updated = [...answers];
    updated[step - 1] = e.target.value;
    setAnswers(updated);
  };

  const handleComplete = () => {
    // Save to library
    const newStudy = {
      id: Date.now().toString(),
      date: new Date().toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }),
      scripture,
      answers
    };
    
    const updatedStudies = [newStudy, ...savedStudies];
    setSavedStudies(updatedStudies);
    localStorage.setItem("deepDiveStudies", JSON.stringify(updatedStudies));
    
    setIsComplete(true);
  };

  const handleStartNew = () => {
    setStep(0);
    setScripture("");
    setAnswers(Array(questions.length).fill(""));
    setIsComplete(false);
  };

  const handleDeleteStudy = (id) => {
    const updatedStudies = savedStudies.filter(study => study.id !== id);
    setSavedStudies(updatedStudies);
    localStorage.setItem("deepDiveStudies", JSON.stringify(updatedStudies));
  };

  const handleViewStudy = (study) => {
    setScripture(study.scripture);
    setAnswers(study.answers);
    setIsComplete(true);
    setShowLibrary(false);
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    const maxWidth = pageWidth - (margin * 2);
    let yPosition = 20;

    // Title
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.text("Deep Dive — Full Study", margin, yPosition);
    yPosition += 10;

    // Date
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(new Date().toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }), margin, yPosition);
    yPosition += 15;

    // Scripture
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Passage", margin, yPosition);
    yPosition += 8;
    
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    const scriptureLines = doc.splitTextToSize(scripture, maxWidth);
    doc.text(scriptureLines, margin, yPosition);
    yPosition += (scriptureLines.length * 6) + 10;

    // Questions and Answers
    questions.forEach((question, index) => {
      // Check if we need a new page
      if (yPosition > 250) {
        doc.addPage();
        yPosition = 20;
      }

      // Question Title
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text(question.title, margin, yPosition);
      yPosition += 7;

      // Question Prompt
      doc.setFontSize(10);
      doc.setFont("helvetica", "italic");
      const promptLines = doc.splitTextToSize(question.prompt, maxWidth);
      doc.text(promptLines, margin, yPosition);
      yPosition += (promptLines.length * 5) + 5;

      // Answer Header
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.text("My Response", margin, yPosition);
      yPosition += 6;

      // Answer
      doc.setFont("helvetica", "normal");
      const answerText = answers[index] || "(No response)";
      const answerLines = doc.splitTextToSize(answerText, maxWidth);
      doc.text(answerLines, margin, yPosition);
      yPosition += (answerLines.length * 5) + 12;
    });

    // Footer
    const pageCount = doc.getNumberOfPages();
    doc.setFontSize(9);
    doc.setFont("helvetica", "italic");
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.text("Transformation happens in the deep.", pageWidth / 2, doc.internal.pageSize.getHeight() - 10, { align: "center" });
    }

    // Save with scripture reference in filename
    const fileName = `Deep_Dive_${scripture.replace(/[^a-z0-9]/gi, '_')}.pdf`;
    doc.save(fileName);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="bg-slate-900/90 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden border border-slate-800">
          
          {/* Header with background image */}
          <div className="relative h-48 bg-gradient-to-br from-blue-900 to-indigo-950 overflow-hidden">
            <img 
              src="https://images.unsplash.com/photo-1675223894754-7b0af6c38a90?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1bmRlcndhdGVyJTIwc3VuYmVhbXMlMjBsaWdodCUyMHJheXMlMjBjbGVhciUyMGJsdWV8ZW58MXx8fHwxNzcyMDgyNjk5fDA&ixlib=rb-4.1.0&q=80&w=1080"
              alt="Underwater with sunlight rays"
              className="w-full h-full object-cover opacity-50"
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="bg-white/10 backdrop-blur-sm rounded-full p-4 mb-3">
                <BookOpen className="w-12 h-12 text-white" />
              </div>
              <h1 className="text-4xl font-bold text-white mb-2">Deep Dive</h1>
              <p className="text-slate-200 text-lg">Transformation happens in the deep</p>
            </div>
            
            {/* Library Button */}
            <button
              onClick={() => setShowLibrary(true)}
              className="absolute top-4 right-4 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white p-3 rounded-full transition-all border border-white/20"
            >
              <Library className="w-6 h-6" />
            </button>
          </div>

          {/* Progress Bar */}
          {!isComplete && step > 0 && (
            <div className="bg-slate-800 h-2">
              <div 
                className="bg-gradient-to-r from-blue-500 to-indigo-400 h-full transition-all duration-300"
                style={{ width: `${(step / questions.length) * 100}%` }}
              />
            </div>
          )}

          {/* Content */}
          <div className="p-8 md:p-12">
            {isComplete ? (
              // Summary Screen
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-green-900/50 rounded-full mb-4">
                    <CheckCircle2 className="w-8 h-8 text-green-400" />
                  </div>
                  <h2 className="text-3xl font-bold text-white mb-2">Deep Dive Complete!</h2>
                  <p className="text-slate-400">May these insights transform your walk with God</p>
                </div>

                <div className="bg-blue-950/50 rounded-xl p-6 mb-6 border border-blue-900/50">
                  <h3 className="font-semibold text-blue-300 mb-2">Scripture Studied</h3>
                  <p className="text-blue-100">{scripture}</p>
                </div>

                {questions.map((question, index) => (
                  <div key={index} className="border-l-4 border-indigo-500 pl-6 py-2">
                    <h3 className="font-bold text-white mb-2">{question.title}</h3>
                    <p className="text-sm text-slate-400 mb-2">{question.prompt}</p>
                    <p className="text-slate-200">{answers[index] || "(No response)"}</p>
                  </div>
                ))}

                <div className="flex gap-3">
                  <button
                    onClick={handleStartNew}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-xl font-semibold hover:from-blue-500 hover:to-indigo-500 transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-900/50"
                  >
                    <RotateCcw className="w-5 h-5" />
                    Start New Deep Dive
                  </button>

                  <button
                    onClick={handleDownloadPDF}
                    className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-4 rounded-xl font-semibold hover:from-green-500 hover:to-emerald-500 transition-all flex items-center justify-center gap-2 shadow-lg shadow-green-900/50"
                  >
                    <Download className="w-5 h-5" />
                    Download PDF
                  </button>
                </div>
              </div>
            ) : step === 0 ? (
              // Welcome Screen
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <p className="text-slate-300 text-lg leading-relaxed">
                    Let's invite the Holy Spirit to guide us through this Deep Dive into His Word.
                  </p>
                </div>

                <div className="space-y-3">
                  <label className="block text-white font-semibold text-lg">
                    What passage of Scripture will you be studying today?
                  </label>
                  <input
                    type="text"
                    placeholder="Example: Joshua 1:9"
                    value={scripture}
                    onChange={(e) => setScripture(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-800 border-2 border-slate-700 text-white placeholder-slate-500 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all text-lg"
                  />
                </div>

                <button
                  disabled={!scripture}
                  onClick={() => setStep(1)}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-xl font-semibold hover:from-blue-500 hover:to-indigo-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-blue-900/50"
                >
                  Begin Deep Dive
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            ) : (
              // Question Screen
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <div className="inline-block bg-indigo-900/50 text-indigo-300 px-4 py-2 rounded-full text-sm font-semibold mb-4 border border-indigo-800">
                    Question {step} of {questions.length}
                  </div>
                  <h2 className="text-3xl font-bold text-white mb-3">
                    {questions[step - 1].title}
                  </h2>
                  <p className="text-xl text-slate-300">
                    {questions[step - 1].prompt}
                  </p>
                </div>

                <div className="bg-blue-950/50 rounded-xl p-4 mb-4 border border-blue-900/50">
                  <p className="text-sm text-blue-300 font-medium">
                    Studying: <span className="font-normal text-blue-200">{scripture}</span>
                  </p>
                </div>

                <textarea
                  value={answers[step - 1]}
                  onChange={handleAnswerChange}
                  placeholder="Type your response here..."
                  rows={8}
                  className="w-full px-4 py-3 bg-slate-800 border-2 border-slate-700 text-white placeholder-slate-500 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all resize-none text-lg"
                />

                <div className="flex gap-3">
                  <button
                    onClick={() => setStep(step - 1)}
                    className="flex-1 bg-slate-800 text-slate-300 py-3 rounded-xl font-semibold hover:bg-slate-700 transition-all flex items-center justify-center gap-2 border border-slate-700"
                  >
                    <ArrowLeft className="w-5 h-5" />
                    Back
                  </button>

                  {step < questions.length ? (
                    <button
                      onClick={() => setStep(step + 1)}
                      className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl font-semibold hover:from-blue-500 hover:to-indigo-500 transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-900/50"
                    >
                      Next
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  ) : (
                    <button
                      onClick={handleComplete}
                      className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 rounded-xl font-semibold hover:from-green-500 hover:to-emerald-500 transition-all flex items-center justify-center gap-2 shadow-lg shadow-green-900/50"
                    >
                      Complete
                      <CheckCircle2 className="w-5 h-5" />
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Library Modal */}
        {showLibrary && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-slate-900 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden border border-slate-800 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="bg-gradient-to-br from-blue-900 to-indigo-950 p-8 relative">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="bg-white/10 backdrop-blur-sm rounded-full p-3">
                      <Library className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold text-white">Your Library</h2>
                      <p className="text-slate-200">Review your past studies</p>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => setShowLibrary(false)}
                    className="bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white p-3 rounded-full transition-all border border-white/20"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              <div className="p-8">
                {savedStudies.length > 0 ? (
                  <div className="space-y-4">
                    {savedStudies.map(study => (
                      <div key={study.id} className="bg-slate-800/50 rounded-xl p-6 border border-slate-700 hover:border-indigo-500/50 transition-all">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex-1">
                            <p className="text-sm text-slate-400 mb-1">{study.date}</p>
                            <h3 className="text-xl font-semibold text-blue-300 mb-1">
                              {study.scripture.length > 50 ? study.scripture.substring(0, 50) + "..." : study.scripture}
                            </h3>
                            <p className="text-sm text-slate-400 line-clamp-2">
                              {study.answers[0] ? study.answers[0].substring(0, 100) + "..." : "No responses recorded"}
                            </p>
                          </div>
                          <div className="flex gap-2 ml-4">
                            <button
                              onClick={() => handleViewStudy(study)}
                              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2 px-4 rounded-lg font-semibold hover:from-blue-500 hover:to-indigo-500 transition-all"
                            >
                              View
                            </button>
                            <button
                              onClick={() => handleDeleteStudy(study.id)}
                              className="bg-slate-700 hover:bg-red-600 text-slate-300 hover:text-white p-2 rounded-lg transition-all"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-800 rounded-full mb-4">
                      <BookOpen className="w-8 h-8 text-slate-400" />
                    </div>
                    <p className="text-slate-400 text-lg">No saved studies yet.</p>
                    <p className="text-slate-500 text-sm mt-2">Complete your first Deep Dive to start building your library!</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <p className="text-center text-slate-400 mt-6 text-sm">
          "For the word of God is alive and active..." — Hebrews 4:12
        </p>
      </div>
    </div>
  );
}
