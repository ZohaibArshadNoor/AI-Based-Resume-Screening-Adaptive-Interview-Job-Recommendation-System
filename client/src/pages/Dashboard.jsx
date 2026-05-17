import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const nav = useNavigate();

  return (
    <div style={{ color: "white", padding: 40 }}>
      <h1>Dashboard</h1>

      <button onClick={() => nav("/interview")}>
        Start Interview
      </button>
    </div>
  );
}