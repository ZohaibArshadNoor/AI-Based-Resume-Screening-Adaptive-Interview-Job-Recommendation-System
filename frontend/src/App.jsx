import axios from 'axios';
import JobRecommendations from './pages/JobRecommendations';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/jobs"
          element={
            <ProtectedRoute>
              <JobRecommendations />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;

export default api;