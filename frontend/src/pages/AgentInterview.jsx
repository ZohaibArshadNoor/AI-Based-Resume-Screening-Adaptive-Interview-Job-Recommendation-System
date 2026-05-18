import { useState, useRef, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';

const STAGES = {
  SETUP:     'setup',
  INTERVIEW: 'interview',
  SCORING:   'scoring',
  RESULTS:   'results',
};

const scoreColor = (score) => {
  if (score >= 80) return { hex: '#34d399', label: 'Highly Ready' };
  if (score >= 60) return { hex: '#60a5fa', label: 'Ready' };
  if (score >= 40) return { hex: '#fbbf24', label: 'Partially Ready' };
  return               { hex: '#f87171', label: 'Not Ready' };
};

export default function AgentInterview() {
  const { user }  = useContext(AuthContext);
  const navigate  = useNavigate();
  const bottomRef = useRef(null);
  const inputRef  = useRef(null);
  const fileRef   = useRef(null);

  const [stage, setStage]           = useState(STAGES.SETUP);
  const [jobDesc, setJobDesc]       = useState('');
  const [role, setRole]             = useState('');
  const [resumeFile, setResumeFile] = useState(null);
  const [setupError, setSetupError] = useState('');
  const [sessionId, setSessionId]   = useState(null);
  const [messages, setMessages]     = useState([]);
  const [userInput, setUserInput]   = useState('');
  const [isTyping, setIsTyping]     = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [qCount, setQCount]         = useState(0);
  const [resumeSkills, setResumeSkills] = useState([]);
  const [atsReport, setAtsReport]   = useState(null);
  const [scoringMsg, setScoringMsg] = useState('Analyzing your interview...');

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // ── Start ────────────────────────────────────────────────────────────────
  const handleStart = async () => {
    if (!jobDesc.trim()) return setSetupError('Please paste a job description.');
    if (!resumeFile)     return setSetupError('Please upload your resume.');
    setSetupError('');

    try {
      const sessRes = await api.post('/agent/start', {
        jobDescription: jobDesc,
        role,
      });
      const sid = sessRes.data.sessionId;
      setSessionId(sid);
      setStage(STAGES.INTERVIEW);
      setIsTyping(true);

      const form = new FormData();
      form.append('sessionId',   sid);
      form.append('userMessage', '');
      form.append('resume',      resumeFile);

      const msgRes = await api.post('/agent/message', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setMessages([{
        role: 'assistant',
        content: msgRes.data.reply,
        id: Date.now(),
      }]);
      setResumeSkills(msgRes.data.resumeSkills || []);
      setQCount(1);
      setIsTyping(false);
      setTimeout(() => inputRef.current?.focus(), 100);

    } catch (err) {
      setSetupError(
        err.response?.data?.message || 'Failed to start. Is the server running?'
      );
      setStage(STAGES.SETUP);
      setIsTyping(false);
    }
  };

  // ── Send ─────────────────────────────────────────────────────────────────
  const handleSend = async () => {
    const text = userInput.trim();
    if (!text || isTyping || isComplete) return;

    setMessages(prev => [...prev, { role: 'user', content: text, id: Date.now() }]);
    setUserInput('');
    setIsTyping(true);

    try {
      const form = new FormData();
      form.append('sessionId',   sessionId);
      form.append('userMessage', text);

      const res = await api.post('/agent/message', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setMessages(prev => [...prev, {
        role: 'assistant',
        content: res.data.reply,
        id: Date.now(),
      }]);
      setQCount(res.data.messageCount || qCount + 1);
      setIsTyping(false);

      if (res.data.isComplete) {
        setIsComplete(true);
        setTimeout(() => fetchAtsScore(), 2500);
      }
    } catch {
      setIsTyping(false);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Sorry — connection issue. Please resend your answer.',
        id: Date.now(),
        isError: true,
      }]);
    }
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  // ── ATS Score ─────────────────────────────────────────────────────────────
  const fetchAtsScore = async () => {
<<<<<<< HEAD:client/src/pages/AgentInterview.jsx
  setStage(STAGES.SCORING);
  const msgs = [
    'Analyzing your interview performance...',
    'Matching skills against job requirements...',
    'Evaluating technical responses...',
    'Generating your ATS report...',
  ];
  let i = 0;
  const iv = setInterval(() => setScoringMsg(msgs[Math.min(i++, msgs.length - 1)]), 2500);

  try {
    const res = await api.post('/agent/ats-score', { sessionId });
    clearInterval(iv);
    setAtsReport(res.data);
    setStage(STAGES.RESULTS);
  } catch (err) {
    clearInterval(iv);
    // ← show real error so you can debug
    const msg = err.response?.data?.message || err.message || 'Unknown error';
    setScoringMsg(`Scoring failed: ${msg}`);
    console.error('ATS Score error:', err.response?.data || err.message);
  }
};
=======
    setStage(STAGES.SCORING);
    const msgs = [
      'Analyzing your interview performance...',
      'Matching skills against job requirements...',
      'Evaluating technical responses...',
      'Generating your ATS report...',
    ];
    let i = 0;
    const iv = setInterval(() => setScoringMsg(msgs[Math.min(i++, msgs.length - 1)]), 2500);

    try {
      const res = await api.post('/agent/ats-score', { sessionId });
      clearInterval(iv);
      setAtsReport(res.data);
      setStage(STAGES.RESULTS);
    } catch {
      clearInterval(iv);
      setScoringMsg('Scoring failed. Please try again.');
    }
  };
>>>>>>> ML-Infrastructure-Setup:frontend/src/pages/AgentInterview.jsx

  const resetAll = () => {
    setStage(STAGES.SETUP);
    setMessages([]);
    setSessionId(null);
    setAtsReport(null);
    setIsComplete(false);
    setQCount(0);
    setJobDesc('');
    setRole('');
    setResumeFile(null);
    setSetupError('');
  };

  // ─────────────────────────────────────────────────────────────────────────
  // STYLES
  // ─────────────────────────────────────────────────────────────────────────
  const S = {
    page:       { minHeight: '100vh', background: '#0a0a0f', fontFamily: "'DM Sans',system-ui,sans-serif" },
    card:       { background: '#13131f', border: '1px solid #1e1e2e', borderRadius: 20 },
    label:      { color: '#888', fontSize: '0.7rem', fontFamily: "'DM Mono'", letterSpacing: '0.06em', display: 'block', marginBottom: '0.4rem' },
    input:      { width: '100%', background: '#0a0a0f', border: '1px solid #1e1e2e', borderRadius: 12, color: '#d0d0e8', padding: '0.8rem 1rem', fontSize: '0.875rem', fontFamily: "'DM Sans'", transition: 'border-color 0.2s' },
    btnPrimary: { background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', color: '#fff', border: 'none', borderRadius: 12, padding: '0.875rem', fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer', width: '100%', fontFamily: "'DM Sans'" },
    tag:        { background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.25)', color: '#6366f1', borderRadius: 100, padding: '0.3rem 0.875rem', fontSize: '0.7rem', fontFamily: "'DM Mono'" },
  };

  // ── SETUP ─────────────────────────────────────────────────────────────────
  if (stage === STAGES.SETUP) return (
    <div style={{ ...S.page, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap');
        * { box-sizing: border-box }
        ::placeholder { color: #3a3a4a }
        textarea, input { outline: none }
      `}</style>

      <div style={{ width: '100%', maxWidth: 560 }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ ...S.tag, display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#6366f1', display: 'inline-block' }} />
            GROQ LLaMA 3.3 · 70B
          </div>
          <h1 style={{ color: '#fff', fontSize: '2rem', fontWeight: 600, margin: '0 0 0.5rem' }}>AI Mock Interview</h1>
          <p style={{ color: '#5a5a7a', fontSize: '0.875rem' }}>Real interview simulation · ATS score · Groq AI</p>
        </div>

        <div style={{ ...S.card, padding: '2rem' }}>
          {/* Job Description */}
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={S.label}>JOB DESCRIPTION *</label>
            <textarea
              value={jobDesc}
              onChange={e => setJobDesc(e.target.value)}
              placeholder="Paste the full job description — more detail = better interview..."
              rows={6}
              style={{ ...S.input, resize: 'vertical', lineHeight: 1.6 }}
              onFocus={e => e.target.style.borderColor = '#6366f1'}
              onBlur={e => e.target.style.borderColor = '#1e1e2e'}
            />
          </div>

          {/* Role */}
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={S.label}>TARGET ROLE</label>
            <input
              type="text"
              value={role}
              onChange={e => setRole(e.target.value)}
              placeholder="e.g. Senior React Developer, Data Scientist..."
              style={S.input}
              onFocus={e => e.target.style.borderColor = '#6366f1'}
              onBlur={e => e.target.style.borderColor = '#1e1e2e'}
            />
          </div>

          {/* Resume */}
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={S.label}>RESUME *</label>
            <div
              onClick={() => fileRef.current?.click()}
              style={{ border: '1px dashed #2a2a3e', borderRadius: 12, padding: '1.5rem', textAlign: 'center', cursor: 'pointer', transition: 'all 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#6366f1'; e.currentTarget.style.background = 'rgba(99,102,241,0.04)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = '#2a2a3e'; e.currentTarget.style.background = 'transparent'; }}
            >
              {resumeFile
                ? <p style={{ color: '#6366f1', margin: 0, fontSize: '0.875rem' }}>📄 {resumeFile.name}</p>
                : <>
                    <p style={{ color: '#5a5a7a', margin: '0 0 0.25rem', fontSize: '0.875rem' }}>⬆️ Drop resume or click to browse</p>
                    <p style={{ color: '#3a3a4a', margin: 0, fontSize: '0.75rem' }}>PDF, DOCX, TXT</p>
                  </>
              }
              <input
                ref={fileRef}
                type="file"
                accept=".pdf,.docx,.txt"
                style={{ display: 'none' }}
                onChange={e => setResumeFile(e.target.files[0] || null)}
              />
            </div>
          </div>

          {setupError && (
            <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 10, padding: '0.75rem 1rem', color: '#f87171', fontSize: '0.875rem', marginBottom: '1rem' }}>
              {setupError}
            </div>
          )}

          <button
            onClick={handleStart}
            disabled={!jobDesc.trim() || !resumeFile}
            style={{ ...S.btnPrimary, opacity: !jobDesc.trim() || !resumeFile ? 0.35 : 1, cursor: !jobDesc.trim() || !resumeFile ? 'not-allowed' : 'pointer' }}
          >
            🚀 Start Interview
          </button>
        </div>

        <button
          onClick={() => navigate('/')}
          style={{ display: 'block', margin: '1.5rem auto 0', color: '#3a3a4a', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.85rem' }}
        >
          ← Dashboard
        </button>
      </div>
    </div>
  );

  // ── SCORING ───────────────────────────────────────────────────────────────
  if (stage === STAGES.SCORING) return (
    <div style={{ ...S.page, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1.25rem' }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
      <div style={{ width: 56, height: 56, borderRadius: '50%', border: '3px solid #6366f1', borderTopColor: 'transparent', animation: 'spin 1s linear infinite' }} />
      <p style={{ color: '#8888aa', fontFamily: "'DM Mono'", fontSize: '0.85rem', textAlign: 'center' }}>{scoringMsg}</p>
    </div>
  );

  // ── RESULTS ───────────────────────────────────────────────────────────────
  if (stage === STAGES.RESULTS && atsReport) {
    const score  = atsReport.ats_score  || 0;
    const col    = scoreColor(score);
    const bd     = atsReport.score_breakdown || {};
    const circumference = 2 * Math.PI * 56;

    return (
      <div style={{ ...S.page, padding: '2rem', overflowY: 'auto' }}>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap');
          * { box-sizing: border-box }
        `}</style>

        <div style={{ maxWidth: 700, margin: '0 auto' }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h1 style={{ color: '#fff', fontSize: '1.75rem', fontWeight: 600, margin: '0 0 0.4rem' }}>Interview Complete 🎉</h1>
            <p style={{ color: '#5a5a7a', fontSize: '0.875rem' }}>Your ATS readiness report</p>
          </div>

          {/* Score Card */}
          <div style={{ ...S.card, padding: '2rem', textAlign: 'center', marginBottom: '1.25rem' }}>
            <svg width={140} height={140} style={{ display: 'block', margin: '0 auto 1.25rem' }}>
              <circle cx={70} cy={70} r={56} fill="none" stroke="#1e1e2e" strokeWidth={10} />
              <circle cx={70} cy={70} r={56} fill="none" stroke={col.hex} strokeWidth={10}
                strokeLinecap="round" strokeDasharray={circumference}
                strokeDashoffset={circumference * (1 - score / 100)}
                transform="rotate(-90 70 70)"
                style={{ transition: 'stroke-dashoffset 1.5s ease' }}
              />
              <text x={70} y={66} textAnchor="middle" fill="#fff" fontSize={28} fontWeight={600} fontFamily="'DM Sans'">{score}</text>
              <text x={70} y={84} textAnchor="middle" fill="#5a5a7a" fontSize={11} fontFamily="'DM Mono'">/100</text>
            </svg>

            <div style={{ ...S.tag, display: 'inline-block', marginBottom: '1rem' }}>
              {atsReport.readiness_level || col.label}
            </div>
            <p style={{ color: '#8888aa', fontSize: '0.875rem', lineHeight: 1.65, margin: '0 0 1.25rem' }}>
              {atsReport.overall_feedback}
            </p>
            <div style={{ display: 'inline-flex', gap: '0.5rem', alignItems: 'center', background: '#0a0a0f', border: '1px solid #1e1e2e', borderRadius: 10, padding: '0.45rem 0.875rem' }}>
              <span style={{ color: '#5a5a7a', fontSize: '0.7rem', fontFamily: "'DM Mono'" }}>HIRE RECOMMENDATION</span>
              <span style={{ color: '#d0d0e8', fontWeight: 600, fontSize: '0.875rem' }}>{atsReport.hire_recommendation}</span>
            </div>
          </div>

          {/* Breakdown */}
          <div style={{ ...S.card, padding: '1.5rem', marginBottom: '1.25rem' }}>
            <p style={{ ...S.label, marginBottom: '1rem' }}>SCORE BREAKDOWN</p>
            {[
              ['Skill Match',          'skill_match'],
              ['Technical Knowledge',  'technical_knowledge'],
              ['Communication',        'communication'],
              ['Problem Solving',      'problem_solving'],
            ].map(([label, key]) => {
              const val = bd[key] || 0;
              const pct = (val / 25) * 100;
              return (
                <div key={key} style={{ marginBottom: '0.875rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                    <span style={{ color: '#8888aa', fontSize: '0.8rem' }}>{label}</span>
                    <span style={{ color: '#d0d0e8', fontSize: '0.8rem', fontFamily: "'DM Mono'" }}>{val}/25</span>
                  </div>
                  <div style={{ background: '#0a0a0f', borderRadius: 100, height: 5 }}>
                    <div style={{ height: '100%', borderRadius: 100, background: 'linear-gradient(90deg,#6366f1,#8b5cf6)', width: `${pct}%`, transition: 'width 1s ease' }} />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Strengths + Weaknesses */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.25rem' }}>
            {[
              ['STRENGTHS',        atsReport.strengths  || [], '#34d399', '✓'],
              ['AREAS TO IMPROVE', atsReport.weaknesses || [], '#f87171', '✗'],
            ].map(([title, items, color, icon]) => (
              <div key={title} style={{ ...S.card, padding: '1.5rem' }}>
                <p style={{ ...S.label, marginBottom: '0.875rem' }}>{title}</p>
                {items.map((item, i) => (
                  <div key={i} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.6rem', alignItems: 'flex-start' }}>
                    <span style={{ color, fontSize: '0.8rem', marginTop: 2 }}>{icon}</span>
                    <span style={{ color: '#8888aa', fontSize: '0.8rem', lineHeight: 1.5 }}>{item}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* Suggestions */}
          <div style={{ ...S.card, padding: '1.5rem', marginBottom: '1.25rem' }}>
            <p style={{ ...S.label, marginBottom: '0.875rem' }}>IMPROVEMENT SUGGESTIONS</p>
            {(atsReport.improvement_suggestions || []).map((s, i) => (
              <div key={i} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start', background: '#0a0a0f', border: '1px solid #1e1e2e', borderRadius: 10, padding: '0.75rem 1rem', marginBottom: '0.6rem' }}>
                <span style={{ background: 'rgba(99,102,241,0.15)', color: '#6366f1', borderRadius: 6, padding: '0.1rem 0.4rem', fontSize: '0.7rem', fontFamily: "'DM Mono'", flexShrink: 0 }}>0{i + 1}</span>
                <span style={{ color: '#8888aa', fontSize: '0.85rem', lineHeight: 1.5 }}>{s}</span>
              </div>
            ))}
          </div>

          {/* Skill Match */}
          {((atsReport.matched_skills?.length || 0) + (atsReport.missing_skills?.length || 0)) > 0 && (
            <div style={{ ...S.card, padding: '1.5rem', marginBottom: '1.25rem' }}>
              <p style={{ ...S.label, marginBottom: '0.875rem' }}>SKILL MATCH</p>
              {atsReport.matched_skills?.length > 0 && (
                <div style={{ marginBottom: '0.75rem' }}>
                  <p style={{ color: '#34d399', fontSize: '0.75rem', margin: '0 0 0.4rem' }}>✓ Matched</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                    {atsReport.matched_skills.map(s => (
                      <span key={s} style={{ background: 'rgba(52,211,153,0.1)', border: '1px solid rgba(52,211,153,0.2)', color: '#34d399', borderRadius: 6, padding: '0.2rem 0.5rem', fontSize: '0.72rem', fontFamily: "'DM Mono'" }}>{s}</span>
                    ))}
                  </div>
                </div>
              )}
              {atsReport.missing_skills?.length > 0 && (
                <div>
                  <p style={{ color: '#f87171', fontSize: '0.75rem', margin: '0 0 0.4rem' }}>✗ Missing</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                    {atsReport.missing_skills.map(s => (
                      <span key={s} style={{ background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.2)', color: '#f87171', borderRadius: 6, padding: '0.2rem 0.5rem', fontSize: '0.72rem', fontFamily: "'DM Mono'" }}>{s}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Actions */}
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button
              onClick={resetAll}
              style={{ flex: 1, ...S.card, color: '#8888aa', border: '1px solid #1e1e2e', padding: '0.875rem', cursor: 'pointer', fontFamily: "'DM Sans'", fontSize: '0.875rem', borderRadius: 12 }}
            >
              🔄 New Interview
            </button>
            <button onClick={() => navigate('/')} style={{ flex: 1, ...S.btnPrimary }}>
              ← Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── INTERVIEW CHAT ────────────────────────────────────────────────────────
  return (
    <div style={{ ...S.page, display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap');
        * { box-sizing: border-box }
        ::-webkit-scrollbar { width: 4px }
        ::-webkit-scrollbar-track { background: #0a0a0f }
        ::-webkit-scrollbar-thumb { background: #2a2a3e; border-radius: 2px }
        textarea { outline: none }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(6px) } to { opacity: 1; transform: translateY(0) } }
        @keyframes blink  { 0%,100% { opacity: 1 } 50% { opacity: 0.2 } }
        .msg { animation: fadeUp 0.25s ease }
      `}</style>

      {/* Top Bar */}
      <div style={{ background: '#13131f', borderBottom: '1px solid #1e1e2e', padding: '0.75rem 1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
          <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem' }}>🤖</div>
          <div>
            <p style={{ color: '#d0d0e8', fontWeight: 600, margin: 0, fontSize: '0.875rem' }}>AI Interviewer</p>
            <p style={{ color: '#3a3a4a', fontSize: '0.68rem', margin: 0, fontFamily: "'DM Mono'" }}>
              {role || 'Technical Interview'} · Q{qCount}/8
            </p>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ width: 90, background: '#1e1e2e', borderRadius: 100, height: 4 }}>
            <div style={{ width: `${(qCount / 8) * 100}%`, height: '100%', borderRadius: 100, background: 'linear-gradient(90deg,#6366f1,#8b5cf6)', transition: 'width 0.5s ease' }} />
          </div>
          {isComplete && (
            <button
              onClick={fetchAtsScore}
              style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', color: '#fff', border: 'none', borderRadius: 8, padding: '0.3rem 0.75rem', fontSize: '0.72rem', cursor: 'pointer', fontFamily: "'DM Sans'", fontWeight: 600 }}
            >
              Get ATS Score →
            </button>
          )}
        </div>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {messages.map(msg => (
          <div key={msg.id} className="msg" style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
            {msg.role === 'assistant' && (
              <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', flexShrink: 0, marginRight: '0.5rem', alignSelf: 'flex-end', marginBottom: 2 }}>🤖</div>
            )}
            <div style={{ maxWidth: '72%', background: msg.role === 'assistant' ? '#13131f' : 'linear-gradient(135deg,#6366f1,#8b5cf6)', border: msg.role === 'assistant' ? '1px solid #1e1e2e' : 'none', borderRadius: msg.role === 'assistant' ? '4px 16px 16px 16px' : '16px 4px 16px 16px', padding: '0.8rem 1.1rem' }}>
              <p style={{ color: msg.role === 'assistant' ? '#c0c0d8' : '#fff', margin: 0, fontSize: '0.875rem', lineHeight: 1.65, whiteSpace: 'pre-wrap' }}>
                {msg.content}
              </p>
            </div>
            {msg.role === 'user' && (
              <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#1e1e2e', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', color: '#8888aa', flexShrink: 0, marginLeft: '0.5rem', alignSelf: 'flex-end', marginBottom: 2 }}>
                {user?.name?.[0]?.toUpperCase() || 'U'}
              </div>
            )}
          </div>
        ))}

        {isTyping && (
          <div className="msg" style={{ display: 'flex', alignItems: 'flex-end', gap: '0.5rem' }}>
            <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem' }}>🤖</div>
            <div style={{ background: '#13131f', border: '1px solid #1e1e2e', borderRadius: '4px 16px 16px 16px', padding: '0.8rem 1.1rem', display: 'flex', gap: 4, alignItems: 'center' }}>
              {[0, 0.2, 0.4].map((d, i) => (
                <div key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: '#6366f1', animation: `blink 1.2s ease ${d}s infinite` }} />
              ))}
            </div>
          </div>
        )}

        {isComplete && !isTyping && (
          <div className="msg" style={{ background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.18)', borderRadius: 14, padding: '1rem 1.25rem', textAlign: 'center' }}>
            <p style={{ color: '#6366f1', margin: 0, fontSize: '0.875rem', fontWeight: 500 }}>
              🎉 Interview complete — click "Get ATS Score" above to see your results
            </p>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div style={{ background: '#13131f', borderTop: '1px solid #1e1e2e', padding: '0.875rem 1.25rem', flexShrink: 0 }}>
        <div style={{ display: 'flex', gap: '0.625rem', alignItems: 'flex-end' }}>
          <textarea
            ref={inputRef}
            value={userInput}
            onChange={e => setUserInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder={isComplete ? 'Interview complete — get your score above' : 'Type your answer... (Enter to send, Shift+Enter for new line)'}
            disabled={isTyping || isComplete}
            rows={2}
            style={{ flex: 1, background: '#0a0a0f', border: '1px solid #1e1e2e', borderRadius: 14, color: '#d0d0e8', padding: '0.7rem 1rem', fontSize: '0.875rem', resize: 'none', fontFamily: "'DM Sans'", lineHeight: 1.6, opacity: isComplete ? 0.4 : 1 }}
            onFocus={e => !isComplete && (e.target.style.borderColor = '#6366f1')}
            onBlur={e => e.target.style.borderColor = '#1e1e2e'}
          />
          <button
            onClick={handleSend}
            disabled={!userInput.trim() || isTyping || isComplete}
            style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', color: '#fff', border: 'none', borderRadius: 14, width: 44, height: 44, cursor: 'pointer', opacity: !userInput.trim() || isTyping || isComplete ? 0.35 : 1, fontSize: '1.1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.2s' }}
          >
            ↑
          </button>
        </div>
        <p style={{ color: '#2a2a3a', fontSize: '0.68rem', fontFamily: "'DM Mono'", marginTop: '0.4rem', textAlign: 'center' }}>
          Groq LLaMA 3.3 70B · Enter to send · Shift+Enter for new line
        </p>
      </div>
    </div>
  );
}