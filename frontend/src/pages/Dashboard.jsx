import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";

export default function Dashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get(
          "http://localhost:5000/api/dashboard",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setData(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchDashboard();
  }, []);

  if (!data) {
    return <p className="p-6">Loading dashboard...</p>;
  }

  return (
    <div className="min-h-screen bg-white text-black">
      <Navbar />

      <div className="p-8 space-y-6">

        {/* USER INFO */}
        <div className="border p-4 rounded-xl">
          <h2 className="text-xl font-bold">User Info</h2>
          <p>Name: {data.user.name}</p>
          <p>Email: {data.user.email}</p>
        </div>

        {/* ATS SCORE */}
        <div className="border p-4 rounded-xl">
          <h2 className="text-xl font-bold">ATS Score</h2>
          <p className="text-2xl font-bold text-green-600">
            {data.atsScore}
          </p>
        </div>

        {/* PREDICTION HISTORY */}
        <div className="border p-4 rounded-xl">
          <h2 className="text-xl font-bold mb-2">
            Role Predictions
          </h2>

          {data.predictions.map((p, i) => (
            <div key={i} className="border-b py-2">
              <p><b>File:</b> {p.fileName}</p>
              <p><b>Predicted:</b> {p.predictedRole}</p>
              <p><b>Selected:</b> {p.selectedRole}</p>
              <p><b>Match:</b> {p.match ? "Yes" : "No"}</p>
              <p><b>Confidence:</b> {p.confidence}%</p>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}