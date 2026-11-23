import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Aperture, Bell, ChevronDown, ChevronRight, Clock3, Crown, Folder, Grid2X2, Image, LayoutGrid, Menu, Search, Settings, Sparkles, Upload, Video, WandSparkles, X, Zap } from 'lucide-react';
import './styles.css';

const ADMIN_EMAIL = 'artekhaiidesign@gmail.com';
const ADMIN_CREDITS = 1_000_000;
const PLAN_CREDITS = { Creator: 5000, Pro: 20000, Studio: 60000 };
const tools = [
  { title: 'AI Image Generator', label: 'IMAGE', icon: Image, color: 'violet', desc: 'Turn prompts into polished visual assets.' },
  { title: 'AI Video Generator', label: 'VIDEO', icon: Video, color: 'pink', desc: 'Create cinematic clips from text or images.' },
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
const readDemo = () => {
  try { return JSON.parse(localStorage.getItem('artekhaii-demo-account') || '{}'); }
  catch { return {}; }
};

function App() {
  const [active, setActive] = useState('Studio');
  const [menuOpen, setMenuOpen] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [modal, setModal] = useState('');
  const [notice, setNotice] = useState('');
  const [account, setAccount] = useState(readDemo);
  const [emailInput, setEmailInput] = useState(account.email || '');
  const [selectedTool, setSelectedTool] = useState('AI Image Generator');

  const isAdmin = account.email?.trim().toLowerCase() === ADMIN_EMAIL;
  const credits = isAdmin ? ADMIN_CREDITS : (account.credits ?? 7840);
  const plan = account.plan || (isAdmin ? 'Admin' : 'Pro');
  useEffect(() => { localStorage.setItem('artekhaii-demo-account', JSON.stringify(account)); }, [account]);

  const nav = [['Studio', LayoutGrid], ['My creations', Folder], ['Recent', Clock3]];
  const saveAccount = next => setAccount(current => ({ ...current, ...next }));
  const signInDemo = event => {
    event.preventDefault();
    const email = emailInput.trim().toLowerCase();
    if (!email || !email.includes('@')) { setNotice('Enter a valid email address.'); return; }
    const admin = email === ADMIN_EMAIL;
    saveAccount({ email, plan: admin ? 'Admin' : (account.plan || 'Pro'), credits: admin ? ADMIN_CREDITS : (account.credits ?? 7840) });
    setNotice(admin ? 'Admin demo account active: 1,000,000 credits.' : 'Demo account saved on this browser.');
    setModal('');
  };
  const choosePlan = name => {
    if (!account.email) { setNotice('Sign in to activate a demo plan.'); setModal('account'); return; }
    if (isAdmin) { setNotice('Admin demo accounts keep their 1,000,000-credit allowance.'); setModal(''); return; }
    saveAccount({ plan: name, credits: (account.credits ?? 7840) + PLAN_CREDITS[name] });
    setNotice(`${name} demo plan activated. ${PLAN_CREDITS[name].toLocaleString()} demo credits added. No payment was taken.`);
    setModal('');
  };
  const generateDemo = () => {
    if (!account.email) { setNotice('Sign in to try the studio demo.'); setModal('account'); return; }
    if (!prompt.trim()) { setNotice('Add a prompt before generating.'); return; }
    if (!isAdmin && credits < 10) { setNotice('Not enough demo credits. Choose a demo plan to continue.'); setModal('plans'); return; }
    if (!isAdmin) saveAccount({ credits: credits - 10 });
    setNotice(`Demo ${selectedTool.toLowerCase()} queued. Connect a generation provider to create real media.`);
  };

  return <div className="app-shell">
    <aside className={`sidebar ${menuOpen ? 'open' : ''}`}>
      <div className="brand"><span className="brand-mark"><Aperture size={19}/></span><span>ARTEKHAII</span></div>
      <button className="close-menu" onClick={() => setMenuOpen(false)} aria-label="Close menu"><X/></button>
      <nav><p className="nav-heading">CREATE</p>
        {nav.map(([name, Icon]) => <button key={name} className={`nav-item ${active === name ? 'active' : ''}`} onClick={() => { setActive(name); setMenuOpen(false); }}><Icon size={18}/><span>{name}</span></button>)}
        <p className="nav-heading">WORKSPACE</p>
        <button className="nav-item"><Grid2X2 size={18}/><span>Brand kits</span></button><button className="nav-item"><Settings size={18}/><span>Settings</span></button>
      </nav>
      <div className="usage-card"><div className="usage-top"><span>{plan} plan</span><Crown size={16}/></div><div className="usage-label"><span>Credits</span><strong>{credits.toLocaleString()}</strong></div><div className="progress"><span style={{ width: isAdmin ? '100%' : '78%' }}/></div><button className="upgrade" onClick={() => setModal('plans')}>{isAdmin ? 'Admin account' : 'View plans'}</button></div>
    </aside>
    <main>
      <header><button className="mobile-menu" onClick={() => setMenuOpen(true)} aria-label="Open menu"><Menu/></button><label className="search"><Search size={17}/><input placeholder="Search tools and creations"/></label><div className="header-actions"><button className="icon-button" aria-label="Notifications"><Bell size={18}/></button><button className="avatar" onClick={() => { setEmailInput(account.email || ''); setModal('account'); }} title={account.email || 'Demo account'}>{account.email ? account.email[0].toUpperCase() : 'K'}</button></div></header>
      <div className="content">
        <section className="welcome"><div><p className="eyebrow">CREATIVE WORKSPACE</p><h1>What will you create?</h1></div><button className="new-project" onClick={() => setNotice('Import is available when media storage is connected.')}><Upload size={16}/> Import</button></section>
        <section className="prompt-box"><textarea value={prompt} onChange={e => setPrompt(e.target.value)} placeholder="Describe anything you can imagine..."/><div className="prompt-actions"><button className="model-button" onClick={() => setModal('tools')}><Sparkles size={15}/>{selectedTool.replace('AI ', '')}<ChevronDown size={14}/></button><button className="generate" onClick={generateDemo}>Generate <ChevronRight size={17}/></button></div></section>
        <section><div className="section-heading"><h2>AI tools</h2><button onClick={() => setModal('tools')}>View all <ChevronRight size={15}/></button></div><div className="tool-grid">{tools.map(({ title, label, icon: Icon, color, desc }) => <button className="tool-card" key={title} onClick={() => { setSelectedTool(title); setNotice(`${title} selected. Add a prompt to try the demo.`); }}><div className={`tool-icon ${color}`}><Icon size={19}/></div><div className="tool-copy"><span>{label}</span><h3>{title}</h3><p>{desc}</p></div><ChevronRight className="tool-arrow" size={17}/></button>)}</div></section>
        <section className="creations-section"><div className="section-heading"><h2>Recent creations</h2><button onClick={() => setNotice('Your generated media will appear here after a provider is connected.')}>View all <ChevronRight size={15}/></button></div><div className="creation-grid">{creations.map(item => <article className="creation-card" key={item.title}><div className={`creation-art ${item.className}`}><span className="type-badge">{item.type}</span></div><div className="creation-meta"><div><h3>{item.title}</h3><p>{item.time}</p></div><button aria-label={`More options for ${item.title}`}>•••</button></div></article>)}</div></section>
      </div>
    </main>
    {menuOpen && <div className="overlay" onClick={() => setMenuOpen(false)}/>}
    {notice && <div className="toast" role="status">{notice}<button onClick={() => setNotice('')} aria-label="Dismiss"><X size={15}/></button></div>}
    {modal && <div className="modal-backdrop" onClick={() => setModal('')}><section className="modal" onClick={e => e.stopPropagation()}><button className="modal-close" onClick={() => setModal('')} aria-label="Close"><X size={18}/></button>
      {modal === 'account' && <><p className="eyebrow">ACCOUNT</p><h2>Sign in to the demo</h2><p className="modal-description">This prototype stores a demo profile in this browser only. No password or payment is requested.</p><form onSubmit={signInDemo}><label className="field-label" htmlFor="demo-email">Email</label><input id="demo-email" className="modal-input" type="email" value={emailInput} onChange={e => setEmailInput(e.target.value)} placeholder="you@example.com" required/><button className="modal-primary" type="submit">Continue in demo</button></form><p className="fine-print">The configured admin email receives 1,000,000 demo credits. This is not secure authentication; protect admin access on a server before launch.</p></>}
      {modal === 'plans' && <><p className="eyebrow">DEMO SUBSCRIPTIONS</p><h2>Choose a plan</h2><p className="modal-description">Try plan flows without collecting payment. These credits are local demo values, not a live subscription.</p><div className="plans">{Object.entries(PLAN_CREDITS).map(([name, amount]) => <article className="plan-option" key={name}><div><h3>{name}</h3><p>{amount.toLocaleString()} demo credits</p></div><button onClick={() => choosePlan(name)}>Try plan</button></article>)}</div><p className="fine-print">No checkout, billing, or recurring charge is set up yet.</p></>}
      {modal === 'tools' && <><p className="eyebrow">CREATE</p><h2>Choose a tool</h2><div className="tool-picker">{tools.map(({ title, icon: Icon }) => <button key={title} onClick={() => { setSelectedTool(title); setModal(''); }}><Icon size={17}/>{title}<ChevronRight size={15}/></button>)}</div></>}
    </section></div>}
  </div>;
}

createRoot(document.getElementById('root')).render(<App/>);
