import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  Aperture, Bell, ChevronDown, ChevronRight, Clock3, Crown, Folder,
  Grid2X2, Image, LayoutGrid, Menu, Search, Settings, Sparkles,
  Upload, Video, WandSparkles, X, Zap
} from 'lucide-react';
import './styles.css';

const tools = [
  { title: 'AI Image Generator', label: 'IMAGE', icon: Image, color: 'violet', desc: 'Turn prompts into polished visual assets.', featured: true },
  { title: 'AI Video Generator', label: 'VIDEO', icon: Video, color: 'pink', desc: 'Create cinematic clips from text or images.', featured: true },
  { title: 'Image to Video', label: 'ANIMATE', icon: Aperture, color: 'orange', desc: 'Bring still images to life with motion.' },
  { title: 'AI Character', label: 'AVATAR', icon: Sparkles, color: 'blue', desc: 'Generate consistent digital characters.' },
  { title: 'Smart Upscaler', label: 'ENHANCE', icon: WandSparkles, color: 'green', desc: 'Enhance resolution and restore details.' },
  { title: 'Video Effects', label: 'EFFECTS', icon: Zap, color: 'yellow', desc: 'Apply cinematic looks and transformations.' }
];

const creations = [
  { title: 'Editorial portrait', type: 'Image', time: '2m ago', className: 'art-one' },
  { title: 'Oceanic dream', type: 'Video', time: '18m ago', className: 'art-two' },
  { title: 'Neon character', type: 'Image', time: '1h ago', className: 'art-three' },
  { title: 'Fashion motion', type: 'Video', time: '3h ago', className: 'art-four' }
];

function App() {
  const [active, setActive] = useState('Studio');
  const [menuOpen, setMenuOpen] = useState(false);
  const [prompt, setPrompt] = useState('');

  const nav = [
    ['Studio', LayoutGrid], ['My creations', Folder], ['Recent', Clock3]
  ];

  return (
    <div className="app-shell">
      <aside className={`sidebar ${menuOpen ? 'open' : ''}`}>
        <div className="brand"><span className="brand-mark"><Aperture size={19}/></span><span>ARTEKHAII</span></div>
        <button className="close-menu" onClick={() => setMenuOpen(false)}><X/></button>
        <nav>
          <p className="nav-heading">CREATE</p>
          {nav.map(([name, Icon]) => <button key={name} className={`nav-item ${active === name ? 'active' : ''}`} onClick={() => {setActive(name); setMenuOpen(false)}}><Icon size={18}/><span>{name}</span></button>)}
          <p className="nav-heading">WORKSPACE</p>
          <button className="nav-item"><Grid2X2 size={18}/><span>Brand kits</span></button>
          <button className="nav-item"><Settings size={18}/><span>Settings</span></button>
        </nav>
        <div className="usage-card">
          <div className="usage-top"><span>Pro plan</span><Crown size={16}/></div>
          <div className="usage-label"><span>Credits</span><strong>7,840</strong></div>
          <div className="progress"><span/></div>
          <button className="upgrade">Upgrade plan</button>
        </div>
      </aside>

      <main>
        <header>
          <button className="mobile-menu" onClick={() => setMenuOpen(true)}><Menu/></button>
          <label className="search"><Search size={17}/><input placeholder="Search tools and creations"/></label>
          <div className="header-actions"><button className="icon-button"><Bell size={18}/></button><button className="avatar">K</button></div>
        </header>

        <div className="content">
          <section className="welcome">
            <div><p className="eyebrow">CREATIVE WORKSPACE</p><h1>What will you create?</h1></div>
            <button className="new-project"><Upload size={16}/> Import</button>
          </section>

          <section className="prompt-box">
            <textarea value={prompt} onChange={e => setPrompt(e.target.value)} placeholder="Describe anything you can imagine..." />
            <div className="prompt-actions">
              <button className="model-button"><Sparkles size={15}/> Auto <ChevronDown size={14}/></button>
              <button className="generate" onClick={() => setPrompt(prompt || 'A cinematic portrait, studio lighting')}>Generate <ChevronRight size={17}/></button>
            </div>
          </section>

          <section>
            <div className="section-heading"><h2>AI tools</h2><button>View all <ChevronRight size={15}/></button></div>
            <div className="tool-grid">
              {tools.map(({title, label, icon: Icon, color, desc, featured}) => (
                <button className={`tool-card ${featured ? 'featured' : ''}`} key={title}>
                  <div className={`tool-icon ${color}`}><Icon size={19}/></div>
                  <div className="tool-copy"><span>{label}</span><h3>{title}</h3><p>{desc}</p></div>
                  <ChevronRight className="tool-arrow" size={17}/>
                </button>
              ))}
            </div>
          </section>

          <section className="creations-section">
            <div className="section-heading"><h2>Recent creations</h2><button>View all <ChevronRight size={15}/></button></div>
            <div className="creation-grid">
              {creations.map(item => <article className="creation-card" key={item.title}>
                <div className={`creation-art ${item.className}`}><span className="type-badge">{item.type}</span></div>
                <div className="creation-meta"><div><h3>{item.title}</h3><p>{item.time}</p></div><button>•••</button></div>
              </article>)}
            </div>
          </section>
        </div>
      </main>
      {menuOpen && <div className="overlay" onClick={() => setMenuOpen(false)}/>} 
    </div>
  );
}

createRoot(document.getElementById('root')).render(<App/>);
