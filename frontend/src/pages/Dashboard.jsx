import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const CARDS = [
    { title: 'Upload Resume',      desc: 'Parse your resume and extract skills automatically',  path: '/upload',    emoji: '📄', color: 'blue'   },
    { title: 'Practice Interview', desc: 'Get AI-generated questions based on your skills',     path: '/interview', emoji: '🎤', color: 'purple' },
    { title: 'Job Matches',        desc: 'Find jobs that match your skill profile',             path: '/jobs',      emoji: '💼', color: 'green'  },
    { title: 'My Results',         desc: 'View your scores and session history',                path: '/results',   emoji: '📊', color: 'orange' },
    { title: 'AI Mock Interview', desc: 'Real interview simulation with ATS scoring powered by Groq AI', path: '/agent-interview', emoji: '🤖', color: 'indigo' },
];

const COLOR_MAP = {
    blue:   'border-blue-100   hover:border-blue-300   bg-blue-50',
    purple: 'border-purple-100 hover:border-purple-300 bg-purple-50',
    green:  'border-green-100  hover:border-green-300  bg-green-50',
    orange: 'border-orange-100 hover:border-orange-300 bg-orange-50',
    indigo: 'border-indigo-100 hover:border-indigo-300 bg-indigo-50',
};

export default function Dashboard() {
    const { user, logout } = useContext(AuthContext);
    const navigate         = useNavigate();

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white border-b border-gray-100 px-8 py-4 flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                        <span className="text-white text-sm font-bold">AI</span>
                    </div>
                    <span className="font-semibold text-gray-800">Resume Screener</span>
                </div>
                <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-500">{user?.email}</span>
                    <button onClick={logout}
                        className="text-sm bg-red-50 text-red-600 px-4 py-2 rounded-lg
                                   hover:bg-red-100 transition">
                        Logout
                    </button>
                </div>
            </header>

            {/* Body */}
            <main className="max-w-4xl mx-auto p-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">
                        Hello, {user?.name?.split(' ')[0]} 👋
                    </h1>
                    <p className="text-gray-500 mt-2">
                        What would you like to work on today?
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {CARDS.map(card => (
                        <button key={card.path}
                            onClick={() => navigate(card.path)}
                            className={`text-left p-6 rounded-2xl border-2 transition-all duration-200
                                        hover:shadow-md ${COLOR_MAP[card.color]}`}>
                            <div className="text-4xl mb-4">{card.emoji}</div>
                            <h2 className="text-lg font-semibold text-gray-800 mb-1">{card.title}</h2>
                            <p className="text-gray-500 text-sm leading-relaxed">{card.desc}</p>
                        </button>
                    ))}
                </div>
            </main>
        </div>
    );
}