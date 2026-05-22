// src/pages/Landing.jsx
// Landing/welcome page — shown at "/" before login

import { Link } from 'react-router-dom'

// ─── Reusable small components ────────────────────────────────

function FeatureCard({ icon, title, desc }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 hover:border-purple-500/50 transition-all duration-300 group">
      <div className="text-3xl mb-4">{icon}</div>
      <h3 className="text-white font-semibold text-lg mb-2 group-hover:text-purple-300 transition-colors">
        {title}
      </h3>
      <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
    </div>
  )
}

function StatCard({ value, label }) {
  return (
    <div className="text-center">
      <div className="text-4xl font-bold text-white mb-1">{value}</div>
      <div className="text-gray-400 text-sm">{label}</div>
    </div>
  )
}

// ─── Mock dashboard preview cards ─────────────────────────────

function DashboardPreview() {
  const tasks = [
    { title: 'Design new homepage',   status: 'completed',  user: 'AJ' },
    { title: 'Fix login bug',         status: 'in_progress', user: 'SR' },
    { title: 'Write API docs',        status: 'todo',       user: 'KP' },
    { title: 'Deploy to production',  status: 'in_progress', user: 'AJ' },
    { title: 'Code review PR #42',    status: 'todo',       user: 'SR' },
    { title: 'Update test suite',     status: 'completed',  user: 'KP' },
  ]

  const statusStyle = {
    completed:   'bg-green-500/20  text-green-400  border-green-500/30',
    in_progress: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    todo:        'bg-gray-500/20   text-gray-400   border-gray-500/30',
  }

  const statusLabel = {
    completed:   'Completed',
    in_progress: 'In Progress',
    todo:        'Todo',
  }

  return (
    <div className="bg-gray-900/80 border border-white/10 rounded-2xl p-5 backdrop-blur-sm shadow-2xl">

      {/* Fake window bar */}
      <div className="flex items-center gap-2 mb-5">
        <div className="w-3 h-3 rounded-full bg-red-500/70" />
        <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
        <div className="w-3 h-3 rounded-full bg-green-500/70" />
        <span className="ml-3 text-gray-500 text-xs">TaskFlow — Dashboard</span>
      </div>

      {/* Mini stat row */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        {[
          { label: 'Total',       value: '12', color: 'text-blue-400' },
          { label: 'Completed',   value: '5',  color: 'text-green-400' },
          { label: 'In Progress', value: '4',  color: 'text-yellow-400' },
        ].map(s => (
          <div key={s.label} className="bg-white/5 rounded-xl p-3 text-center border border-white/5">
            <div className={`text-xl font-bold ${s.color}`}>{s.value}</div>
            <div className="text-gray-500 text-xs mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Task list */}
      <div className="space-y-2">
        {tasks.map((task, i) => (
          <div
            key={i}
            className="flex items-center justify-between bg-white/3 border border-white/5 rounded-xl px-3 py-2.5 hover:bg-white/8 transition-colors"
          >
            <div className="flex items-center gap-3">
              {/* Avatar circle */}
              <div className="w-7 h-7 rounded-full bg-purple-600/50 flex items-center justify-center text-xs text-purple-200 font-medium flex-shrink-0">
                {task.user}
              </div>
              <span className="text-gray-300 text-sm">{task.title}</span>
            </div>
            <span className={`text-xs px-2 py-0.5 rounded-full border ${statusStyle[task.status]}`}>
              {statusLabel[task.status]}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Main Landing Page ─────────────────────────────────────────

export default function Landing() {
  return (
    <div className="min-h-screen bg-gray-950 text-white overflow-x-hidden">

      {/* ── Navbar ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-gray-950/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">

          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center text-sm font-bold">
              T
            </div>
            <span className="text-white font-bold text-lg">TaskFlow</span>
          </div>

          {/* Nav links — hidden on mobile */}
          <div className="hidden md:flex items-center gap-8 text-sm text-gray-400">
            <a href="#features"  className="hover:text-white transition-colors">Features</a>
            <a href="#preview"   className="hover:text-white transition-colors">Preview</a>
            <a href="#stats"     className="hover:text-white transition-colors">About</a>
          </div>

          {/* Auth buttons */}
          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="text-sm text-gray-300 hover:text-white transition-colors px-4 py-2"
            >
              Log in
            </Link>
            <Link
              to="/signup"
              className="text-sm bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              Get started
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero Section ── */}
      <section className="relative pt-32 pb-24 px-6">

        {/* Background glow blobs */}
        <div className="absolute top-20 left-1/4 w-72 h-72 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-40 right-1/4 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-4xl mx-auto text-center">

          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-purple-600/10 border border-purple-500/30 text-purple-300 text-xs px-4 py-2 rounded-full mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
            Built for modern development teams
          </div>

          {/* Headline */}
          <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6">
            Manage tasks.
            <br />
            <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Ship faster.
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            TaskFlow brings your team's work together. Assign tasks, track progress,
            and hit every deadline — all in one clean dashboard.
          </p>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/signup"
              className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-semibold px-8 py-3.5 rounded-xl transition-all duration-200 shadow-lg shadow-purple-900/30 hover:shadow-purple-900/50 hover:-translate-y-0.5"
            >
              Start for free →
            </Link>
            <Link
              to="/login"
              className="w-full sm:w-auto bg-white/5 border border-white/10 hover:bg-white/10 text-white font-medium px-8 py-3.5 rounded-xl transition-all duration-200"
            >
              Sign in to your account
            </Link>
          </div>
        </div>
      </section>

      {/* ── Dashboard Preview ── */}
      <section id="preview" className="px-6 pb-24">
        <div className="max-w-3xl mx-auto">

          {/* Section label */}
          <p className="text-center text-gray-500 text-sm mb-6 uppercase tracking-widest">
            Live dashboard preview
          </p>

          {/* Glow ring around preview */}
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-600/30 to-blue-600/30 rounded-3xl blur-xl" />
            <div className="relative">
              <DashboardPreview />
            </div>
          </div>
        </div>
      </section>

      {/* ── Features Section ── */}
      <section id="features" className="px-6 pb-24">
        <div className="max-w-5xl mx-auto">

          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Everything your team needs
            </h2>
            <p className="text-gray-400 max-w-xl mx-auto">
              From task creation to deployment — TaskFlow keeps your whole team aligned.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <FeatureCard
              icon="🛡️"
              title="Role-based access"
              desc="Admins create and assign. Members execute and update. Everyone sees exactly what they need."
            />
            <FeatureCard
              icon="📋"
              title="Task management"
              desc="Create tasks, set due dates, assign to team members, and track status from Todo to Done."
            />
            <FeatureCard
              icon="📊"
              title="Live dashboard"
              desc="Instant overview of total, completed, in-progress, and overdue tasks at a glance."
            />
            <FeatureCard
              icon="📁"
              title="Project organisation"
              desc="Group tasks under projects. Add members per project. Keep work scoped and focused."
            />
            <FeatureCard
              icon="🔐"
              title="JWT authentication"
              desc="Secure token-based auth. Your data stays private. Sessions persist across reloads."
            />
            <FeatureCard
              icon="⚡"
              title="Fast & lightweight"
              desc="Built with React, FastAPI, and MongoDB. Snappy responses and minimal load times."
            />
          </div>
        </div>
      </section>

      {/* ── Stats Section ── */}
      <section id="stats" className="px-6 pb-24">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 border border-white/10 rounded-3xl px-8 py-14">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
              <StatCard value="3"    label="User roles" />
              <StatCard value="∞"    label="Tasks & projects" />
              <StatCard value="100%" label="Responsive" />
              <StatCard value="JWT"  label="Secure auth" />
            </div>
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="px-6 pb-32 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to get organised?
          </h2>
          <p className="text-gray-400 mb-8">
            Sign up in seconds. No credit card required.
          </p>
          <Link
            to="/signup"
            className="inline-block bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-semibold px-10 py-4 rounded-xl transition-all duration-200 shadow-lg shadow-purple-900/40 hover:-translate-y-0.5"
          >
            Create your account →
          </Link>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-white/5 px-6 py-8">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center text-xs font-bold">
              T
            </div>
            <span className="text-gray-400 text-sm">TaskFlow</span>
          </div>
          <p className="text-gray-600 text-sm">
            Built with React · FastAPI · MongoDB
          </p>
          <div className="flex gap-6 text-sm text-gray-600">
            <Link to="/login"  className="hover:text-gray-400 transition-colors">Login</Link>
            <Link to="/signup" className="hover:text-gray-400 transition-colors">Sign up</Link>
          </div>
        </div>
      </footer>

    </div>
  )
}