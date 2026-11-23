import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Aperture, Bell, ChevronDown, ChevronRight, Clock3, Crown, Folder, Grid2X2, Image, LayoutGrid, Menu, Search, Settings, Sparkles, Upload, Video, WandSparkles, X, Zap } from 'lucide-react';
import { supabase } from './supabase.js';
import './styles.css';

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

function App() {
  const [active, setActive] = useState('Studio');
  const [menuOpen, setMenuOpen] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [modal, setModal] = useState('');
  const [notice, setNotice] = useState('');
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const [authMode, setAuthMode] = useState('signin');
  const [emailInput, setEmailInput] = useState('');
  const [password, setPassword] = useState('');
  const [selectedTool, setSelectedTool] = useState('AI Image Generator');

  const isAdmin = profile?.is_admin === true;
  const credits = Number(profile?.credits ?? 0);
  const plan = profile?.plan || 'Free';
  const email = user?.email || '';

  const loadProfile = async currentUser => {
    if (!currentUser || !supabase) return;
    setProfileLoading(true);
    const { data, error } = await supabase
      .from('profiles')
      .select('id,email,plan,credits,is_admin')
      .eq('id', currentUser.id)
      .single();
    if (error) {
      setProfile(null);
      setNotice(`Signed in, but profile could not be loaded: ${error.message}`);
    } else {
      setProfile(data);
    }
    setProfileLoading(false);
  };

  useEffect(() => {
    if (!supabase) return undefined;
    let mounted = true;
    const applySession = async session => {
      if (!mounted) return;
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      if (currentUser) await loadProfile(currentUser);
      else setProfile(null);
    };
    supabase.auth.getSession().then(({ data, error }) => {
      if (error) setNotice(error.message);
      return applySession(data?.session);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      void applySession(session);
    });
    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const nav = [['Studio', LayoutGrid], ['My creations', Folder], ['Recent', Clock3]];

  const submitAuth = async event => {
    event.preventDefault();
    if (!supabase) {
      setNotice('Supabase is not configured. Add the VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables, then restart Vite.');
      return;
    }
    setAuthLoading(true);
    const normalizedEmail = emailInput.trim().toLowerCase();
    const result = authMode === 'signup'
      ? await supabase.auth.signUp({ email: normalizedEmail, password })
      : await supabase.auth.signInWithPassword({ email: normalizedEmail, password });
    setAuthLoading(false);
    if (result.error) {
      setNotice(result.error.message);
      return;
    }
    if (authMode === 'signup' && !result.data.session) {
      setNotice('Account created. Check your email for the confirmation link, then sign in.');
      setModal('');
      setPassword('');
      return;
    }
    setNotice(authMode === 'signup' ? 'Account created and signed in.' : 'Signed in successfully.');
    setModal('');
    setPassword('');
  };

  const signOut = async () => {
    if (!supabase) return;
    const { error } = await supabase.auth.signOut();
    if (error) setNotice(error.message);
    else {
      setModal('');
      setNotice('You have signed out.');
    }
  };

  const generateDemo = () => {
    if (!user) {
      setNotice('Sign in to try the studio.');
      setAuthMode('signin');
      setModal('account');
      return;
    }
    if (!prompt.trim()) {
      setNotice('Add a prompt before generating.');
      return;
    }
    setNotice(`Authentication is connected. ${selectedTool} generation still needs a media provider.`);
  };

  return <div className="app-shell">
    <aside className={`sidebar ${menuOpen ? 'open' : ''}`}>
      <div className="brand"><span className="brand-mark"><Aperture size={19}/></span><span>ARTEKHAII</span></div>
      <button className="close-menu" onClick={() => setMenuOpen(false)} aria-label="Close menu"><X/></button>
      <nav><p className="nav-heading">CREATE</p>
        {nav.map(([name, Icon]) => <button key={name} className={`nav-item ${active === name ? 'active' : ''}`} onClick={() => { setActive(name); setMenuOpen(false); }}><Icon size={18}/><span>{name}</span></button>)}
        <p className="nav-heading">WORKSPACE</p>
        <button className="nav-item" onClick={() => setNotice('Brand kits are not connected yet.')}><Grid2X2 size={18}/><span>Brand kits</span></button>
        <button className="nav-item" onClick={() => setNotice('Settings are coming soon.')}><Settings size={18}/><span>Settings</span></button>
      </nav>
      <div className="usage-card"><div className="usage-top"><span>{profileLoading ? 'Loading…' : `${plan} plan`}</span><Crown size={16}/></div><div className="usage-label"><span>Credits</span><strong>{credits.toLocaleString()}</strong></div><div className="progress"><span style={{ width: isAdmin ? '100%' : '0%' }}/></div><button className="upgrade" onClick={() => setNotice('Plan purchases are not connected yet.')}>{isAdmin ? 'Admin account' : 'View plans'}</button></div>
    </aside>
    <main>
      <header><button className="mobile-menu" onClick={() => setMenuOpen(true)} aria-label="Open menu"><Menu/></button><label className="search"><Search size={17}/><input placeholder="Search tools and creations"/></label><div className="header-actions"><button className="icon-button" aria-label="Notifications" onClick={() => setNotice('You are all caught up.')}><Bell size={18}/></button><button className="avatar" onClick={() => { setEmailInput(email); setAuthMode('signin'); setModal('account'); }} title={email || 'Sign in'}>{email ? email[0].toUpperCase() : 'K'}</button></div></header>
      <div className="content">
        <section className="welcome"><div><p className="eyebrow">CREATIVE WORKSPACE</p><h1>What will you create?</h1></div><button className="new-project" onClick={() => setNotice('Import is available when media storage is connected.')}><Upload size={16}/> Import</button></section>
        <section className="prompt-box"><textarea value={prompt} onChange={e => setPrompt(e.target.value)} placeholder="Describe anything you can imagine..."/><div className="prompt-actions"><button className="model-button" onClick={() => setModal('tools')}><Sparkles size={15}/>{selectedTool.replace('AI ', '')}<ChevronDown size={14}/></button><button className="generate" onClick={generateDemo}>Generate <ChevronRight size={17}/></button></div></section>
        <section><div className="section-heading"><h2>AI tools</h2><button onClick={() => setModal('tools')}>View all <ChevronRight size={15}/></button></div><div className="tool-grid">{tools.map(({ title, label, icon: Icon, color, desc }) => <button className="tool-card" key={title} onClick={() => { setSelectedTool(title); setNotice(`${title} selected. Add a prompt to try it.`); }}><div className={`tool-icon ${color}`}><Icon size={19}/></div><div className="tool-copy"><span>{label}</span><h3>{title}</h3><p>{desc}</p></div><ChevronRight className="tool-arrow" size={17}/></button>)}</div></section>
        <section className="creations-section"><div className="section-heading"><h2>Recent creations</h2><button onClick={() => setNotice('Your generated media will appear here after a provider is connected.')}>View all <ChevronRight size={15}/></button></div><div className="creation-grid">{creations.map(item => <article className="creation-card" key={item.title}><div className={`creation-art ${item.className}`}><span className="type-badge">{item.type}</span></div><div className="creation-meta"><div><h3>{item.title}</h3><p>{item.time}</p></div><button aria-label={`More options for ${item.title}`}>•••</button></div></article>)}</div></section>
      </div>
    </main>
    {menuOpen && <div className="overlay" onClick={() => setMenuOpen(false)}/>}
    {notice && <div className="toast" role="status">{notice}<button onClick={() => setNotice('')} aria-label="Dismiss"><X size={15}/></button></div>}
    {modal && <div className="modal-backdrop" onClick={() => setModal('')}><section className="modal" onClick={e => e.stopPropagation()}><button className="modal-close" onClick={() => setModal('')} aria-label="Close"><X size={18}/></button>
      {modal === 'account' && (user ? <><p className="eyebrow">ACCOUNT</p><h2>Your account</h2><p className="modal-description">Signed in as {email}</p><p className="fine-print">{profileLoading ? 'Loading your profile…' : profile ? `${plan} plan · ${credits.toLocaleString()} credits` : 'Profile details are unavailable.'}</p><button className="modal-primary" onClick={signOut}>Sign out</button></> : <><p className="eyebrow">ACCOUNT</p><h2>{authMode === 'signup' ? 'Create your account' : 'Sign in'}</h2><p className="modal-description">Use your email and password to access your studio account.</p><form onSubmit={submitAuth}><label className="field-label" htmlFor="account-email">Email</label><input id="account-email" className="modal-input" type="email" autoComplete="email" value={emailInput} onChange={e => setEmailInput(e.target.value)} placeholder="you@example.com" required/><label className="field-label" htmlFor="account-password" style={{ marginTop: 13 }}>Password</label><input id="account-password" className="modal-input" type="password" autoComplete={authMode === 'signup' ? 'new-password' : 'current-password'} value={password} onChange={e => setPassword(e.target.value)} minLength={6} required/><button className="modal-primary" type="submit" disabled={authLoading}>{authLoading ? 'Please wait…' : authMode === 'signup' ? 'Create account' : 'Sign in'}</button></form><p className="fine-print">{authMode === 'signup' ? 'Already have an account?' : 'New to Artekhaii?'} <button type="button" onClick={() => setAuthMode(authMode === 'signup' ? 'signin' : 'signup')} style={{ border: 0, background: 'transparent', color: '#68baff', padding: 0, fontSize: 'inherit' }}>{authMode === 'signup' ? 'Sign in' : 'Create an account'}</button></p></>)}
      {modal === 'tools' && <><p className="eyebrow">CREATE</p><h2>Choose a tool</h2><div className="tool-picker">{tools.map(({ title, icon: Icon }) => <button key={title} onClick={() => { setSelectedTool(title); setModal(''); }}><Icon size={17}/>{title}<ChevronRight size={15}/></button>)}</div></>}
    </section></div>}
  </div>;
}

createRoot(document.getElementById('root')).render(<App/>);
