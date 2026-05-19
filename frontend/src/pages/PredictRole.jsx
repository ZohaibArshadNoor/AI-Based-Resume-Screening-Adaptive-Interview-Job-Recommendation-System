import { useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";

export default function PredictRole() {

  const [file, setFile] = useState(null);
  const [role, setRole] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handlePredict = async () => {

    setError("");
    setResult(null);

    if (!file || !role) {
      setError("Please upload CV and enter role");
      return;
    }

    const formData = new FormData();

    formData.append("file", file);
    formData.append("role", role);

    try {

      setLoading(true);

      // ✅ GET TOKEN
      const token = localStorage.getItem("token");

      // ✅ API CALL
      const res = await axios.post(
        "http://localhost:5000/api/predict/predict-role",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",

            // ✅ SEND JWT TOKEN
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("RESPONSE:", res.data);

      setResult(res.data);

    } catch (err) {

      console.log(err);

      setError(
        err?.response?.data?.error ||
        "Prediction failed"
      );

    } finally {

      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-black">

      <Navbar />

      <div className="flex flex-col items-center mt-10 px-6">

        <div className="w-full max-w-xl border p-8 rounded-3xl shadow-xl">

          <h1 className="text-3xl font-bold mb-6">
            AI Role Predictor
          </h1>

          {/* ROLE INPUT */}
          <input
            type="text"
            placeholder="Enter role"
            value={role}
            className="w-full border p-3 mb-4 rounded-lg"
            onChange={(e) => setRole(e.target.value)}
          />

          {/* FILE INPUT */}
          <input
            type="file"
            accept=".pdf,.docx,.txt"
            className="w-full border p-3 mb-4 rounded-lg"
            onChange={(e) => setFile(e.target.files[0])}
          />

          {/* BUTTON */}
          <button
            onClick={handlePredict}
            disabled={loading}
            className="w-full bg-black text-white p-3 rounded-lg hover:opacity-90 transition"
          >
            {loading
              ? "Processing..."
              : "Predict Role"}
          </button>

          {/* ERROR */}
          {error && (
            <p className="text-red-500 mt-4">
              {error}
            </p>
          )}

          {/* RESULT */}
          {result && (
            <div className="mt-6 p-4 border rounded-lg bg-gray-50 space-y-2">

              <p>
                <b>Predicted Role:</b>{" "}
                {result.predictedRole}
              </p>

              <p>
                <b>Selected Role:</b>{" "}
                {result.selectedRole}
              </p>

              <p>
                <b>Match:</b>{" "}
                {result.match ? "Yes" : "No"}
              </p>

              <p>
                <b>Confidence:</b>{" "}
                {result.confidence}%
              </p>

              <p>
                <b>Uploaded File:</b>{" "}
                {result.fileName}
              </p>

              <p>
                <b>Saved At:</b>{" "}
                {new Date(
                  result.createdAt
                ).toLocaleString()}
              </p>

            </div>
          )}

        </div>
      </div>
    </div>
  );
}