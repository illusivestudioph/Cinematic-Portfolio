import React, { useState } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import type { PortfolioContent, ProjectItem } from '../../config/content';
import { Save, LogOut, Film, Image as ImageIcon, Briefcase, Layers, User, PhoneCall, Check, Plus, Trash2, ArrowUp, ArrowDown } from 'lucide-react';

interface AdminDashboardProps {
  onClose: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onClose }) => {
  const { content, updateContent, signOutAdmin, userEmail } = usePortfolio();


  const [formData, setFormData] = useState<PortfolioContent>(content);
  const [activeTab, setActiveTab] = useState<'showreel' | 'sequences' | 'projects' | 'process' | 'about' | 'contact'>('showreel');
  const [selectedSeqBeat, setSelectedSeqBeat] = useState<'beat01Static' | 'beat02BreakFrame' | 'beat03Catalyst' | 'beat05Deconstruction' | 'beat06CTAAnchor' | 'beat07FooterFade'>('beat01Static');
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  const handleSave = async () => {
    setSaveStatus('saving');
    const success = await updateContent(formData);
    if (success) {
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2500);
    } else {
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 3000);
    }
  };

  // Helper to reorder projects
  const moveProject = (index: number, direction: 'up' | 'down') => {
    const newProjects = [...formData.projects];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= newProjects.length) return;
    const temp = newProjects[index];
    newProjects[index] = newProjects[targetIdx];
    newProjects[targetIdx] = temp;
    setFormData({ ...formData, projects: newProjects });
  };

  const deleteProject = (id: string) => {
    if (window.confirm('Delete this project destination?')) {
      setFormData({
        ...formData,
        projects: formData.projects.filter(p => p.id !== id),
      });
    }
  };

  const addProject = () => {
    const newProj: ProjectItem = {
      id: `proj_${Date.now()}`,
      title: 'NEW EDITORIAL WORK',
      client: 'CLIENT / BRAND',
      category: 'Commercial / Music Video',
      year: new Date().getFullYear().toString(),
      description: 'Project editorial details and pacing notes.',
      role: 'Lead Editor',
      tools: ['Premiere Pro', 'DaVinci Resolve'],
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      thumbnailUrl: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=1280&q=80',
      aspectRatio: '16:9',
      metrics: [
        { label: 'Cuts', value: '180' },
        { label: 'Audio', value: '32 Stems' },
      ],
    };
    setFormData({ ...formData, projects: [...formData.projects, newProj] });
  };

  return (
    <div className="flex flex-col h-full bg-[#090b10] text-slate-200">
      {/* Admin Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#0d1017]">
        <div className="flex items-center space-x-3">
          <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
          <h2 className="font-syne text-lg font-bold uppercase tracking-wider text-white">
            ILLUSIVE STUDIO // ADMIN GATE CONSOLE
          </h2>
          <span className="text-xs font-mono text-cyan-300/70 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-500/30">
            {userEmail || 'STUDIO_ADMIN'}
          </span>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleSave}
            disabled={saveStatus === 'saving'}
            className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black font-mono text-xs font-bold uppercase tracking-wider shadow-[0_0_15px_rgba(56,189,248,0.4)] transition-all"
          >
            {saveStatus === 'saved' ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
            <span>{saveStatus === 'saving' ? 'SAVING...' : saveStatus === 'saved' ? 'SAVED!' : 'SAVE CHANGES'}</span>
          </button>

          <button
            onClick={async () => {
              await signOutAdmin();
              onClose();
            }}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-slate-300"
            title="Sign Out & Close"
          >
            <LogOut className="w-4 h-4" />
            <span>EXIT</span>
          </button>

        </div>
      </div>

      {/* Main Admin Body */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar Navigation */}
        <div className="w-56 border-r border-white/10 bg-[#0b0e14] p-3 space-y-1">
          <button
            onClick={() => setActiveTab('showreel')}
            className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-xs font-mono tracking-wider text-left transition-colors ${
              activeTab === 'showreel' ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-400/40' : 'text-slate-400 hover:bg-white/5'
            }`}
          >
            <Film className="w-4 h-4 text-cyan-400" />
            <span>01 SHOWREEL MP4</span>
          </button>

          <button
            onClick={() => setActiveTab('sequences')}
            className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-xs font-mono tracking-wider text-left transition-colors ${
              activeTab === 'sequences' ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-400/40' : 'text-slate-400 hover:bg-white/5'
            }`}
          >
            <ImageIcon className="w-4 h-4 text-purple-400" />
            <span>02 WEBP SEQUENCES</span>
          </button>

          <button
            onClick={() => setActiveTab('projects')}
            className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-xs font-mono tracking-wider text-left transition-colors ${
              activeTab === 'projects' ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-400/40' : 'text-slate-400 hover:bg-white/5'
            }`}
          >
            <Briefcase className="w-4 h-4 text-amber-400" />
            <span>03 PROJECTS CATALOG</span>
          </button>

          <button
            onClick={() => setActiveTab('process')}
            className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-xs font-mono tracking-wider text-left transition-colors ${
              activeTab === 'process' ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-400/40' : 'text-slate-400 hover:bg-white/5'
            }`}
          >
            <Layers className="w-4 h-4 text-emerald-400" />
            <span>04 PROCESS PIPELINE</span>
          </button>

          <button
            onClick={() => setActiveTab('about')}
            className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-xs font-mono tracking-wider text-left transition-colors ${
              activeTab === 'about' ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-400/40' : 'text-slate-400 hover:bg-white/5'
            }`}
          >
            <User className="w-4 h-4 text-rose-400" />
            <span>05 ABOUT CONTENT</span>
          </button>

          <button
            onClick={() => setActiveTab('contact')}
            className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-xs font-mono tracking-wider text-left transition-colors ${
              activeTab === 'contact' ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-400/40' : 'text-slate-400 hover:bg-white/5'
            }`}
          >
            <PhoneCall className="w-4 h-4 text-sky-400" />
            <span>06 CONTACT & CTA</span>
          </button>
        </div>

        {/* Form Container */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* TAB 1: SHOWREEL */}
          {activeTab === 'showreel' && (
            <div className="space-y-4 max-w-2xl">
              <h3 className="font-syne text-base font-bold uppercase text-white border-b border-white/10 pb-2">
                MASTER EDITORIAL SHOWREEL CONFIGURATION
              </h3>
              
              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">Showreel MP4 Video URL</label>
                <input
                  type="text"
                  value={formData.showreel.videoUrl}
                  onChange={(e) => setFormData({
                    ...formData,
                    showreel: { ...formData.showreel, videoUrl: e.target.value }
                  })}
                  className="w-full px-3 py-2 rounded bg-black/60 border border-white/10 text-xs font-mono text-slate-200 focus:border-cyan-400 outline-none"
                  placeholder="https://.../showreel.mp4"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">Poster Thumbnail URL</label>
                <input
                  type="text"
                  value={formData.showreel.posterUrl}
                  onChange={(e) => setFormData({
                    ...formData,
                    showreel: { ...formData.showreel, posterUrl: e.target.value }
                  })}
                  className="w-full px-3 py-2 rounded bg-black/60 border border-white/10 text-xs font-mono text-slate-200 focus:border-cyan-400 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1">Showreel Title</label>
                  <input
                    type="text"
                    value={formData.showreel.title}
                    onChange={(e) => setFormData({
                      ...formData,
                      showreel: { ...formData.showreel, title: e.target.value }
                    })}
                    className="w-full px-3 py-2 rounded bg-black/60 border border-white/10 text-xs font-mono text-slate-200 focus:border-cyan-400 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1">Subtitle / Genre</label>
                  <input
                    type="text"
                    value={formData.showreel.subtitle}
                    onChange={(e) => setFormData({
                      ...formData,
                      showreel: { ...formData.showreel, subtitle: e.target.value }
                    })}
                    className="w-full px-3 py-2 rounded bg-black/60 border border-white/10 text-xs font-mono text-slate-200 focus:border-cyan-400 outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: WEBP SEQUENCES */}
          {activeTab === 'sequences' && (
            <div className="space-y-6 max-w-3xl">
              <div>
                <h3 className="font-syne text-base font-bold uppercase text-white border-b border-white/10 pb-2">
                  CINEMATIC WEBP SCROLL SEQUENCES (SUPABASE STORAGE)
                </h3>
                <p className="text-xs text-slate-400 mt-2">
                  WebP frame sequences scrub dynamically with user scroll. Configure each beat's sequence URL independently. Frame count is configurable per sequence (typically 100–140 frames).
                </p>
              </div>

              {/* Beat Selector Pills */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {[
                  { key: 'beat01Static', label: 'BEAT 01 // STATIC ILLUSION' },
                  { key: 'beat02BreakFrame', label: 'BEAT 02 // BREAK FRAME' },
                  { key: 'beat03Catalyst', label: 'BEAT 03 // CATALYST' },
                  { key: 'beat05Deconstruction', label: 'BEAT 05 // DECONSTRUCTION' },
                  { key: 'beat06CTAAnchor', label: 'BEAT 06 // CTA PULLBACK' },
                  { key: 'beat07FooterFade', label: 'BEAT 07 // FOOTER SILHOUETTE' },
                ].map(({ key, label }) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setSelectedSeqBeat(key as any)}
                    className={`px-3 py-2 rounded-lg text-left font-mono text-[11px] border transition-all ${
                      selectedSeqBeat === key
                        ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400/60 shadow-[0_0_15px_rgba(56,189,248,0.2)]'
                        : 'bg-black/40 text-slate-400 border-white/5 hover:border-white/15'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>

              {/* Active Selected Beat Form */}
              {(() => {
                const currentSeq = formData.sequences?.[selectedSeqBeat] || {
                  baseUrl: '',
                  frameCount: 120,
                  padding: 4,
                  fallback: '',
                };

                const updateCurrentSeq = (updates: Partial<typeof currentSeq>) => {
                  const updatedSeq = { ...currentSeq, ...updates };
                  setFormData({
                    ...formData,
                    editorSequence: selectedSeqBeat === 'beat01Static' || selectedSeqBeat === 'beat02BreakFrame' ? updatedSeq : formData.editorSequence,
                    sequences: {
                      ...formData.sequences,
                      [selectedSeqBeat]: updatedSeq,
                    },
                  });
                };

                return (
                  <div className="p-4 rounded-xl bg-black/40 border border-white/10 space-y-4">
                    <div className="flex items-center justify-between pb-2 border-b border-white/10">
                      <span className="font-mono text-xs font-bold text-cyan-400 uppercase">
                        EDITING: {selectedSeqBeat.toUpperCase()} SEQUENCE
                      </span>
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-slate-400 mb-1">
                        WebP Base URL (or template with {'{index}'})
                      </label>
                      <input
                        type="text"
                        value={currentSeq.baseUrl}
                        onChange={(e) => updateCurrentSeq({ baseUrl: e.target.value })}
                        className="w-full px-3 py-2 rounded bg-black/60 border border-white/10 text-xs font-mono text-slate-200 focus:border-cyan-400 outline-none"
                        placeholder="https://...supabase.co/storage/v1/object/public/sequences/beat_01"
                      />
                      <span className="text-[10px] font-mono text-slate-500 mt-1 block">
                        Leave empty to use the dedicated high-resolution editorial fallback image.
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-mono text-slate-400 mb-1">Total Frame Count</label>
                        <input
                          type="number"
                          value={currentSeq.frameCount}
                          onChange={(e) => updateCurrentSeq({ frameCount: parseInt(e.target.value) || 120 })}
                          className="w-full px-3 py-2 rounded bg-black/60 border border-white/10 text-xs font-mono text-slate-200 focus:border-cyan-400 outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-mono text-slate-400 mb-1">Padding Digits (default 4 = 0001)</label>
                        <input
                          type="number"
                          value={currentSeq.padding}
                          onChange={(e) => updateCurrentSeq({ padding: parseInt(e.target.value) || 4 })}
                          className="w-full px-3 py-2 rounded bg-black/60 border border-white/10 text-xs font-mono text-slate-200 focus:border-cyan-400 outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-slate-400 mb-1">Fallback Visual Image URL</label>
                      <input
                        type="text"
                        value={currentSeq.fallback}
                        onChange={(e) => updateCurrentSeq({ fallback: e.target.value })}
                        className="w-full px-3 py-2 rounded bg-black/60 border border-white/10 text-xs font-mono text-slate-200 focus:border-cyan-400 outline-none"
                      />
                    </div>
                  </div>
                );
              })()}
            </div>
          )}

          {/* TAB 3: PROJECTS */}
          {activeTab === 'projects' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <h3 className="font-syne text-base font-bold uppercase text-white">
                  SELECTED WORK DESTINATIONS (FEATURING CRIMEXBT)
                </h3>
                <button
                  onClick={addProject}
                  className="flex items-center space-x-1 px-3 py-1.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 text-xs font-mono"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>ADD DESTINATION</span>
                </button>
              </div>

              <div className="space-y-4">
                {formData.projects.map((proj, idx) => (
                  <div
                    key={proj.id}
                    className="p-4 rounded-xl bg-black/60 border border-white/10 space-y-3"
                  >
                    <div className="flex items-center justify-between border-b border-white/5 pb-2">
                      <div className="flex items-center space-x-2">
                        <span className="font-mono text-xs text-cyan-400 font-bold">0{idx + 1}</span>
                        <input
                          type="text"
                          value={proj.title}
                          onChange={(e) => {
                            const newProjects = [...formData.projects];
                            newProjects[idx].title = e.target.value;
                            setFormData({ ...formData, projects: newProjects });
                          }}
                          className="bg-transparent font-syne font-bold text-white text-sm focus:outline-none border-b border-white/10"
                        />
                      </div>

                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => moveProject(idx, 'up')}
                          disabled={idx === 0}
                          className="p-1 rounded bg-white/5 hover:bg-white/10 text-slate-400 disabled:opacity-30"
                          title="Move Up"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => moveProject(idx, 'down')}
                          disabled={idx === formData.projects.length - 1}
                          className="p-1 rounded bg-white/5 hover:bg-white/10 text-slate-400 disabled:opacity-30"
                          title="Move Down"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => deleteProject(proj.id)}
                          className="p-1 rounded bg-red-500/10 hover:bg-red-500/20 text-red-400"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
                      <div>
                        <label className="text-slate-400 block mb-0.5">Client</label>
                        <input
                          type="text"
                          value={proj.client}
                          onChange={(e) => {
                            const newProjects = [...formData.projects];
                            newProjects[idx].client = e.target.value;
                            setFormData({ ...formData, projects: newProjects });
                          }}
                          className="w-full px-2 py-1.5 rounded bg-slate-900 border border-white/10 text-slate-200 outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-slate-400 block mb-0.5">Category</label>
                        <input
                          type="text"
                          value={proj.category}
                          onChange={(e) => {
                            const newProjects = [...formData.projects];
                            newProjects[idx].category = e.target.value;
                            setFormData({ ...formData, projects: newProjects });
                          }}
                          className="w-full px-2 py-1.5 rounded bg-slate-900 border border-white/10 text-slate-200 outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
                      <div>
                        <label className="text-slate-400 block mb-0.5">Video MP4 URL</label>
                        <input
                          type="text"
                          value={proj.videoUrl}
                          onChange={(e) => {
                            const newProjects = [...formData.projects];
                            newProjects[idx].videoUrl = e.target.value;
                            setFormData({ ...formData, projects: newProjects });
                          }}
                          className="w-full px-2 py-1.5 rounded bg-slate-900 border border-white/10 text-slate-200 outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-slate-400 block mb-0.5">Thumbnail URL</label>
                        <input
                          type="text"
                          value={proj.thumbnailUrl}
                          onChange={(e) => {
                            const newProjects = [...formData.projects];
                            newProjects[idx].thumbnailUrl = e.target.value;
                            setFormData({ ...formData, projects: newProjects });
                          }}
                          className="w-full px-2 py-1.5 rounded bg-slate-900 border border-white/10 text-slate-200 outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-slate-400 block text-xs font-mono mb-0.5">Description</label>
                      <textarea
                        rows={2}
                        value={proj.description}
                        onChange={(e) => {
                          const newProjects = [...formData.projects];
                          newProjects[idx].description = e.target.value;
                          setFormData({ ...formData, projects: newProjects });
                        }}
                        className="w-full px-2 py-1.5 rounded bg-slate-900 border border-white/10 text-xs text-slate-200 outline-none font-sans"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: PROCESS */}
          {activeTab === 'process' && (
            <div className="space-y-4 max-w-2xl">
              <h3 className="font-syne text-base font-bold uppercase text-white border-b border-white/10 pb-2">
                BEHIND THE EDIT // 6 PROCESS ENVIRONMENTS
              </h3>
              {formData.processStages.map((stg, i) => (
                <div key={stg.id} className="p-3 rounded-lg bg-black/60 border border-white/10 space-y-2">
                  <div className="flex justify-between items-center text-xs font-mono">
                    <span className="text-cyan-400 font-bold">{stg.step} // {stg.title}</span>
                    <input
                      type="text"
                      value={stg.visualMetric}
                      onChange={(e) => {
                        const newStages = [...formData.processStages];
                        newStages[i].visualMetric = e.target.value;
                        setFormData({ ...formData, processStages: newStages });
                      }}
                      className="px-2 py-0.5 bg-slate-900 border border-white/10 rounded text-cyan-300 text-[10px]"
                    />
                  </div>
                  <input
                    type="text"
                    value={stg.tagline}
                    onChange={(e) => {
                      const newStages = [...formData.processStages];
                      newStages[i].tagline = e.target.value;
                      setFormData({ ...formData, processStages: newStages });
                    }}
                    className="w-full px-2 py-1 rounded bg-slate-900 border border-white/10 text-xs font-mono text-slate-200"
                  />
                </div>
              ))}
            </div>
          )}

          {/* TAB 5: ABOUT */}
          {activeTab === 'about' && (
            <div className="space-y-4 max-w-2xl">
              <h3 className="font-syne text-base font-bold uppercase text-white border-b border-white/10 pb-2">
                ABOUT // THE PERSON BEHIND THE TIMELINE
              </h3>
              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">Headline Statement</label>
                <input
                  type="text"
                  value={formData.about.headline}
                  onChange={(e) => setFormData({
                    ...formData,
                    about: { ...formData.about, headline: e.target.value }
                  })}
                  className="w-full px-3 py-2 rounded bg-black/60 border border-white/10 text-xs font-mono text-slate-200 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">Bio (Paragraph 1)</label>
                <textarea
                  rows={3}
                  value={formData.about.bio[0] || ''}
                  onChange={(e) => {
                    const newBio = [...formData.about.bio];
                    newBio[0] = e.target.value;
                    setFormData({
                      ...formData,
                      about: { ...formData.about, bio: newBio }
                    });
                  }}
                  className="w-full px-3 py-2 rounded bg-black/60 border border-white/10 text-xs font-sans text-slate-200 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">Bio (Paragraph 2)</label>
                <textarea
                  rows={3}
                  value={formData.about.bio[1] || ''}
                  onChange={(e) => {
                    const newBio = [...formData.about.bio];
                    newBio[1] = e.target.value;
                    setFormData({
                      ...formData,
                      about: { ...formData.about, bio: newBio }
                    });
                  }}
                  className="w-full px-3 py-2 rounded bg-black/60 border border-white/10 text-xs font-sans text-slate-200 outline-none"
                />
              </div>
            </div>
          )}

          {/* TAB 6: CONTACT & CTA */}
          {activeTab === 'contact' && (
            <div className="space-y-4 max-w-2xl">
              <h3 className="font-syne text-base font-bold uppercase text-white border-b border-white/10 pb-2">
                FINAL CTA & CONTACT CHANNELS
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1">Headline 1</label>
                  <input
                    type="text"
                    value={formData.contact.headline}
                    onChange={(e) => setFormData({
                      ...formData,
                      contact: { ...formData.contact, headline: e.target.value }
                    })}
                    className="w-full px-3 py-2 rounded bg-black/60 border border-white/10 text-xs font-mono text-slate-200 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1">Subheadline 2</label>
                  <input
                    type="text"
                    value={formData.contact.subheadline}
                    onChange={(e) => setFormData({
                      ...formData,
                      contact: { ...formData.contact, subheadline: e.target.value }
                    })}
                    className="w-full px-3 py-2 rounded bg-black/60 border border-white/10 text-xs font-mono text-slate-200 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1">Email</label>
                  <input
                    type="email"
                    value={formData.contact.email}
                    onChange={(e) => setFormData({
                      ...formData,
                      contact: { ...formData.contact, email: e.target.value }
                    })}
                    className="w-full px-3 py-2 rounded bg-black/60 border border-white/10 text-xs font-mono text-slate-200 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1">Availability Status</label>
                  <input
                    type="text"
                    value={formData.contact.availability}
                    onChange={(e) => setFormData({
                      ...formData,
                      contact: { ...formData.contact, availability: e.target.value }
                    })}
                    className="w-full px-3 py-2 rounded bg-black/60 border border-white/10 text-xs font-mono text-slate-200 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1">Instagram</label>
                  <input
                    type="text"
                    value={formData.contact.instagram}
                    onChange={(e) => setFormData({
                      ...formData,
                      contact: { ...formData.contact, instagram: e.target.value }
                    })}
                    className="w-full px-2 py-1.5 rounded bg-black/60 border border-white/10 text-xs font-mono text-slate-200 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1">Vimeo</label>
                  <input
                    type="text"
                    value={formData.contact.vimeo}
                    onChange={(e) => setFormData({
                      ...formData,
                      contact: { ...formData.contact, vimeo: e.target.value }
                    })}
                    className="w-full px-2 py-1.5 rounded bg-black/60 border border-white/10 text-xs font-mono text-slate-200 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1">X (Twitter)</label>
                  <input
                    type="text"
                    value={formData.contact.twitter}
                    onChange={(e) => setFormData({
                      ...formData,
                      contact: { ...formData.contact, twitter: e.target.value }
                    })}
                    className="w-full px-2 py-1.5 rounded bg-black/60 border border-white/10 text-xs font-mono text-slate-200 outline-none"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
