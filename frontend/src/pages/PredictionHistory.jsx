import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";

export default function PredictionHistory() {

  const [history, setHistory] = useState([]);
  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {

      const token =
        localStorage.getItem("token");

      const res = await axios.get(
        "http://localhost:5000/api/predict/history",
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

      setHistory(res.data);

    } catch (error) {

      console.log(error);

    } finally {

      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-black">
      <Navbar />

      <div className="max-w-5xl mx-auto px-6 py-10">

        <h1 className="text-4xl font-bold mb-8">
          Prediction History
        </h1>

        {loading ? (
          <p>Loading...</p>

        ) : history.length === 0 ? (

          <p>No prediction history found.</p>

        ) : (

          <div className="space-y-4">

            {history.map((item) => (

              <div
                key={item._id}
                className="border rounded-2xl p-5 shadow-sm"
              >

                <p>
                  <b>File:</b> {item.fileName}
                </p>

                <p>
                  <b>Selected Role:</b>{" "}
                  {item.selectedRole}
                </p>

                <p>
                  <b>Predicted Role:</b>{" "}
                  {item.predictedRole}
                </p>

                <p>
                  <b>Match:</b>{" "}
                  {item.match ? "Yes" : "No"}
                </p>

                <p>
                  <b>Confidence:</b>{" "}
                  {item.confidence}%
                </p>

                <p>
                  <b>Date:</b>{" "}
                  {new Date(
                    item.createdAt
                  ).toLocaleString()}
                </p>

              </div>
            ))}

          </div>
        )}

      </div>
    </div>
  );
}