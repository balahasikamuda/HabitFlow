import React, { useState } from 'react';
import { Award, ChevronDown, ChevronUp, Layers, CheckCircle2 } from 'lucide-react';

const HackathonBanner = () => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 text-white shadow-md text-xs sm:text-sm">
      <div className="max-w-7xl mx-auto px-4 py-2 sm:py-2.5 flex items-center justify-between">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="flex items-center gap-1.5 font-semibold bg-white/20 backdrop-blur-sm px-2.5 py-0.5 rounded-full text-white">
            <Award className="w-3.5 h-3.5" /> Hackathon Project
          </span>
          <span className="font-medium text-emerald-50 hidden sm:inline">
            Lifestyle & Personal Management – 13. Habit Tracking Application
          </span>
          <span className="bg-black/20 text-emerald-100 px-2 py-0.5 rounded-md font-mono text-xs">
            MERN Stack
          </span>
        </div>

        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-1 text-emerald-100 hover:text-white transition-colors py-0.5 px-2 rounded hover:bg-white/10"
        >
          <span>{expanded ? 'Hide Details' : 'View Problem Statement & Architecture'}</span>
          {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {expanded && (
        <div className="border-t border-white/20 bg-slate-900/90 backdrop-blur-md px-4 py-3 text-slate-200 text-xs transition-all">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="font-semibold text-emerald-400 mb-1 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5" /> Core MERN Architecture
              </p>
              <ul className="space-y-1 text-slate-300">
                <li>• <strong>MongoDB:</strong> Users & Habits collections with streak history</li>
                <li>• <strong>Express & Node.js:</strong> REST APIs with JWT & bcrypt security</li>
                <li>• <strong>React:</strong> Component dashboard, calendar, & progress analytics</li>
              </ul>
            </div>

            <div>
              <p className="font-semibold text-teal-400 mb-1 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" /> Core Fields Tracked
              </p>
              <div className="p-2 bg-slate-800/80 rounded border border-slate-700 font-mono text-[11px] text-teal-200">
                Habit ➔ Date ➔ Target ➔ Completion Status
              </div>
              <p className="text-[11px] text-slate-400 mt-1">Full CRUD support: Create, Read, Update, Delete</p>
            </div>

            <div>
              <p className="font-semibold text-indigo-400 mb-1">Key Hackathon Features</p>
              <p className="text-slate-300 leading-relaxed">
                🔥 Habit Streaks, 📅 Interactive Calendar, 📊 Weekly/Monthly Analytics, 🌙 Dark/Light Mode, 🔔 Reminders, and Search & Filter.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HackathonBanner;
