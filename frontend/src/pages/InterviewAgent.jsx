import { useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";

export default function InterviewAgent() {
  const [jobDescription, setJobDescription] = useState("");
  const [role, setRole] = useState("");
  const [file, setFile] = useState(null);

  const [sessionId, setSessionId] = useState(null);

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const [loading, setLoading] = useState(false);
  const [started, setStarted] = useState(false);

  const [atsReport, setAtsReport] = useState(null);
  const [atsLoading, setAtsLoading] = useState(false);

  const token = localStorage.getItem("token");

  // ───────── START INTERVIEW ─────────
  const startInterview = async () => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/agent/start",
        { jobDescription, role },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setSessionId(res.data.sessionId);
      setStarted(true);
    } catch (err) {
      console.log(err.response?.data || err.message);
      alert("Failed to start interview");
    }
  };

  // ───────── SEND MESSAGE ─────────
  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessages = [
      ...messages,
      { role: "user", content: input },
    ];

    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("sessionId", sessionId);
      formData.append("userMessage", input);

      if (file && messages.length === 0) {
        formData.append("file", file);
      }

      const res = await axios.post(
        "http://localhost:5000/api/agent/message",
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setMessages([
        ...newMessages,
        { role: "assistant", content: res.data.reply },
      ]);
    } catch (err) {
      console.log(err.response?.data || err.message);
      alert("Message failed");
    } finally {
      setLoading(false);
    }
  };

  // ───────── ATS SCORE ─────────
  const getATS = async () => {
    try {
      setAtsLoading(true);

      const res = await axios.post(
        "http://localhost:5000/api/agent/ats-score",
        { sessionId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setAtsReport(res.data);
    } catch (err) {
      console.log(err.response?.data || err.message);
      alert("Failed to generate ATS report");
    } finally {
      setAtsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-black">
      <Navbar />

      <div className="max-w-4xl mx-auto p-6">

        <h1 className="text-3xl font-bold mb-4">
          AI Interview Agent
        </h1>

        {/* ───────── SETUP ───────── */}
        {!started && (
          <div className="space-y-3">
            <textarea
              placeholder="Job Description"
              className="w-full border p-3 rounded"
              onChange={(e) => setJobDescription(e.target.value)}
            />

            <input
              placeholder="Role"
              className="w-full border p-3 rounded"
              onChange={(e) => setRole(e.target.value)}
            />

            <input
              type="file"
              className="w-full border p-3 rounded"
              onChange={(e) => setFile(e.target.files[0])}
            />

            <button
              onClick={startInterview}
              className="bg-black text-white w-full p-3 rounded"
            >
              Start Interview
            </button>
          </div>
        )}

        {/* ───────── CHAT ───────── */}
        {started && (
          <>
            <div className="border p-4 h-[400px] overflow-y-auto mt-4 rounded">
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`mb-3 ${
                    m.role === "user" ? "text-right" : "text-left"
                  }`}
                >
                  <span
                    className={`inline-block p-2 rounded ${
                      m.role === "user"
                        ? "bg-black text-white"
                        : "bg-gray-200"
                    }`}
                  >
                    {m.content}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex gap-2 mt-4">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1 border p-3 rounded"
                placeholder="Answer..."
              />

              <button
                onClick={sendMessage}
                className="bg-black text-white px-6 rounded"
              >
                {loading ? "..." : "Send"}
              </button>
            </div>

            {/* ATS BUTTON */}
            <button
              onClick={getATS}
              className="mt-4 w-full bg-green-600 text-white p-3 rounded"
            >
              {atsLoading ? "Generating ATS..." : "Get ATS Report"}
            </button>

            {/* ───────── ATS REPORT UI ───────── */}
            {atsReport && (
              <div className="mt-6 p-5 border rounded bg-gray-50">

                <h2 className="text-2xl font-bold mb-4">
                  ATS REPORT
                </h2>

                {/* SCORE */}
                <div className="text-lg mb-2">
                  <b>Total Score:</b>{" "}
                  <span className="text-green-700 font-bold">
                    {atsReport.ats_score}
                  </span>
                </div>

                {/* READINESS */}
                <p className="mb-2">
                  <b>Readiness Level:</b>{" "}
                  {atsReport.readiness_level}
                </p>

                {/* SCORE BREAKDOWN */}
                <div className="mt-4">
                  <h3 className="font-bold mb-2">
                    Score Breakdown
                  </h3>

                  <div className="grid grid-cols-2 gap-2">
                    <p>
                      <b>Skill Match:</b>{" "}
                      {atsReport.score_breakdown?.skill_match}
                    </p>

                    <p>
                      <b>Technical:</b>{" "}
                      {atsReport.score_breakdown?.technical_knowledge}
                    </p>

                    <p>
                      <b>Communication:</b>{" "}
                      {atsReport.score_breakdown?.communication}
                    </p>

                    <p>
                      <b>Problem Solving:</b>{" "}
                      {atsReport.score_breakdown?.problem_solving}
                    </p>
                  </div>
                </div>

                {/* FEEDBACK */}
                <div className="mt-4">
                  <h3 className="font-bold mb-1">
                    Overall Feedback
                  </h3>
                  <p className="text-gray-700">
                    {atsReport.overall_feedback}
                  </p>
                </div>

                {/* STRENGTHS */}
                <div className="mt-4">
                  <h3 className="font-bold">Strengths</h3>
                  <ul className="list-disc ml-6">
                    {atsReport.strengths?.map((s, i) => (
                      <li key={i}>{s}</li>
                    ))}
                  </ul>
                </div>

                {/* WEAKNESSES */}
                <div className="mt-4">
                  <h3 className="font-bold">Weaknesses</h3>
                  <ul className="list-disc ml-6">
                    {atsReport.weaknesses?.map((w, i) => (
                      <li key={i}>{w}</li>
                    ))}
                  </ul>
                </div>

                {/* IMPROVEMENTS */}
                <div className="mt-4">
                  <h3 className="font-bold">Improvement Suggestions</h3>
                  <ul className="list-disc ml-6">
                    {atsReport.improvement_suggestions?.map((s, i) => (
                      <li key={i}>{s}</li>
                    ))}
                  </ul>
                </div>

                {/* HIRE DECISION */}
                <div className="mt-4 text-lg">
                  <b>Hire Recommendation:</b>{" "}
                  <span className="font-bold text-blue-600">
                    {atsReport.hire_recommendation}
                  </span>
                </div>

              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}