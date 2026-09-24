import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || '';
const ITEMS_PER_PAGE = 15;

function TermsModal({ onClose }) {
  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-fadeIn">
      <div className="bg-[#0b0f19] border border-white/10 rounded-[32px] max-w-2xl w-full p-8 md:p-10 shadow-[0_0_80px_rgba(0,0,0,0.9)] relative overflow-hidden flex flex-col max-h-[85vh]">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-red-600/15 blur-3xl pointer-events-none" />

        <div className="flex items-center justify-between border-b border-white/5 pb-5 mb-6 relative z-10">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-red-600 to-rose-700 flex items-center justify-center text-white font-black text-xs shadow-lg shadow-red-600/40 border border-red-400/35">
              📜
            </div>
            <h2 className="text-white text-lg md:text-xl font-black tracking-tight">
              Terms and Conditions
            </h2>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white p-2 rounded-xl bg-[#121624] hover:bg-[#1a2033] transition"
          >
            ✕
          </button>
        </div>

        <div className="space-y-6 text-xs md:text-sm text-gray-300 leading-relaxed font-medium overflow-y-auto pr-2 relative z-10 custom-scrollbar">
          <p className="text-gray-400 text-[11px]">
            <strong>Last Updated:</strong> August 30, 2026
          </p>

          <div className="space-y-2">
            <h3 className="text-white font-bold text-sm">1. Age Verification and Access Restrictions</h3>
            <p>
              CornHUB is an <strong>ADULTS ONLY</strong> website containing explicit material. You must be at least 18 years of age, or the legal age of majority in your jurisdiction (whichever is greater), to access or view any material on this platform. By entering and using the site, you represent and warrant that you are of legal age and that viewing adult content is legal in your local jurisdiction.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="text-white font-bold text-sm">2. Intellectual Property and Content Policy</h3>
            <p>
              All media, videos, images, graphics, logos, and software provided on CornHUB are protected by applicable intellectual property laws. You agree not to misuse, scrape, unlawfully redistribute, or attempt to compromise the security of the platform or its hosted media assets.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="text-white font-bold text-sm">3. User Accounts and Local Storage</h3>
            <p>
              Features such as "Saved Media" and browsing "History" may utilize your browser’s local storage. You are responsible for maintaining the privacy and security of the device and browser you use to access CornHUB.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="text-white font-bold text-sm">4. Third-Party Links and Advertisements</h3>
            <p>
              The Website may feature third-party advertisements or external links. We do not endorse, control, or assume responsibility for the content, privacy policies, or practices of any third-party websites or services linked from our platform.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="text-white font-bold text-sm">5. Disclaimer of Warranties</h3>
            <p>
              The website and all content are provided on an <strong>"as is"</strong> and <strong>"as available"</strong> basis without warranties of any kind. We disclaim all warranties, including timeliness, security, uninterrupted availability, or fitness for a particular purpose.
            </p>
          </div>
        </div>

        <div className="pt-6 border-t border-white/5 mt-6 flex justify-end relative z-10">
          <button
            onClick={onClose}
            className="bg-red-600 hover:bg-red-500 text-white font-black px-6 py-3 rounded-2xl text-xs uppercase tracking-wider shadow-lg shadow-red-600/30 transition"
          >
            I Understand & Close
          </button>
        </div>
      </div>
    </div>
  );
}

function AgeVerificationModal({ onVerify }) {
  const [showTermsModal, setShowTermsModal] = useState(false);

  return (
    <>
      {showTermsModal && <TermsModal onClose={() => setShowTermsModal(false)} />}

      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-fadeIn">
        <div className="bg-[#0b0f19] border border-white/10 rounded-[32px] max-w-lg w-full p-8 md:p-10 shadow-[0_0_80px_rgba(0,0,0,0.9)] relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-red-600/15 blur-3xl pointer-events-none" />

          <div className="flex items-center space-x-4 mb-6">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-red-600 to-rose-700 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-red-600/40 border border-red-400/30 flex-shrink-0">
              18+
            </div>
            <h2 className="text-white text-xl md:text-2xl font-black tracking-tight leading-snug">
              CornHUB is an ADULTS ONLY website!
            </h2>
          </div>

          <div className="space-y-4 text-xs md:text-sm text-gray-300 leading-relaxed font-medium mb-8">
            <p>
              You are about to enter a website that contains explicit material. This website should only be accessed if you are at least 18 years old or of legal age to view such material in your local jurisdiction, whichever is greater. Furthermore, you represent and warrant that you will not allow any minor access to this site or services.
            </p>
            <p className="text-gray-400 text-[11px]">
              PARENTS, PLEASE BE ADVISED: If you are a parent, it is your responsibility to keep any age-restricted content from being displayed to your children or wards. Protect your children from adult content and block access to this site by using parental controls.
            </p>
          </div>

          <div className="space-y-4">
            <button
              onClick={onVerify}
              className="w-full bg-gradient-to-r from-emerald-600 via-green-600 to-emerald-700 hover:from-emerald-500 hover:to-green-500 text-white font-black py-4 rounded-2xl text-sm uppercase tracking-wider shadow-lg shadow-emerald-600/30 hover:shadow-emerald-600/50 transition-all duration-300 transform hover:scale-[1.02] border border-emerald-400/30 text-center relative overflow-hidden group"
            >
              <span className="absolute inset-0 w-full h-full bg-white/15 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              <span className="relative z-10">I am 18+ ENTER</span>
            </button>
            
            <div className="text-center text-[11px] text-gray-500">
              When accessing this site you agree to <span onClick={() => setShowTermsModal(true)} className="text-gray-400 underline cursor-pointer hover:text-white transition">our terms of use</span>.
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function RegisterModal({ onClose }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!username || !email || !password) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
      });
      if (res.ok) {
        alert('Registration successful!');
        onClose();
      } else {
        const data = await res.json().catch(() => ({}));
        alert(data.detail || data.message || 'Registration failed.');
      }
    } catch (err) {
      console.error(err);
      alert('Connection error during registration.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[130] flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-fadeIn">
      <div className="bg-[#0b0f19] border border-white/10 rounded-[32px] max-w-md w-full p-8 md:p-10 shadow-[0_0_80px_rgba(0,0,0,0.9)] relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-red-600/15 blur-3xl pointer-events-none" />

        <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-6 relative z-10">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-red-600 to-rose-700 flex items-center justify-center text-white font-black text-xs shadow-lg shadow-red-600/40 border border-red-400/35">
              👤
            </div>
            <h2 className="text-white text-lg md:text-xl font-black tracking-tight">
              Create Account
            </h2>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white p-2 rounded-xl bg-[#121624] hover:bg-[#1a2033] transition"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleRegister} className="space-y-4 relative z-10">
          <div>
            <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">Username</label>
            <input 
              type="text" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
              required
              placeholder="Enter username" 
              className="w-full bg-[#05070f] border border-white/10 focus:border-red-600 p-3.5 rounded-xl text-xs text-white focus:outline-none transition" 
            />
          </div>
          <div>
            <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">Email</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required
              placeholder="Enter email" 
              className="w-full bg-[#05070f] border border-white/10 focus:border-red-600 p-3.5 rounded-xl text-xs text-white focus:outline-none transition" 
            />
          </div>
          <div>
            <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">Password</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required
              placeholder="Enter password" 
              className="w-full bg-[#05070f] border border-white/10 focus:border-red-600 p-3.5 rounded-xl text-xs text-white focus:outline-none transition" 
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-gradient-to-r from-red-600 via-rose-600 to-red-700 hover:from-red-500 hover:to-rose-500 text-white font-black py-3.5 rounded-2xl text-xs uppercase tracking-wider shadow-lg shadow-red-600/30 transition mt-2 disabled:opacity-50"
          >
            {loading ? 'Registering...' : 'Register Now'}
          </button>
        </form>
      </div>
    </div>
  );
}

function LogoRevealOverlay({ onComplete }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 1500); 
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-[120] bg-[#03050b] flex flex-col items-center justify-center animate-fadeOut">
      <div className="absolute inset-0 bg-gradient-to-tr from-red-950/30 via-transparent to-black pointer-events-none" />
      <div className="relative flex items-center space-x-4 animate-cinematicReveal">
        <div className="relative">
          <div className="absolute inset-0 bg-red-600/50 blur-3xl rounded-full animate-pulse" />
          <img src="/logo.png" alt="Logo" className="w-20 h-20 md:w-28 md:h-28 object-contain relative z-10 drop-shadow-[0_0_30px_rgba(220,38,38,0.8)]" />
        </div>
        <div className="flex items-center font-black text-4xl md:text-6xl tracking-tighter">
          <span className="text-white drop-shadow-[0_2px_20px_rgba(255,255,255,0.4)]">Corn</span>
          <span className="text-red-600 ml-2 drop-shadow-[0_0_30px_rgba(220,38,38,1)]">HUB</span>
        </div>
      </div>
      <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mt-6 animate-pulse">Entering Secure Vault...</p>
    </div>
  );
}

function Navbar({ searchQuery, setSearchQuery }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpenMobile, setSearchOpenMobile] = useState(false);
  const [registerModalOpen, setRegisterModalOpen] = useState(false);

  return (
    <>
      {registerModalOpen && <RegisterModal onClose={() => setRegisterModalOpen(false)} />}

      <nav className="bg-gradient-to-b from-[#0a0e1a]/98 via-[#070911]/92 to-[#05070f]/98 backdrop-blur-3xl border-b border-white/10 relative sticky top-0 z-50 px-6 md:px-12 py-5 flex justify-between items-center shadow-[0_10px_30px_rgba(0,0,0,0.8)]">
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-red-600 to-transparent opacity-75 animate-pulse" />
        <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-red-600/40 to-transparent pointer-events-none" />

        <div className="flex items-center space-x-6 md:space-x-10 animate-slideDownStagger1">
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-gray-400 hover:text-white p-2.5 rounded-2xl hover:bg-[#121624] transition-all duration-300 group focus:outline-none border border-transparent hover:border-white/10 hover:shadow-lg"
            aria-label="Toggle Menu"
          >
            <div className="w-6 h-5 flex flex-col justify-between items-center relative">
              <span className={`w-full h-0.5 bg-current rounded-full transition-all duration-300 ${mobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`} />
              <span className={`w-full h-0.5 bg-current rounded-full transition-all duration-300 ${mobileMenuOpen ? 'opacity-0 scale-x-0' : ''}`} />
              <span className={`w-full h-0.5 bg-current rounded-full transition-all duration-300 ${mobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
            </div>
          </button>

          <Link to="/" className="flex items-center space-x-3.5 group">
            <div className="relative">
              <div className="absolute inset-0 bg-red-600/30 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition duration-700 animate-pulse" />
              <img 
                src="/logo.png" 
                alt="Logo" 
                className="w-11 h-11 object-contain relative z-10 group-hover:scale-110 group-hover:rotate-6 transition duration-500" 
              />
            </div>
            <div className="flex items-center font-black text-2xl md:text-3xl tracking-tighter animate-logoReveal">
              <span className="text-white drop-shadow-[0_2px_15px_rgba(255,255,255,0.3)]">Corn</span>
              <span className="text-red-600 ml-1.5 drop-shadow-[0_0_20px_rgba(220,38,38,0.9)]">HUB</span>
            </div>
          </Link>
        </div>

        <div className="flex items-center space-x-4 md:space-x-6 animate-slideDownStagger2">
          <div className="relative hidden sm:block group">
            <input 
              type="text" 
              placeholder="Search vault..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-[#05070f]/90 border border-white/10 hover:border-white/25 focus:border-red-600 text-xs rounded-2xl px-5 py-3 pl-11 w-56 lg:w-80 text-white focus:outline-none transition-all duration-500 shadow-[inset_0_2px_8px_rgba(0,0,0,0.8)] font-medium placeholder-gray-500 group-hover:shadow-[0_0_20px_rgba(220,38,38,0.15)]"
            />
            <svg className="w-4 h-4 text-gray-400 absolute left-4 top-3.5 transition-colors group-hover:text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          <button 
            onClick={() => setSearchOpenMobile(!searchOpenMobile)}
            className="sm:hidden text-gray-400 hover:text-white p-2.5 rounded-2xl bg-[#121624]/60 border border-white/5 transition"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>

          <button 
            onClick={() => setRegisterModalOpen(true)} 
            className="bg-gradient-to-r from-red-600 via-rose-600 to-red-700 hover:from-red-500 hover:to-rose-500 text-white px-6 py-3 rounded-full text-xs font-black uppercase tracking-widest transition-all duration-500 shadow-[0_4px_25px_rgba(220,38,38,0.4)] hover:shadow-[0_6px_30px_rgba(220,38,38,0.7)] hover:scale-110 active:scale-95 border border-red-400/40 relative overflow-hidden group cursor-pointer"
          >
            <span className="absolute inset-0 w-full h-full bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            <span className="relative z-10">Register</span>
          </button>
        </div>
      </nav>

      {searchOpenMobile && (
        <div className="sm:hidden bg-[#070911] border-b border-white/10 px-6 py-3.5 animate-fadeIn z-40 relative flex items-center">
          <div className="relative w-full">
            <input 
              type="text" 
              placeholder="Search vault..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
              className="bg-black/60 border border-red-600/50 text-xs rounded-2xl px-4 py-3 pl-10 w-full text-white focus:outline-none shadow-inner font-medium"
            />
            <svg className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <button 
            onClick={() => setSearchOpenMobile(false)} 
            className="ml-3 text-gray-400 hover:text-white text-xs font-bold px-3 py-2 bg-[#121624] rounded-xl"
          >
            ✕
          </button>
        </div>
      )}

      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div 
            className="fixed inset-0 bg-black/85 backdrop-blur-md transition-opacity animate-fadeIn" 
            onClick={() => setMobileMenuOpen(false)}
          />
          
          <div className="relative w-80 bg-[#070911] border-r border-white/10 shadow-[30px_0_60px_rgba(0,0,0,0.95)] flex flex-col p-6 space-y-6 z-10 animate-slideRight overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-red-600/10 blur-3xl pointer-events-none" />

            <div className="flex items-center justify-between border-b border-white/10 pb-5 relative z-10">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-red-600 to-rose-700 flex items-center justify-center text-white font-black text-sm shadow-lg shadow-red-600/40 border border-red-400/30">
                  ⚡
                </div>
                <div>
                  <h3 className="text-white font-black text-base tracking-tight leading-none">Menu</h3>
                  <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Vault Directory</span>
                </div>
              </div>
              <button 
                onClick={() => setMobileMenuOpen(false)}
                className="text-gray-400 hover:text-white p-2.5 rounded-2xl bg-[#121624] hover:bg-[#1a2033] border border-white/5 transition-all duration-300 hover:rotate-90"
              >
                ✕
              </button>
            </div>

            <div className="flex flex-col space-y-3 relative z-10 custom-scrollbar overflow-y-auto pr-1">
              {[
                { to: "/", icon: "🏠", label: "Home" },
                { to: "/videos", icon: "🎬", label: "Video" },
                { to: "/images", icon: "🖼️", label: "Image" },
                { to: "/categories", icon: "📁", label: "Categories" },
                { to: "/saved", icon: "🔖", label: "Saved" },
              ].map((item, idx) => (
                <Link 
                  key={item.to}
                  to={item.to} 
                  onClick={() => setMobileMenuOpen(false)}
                  style={{ animationDelay: `${idx * 50}ms` }}
                  className="group relative flex items-center justify-between p-3.5 rounded-2xl bg-[#0d111c] hover:bg-gradient-to-r hover:from-red-600/25 hover:to-[#121624] border border-white/5 hover:border-red-600/50 transition-all duration-300 hover:translate-x-1.5 shadow-[0_4px_20px_rgba(0,0,0,0.4)] animate-slideItem"
                >
                  <div className="flex items-center space-x-3.5 relative z-10">
                    <div className="w-10 h-10 rounded-xl bg-[#121624] group-hover:bg-red-600 flex items-center justify-center text-lg shadow-inner group-hover:scale-110 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-red-600/50">
                      {item.icon}
                    </div>
                    <div>
                      <span className="text-white group-hover:text-red-400 font-bold tracking-wide text-xs transition-colors duration-300 block">
                        {item.label}
                      </span>
                    </div>
                  </div>
                  <div className="w-7 h-7 rounded-xl bg-[#121624] group-hover:bg-red-600 flex items-center justify-center text-gray-400 group-hover:text-white transition-all duration-300 transform group-hover:translate-x-0.5">
                    &rarr;
                  </div>
                </Link>
              ))}
            </div>

            <div className="pt-4 mt-auto border-t border-white/5 text-center text-[10px] text-gray-500 tracking-wider uppercase font-semibold relative z-10">
              CornHUB Secure Vault &bull; 2026
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function HeroAd({ liveAd }) {
  const [mediaError, setMediaError] = useState(false);

  if (!liveAd || !liveAd.active) return null;

  return (
    <div className="max-w-[1500px] mx-auto px-6 pt-8 animate-fadeIn">
      <a 
        href={liveAd.link} 
        target="_blank" 
        rel="noopener noreferrer" 
        className="relative block w-full bg-black border border-white/10 rounded-[32px] overflow-hidden group h-64 md:h-80 shadow-[0_0_50px_rgba(0,0,0,0.8)] transition duration-500 hover:border-red-600/50"
      >
        {liveAd.media_url && !mediaError && (
          <div className="absolute inset-0 z-0 bg-[#000]">
            {liveAd.media_type === 'video' ? (
              <video 
                src={liveAd.media_url} 
                autoPlay 
                muted 
                loop 
                playsInline 
                onError={() => setMediaError(true)}
                className="w-full h-full object-cover opacity-60 group-hover:opacity-85 transition duration-700 group-hover:scale-105" 
              />
            ) : (
              <img 
                src={liveAd.media_url} 
                alt="Hero Promo" 
                onError={() => setMediaError(true)}
                className="w-full h-full object-cover opacity-60 group-hover:opacity-85 transition duration-700 group-hover:scale-105" 
              />
            )}
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-[#03050b] via-[#03050b]/80 to-transparent z-10 flex items-center justify-between px-8 md:px-14">
          <div className="max-w-xl space-y-3">
            <span className="bg-red-600 text-white text-[10px] font-black px-3.5 py-1 rounded-full uppercase tracking-widest shadow-lg shadow-red-600/40 animate-pulse border border-red-400/30">
              FEATURED PROMO
            </span>
            <h2 className="text-white text-xl md:text-3xl font-black tracking-tight drop-shadow-2xl leading-tight">
              {liveAd.text || "Explore our exclusive curated vault media today!"}
            </h2>
          </div>
          <div className="hidden sm:flex items-center space-x-2 bg-red-600 hover:bg-red-500 text-white font-black text-xs px-7 py-3.5 rounded-2xl shadow-xl transition transform group-hover:scale-105">
            <span>Explore Now</span>
            <span>&rarr;</span>
          </div>
        </div>
      </a>
    </div>
  );
}

function VideoCard({ video }) {
  const [duration, setDuration] = useState('0:00');
  const [posterUrl, setPosterUrl] = useState(null);

  const checkString = String(video?.id || video?.title || '').toLowerCase();
  const isImage = checkString.endsWith('.jpg') || checkString.endsWith('.jpeg') || checkString.endsWith('.png') || checkString.endsWith('.webp') || checkString.endsWith('.gif');

  const handleLoadedMetadata = (e) => {
    if (isImage) return;
    const videoEl = e.target;
    const secs = videoEl.duration;
    if (!isNaN(secs)) {
      const mins = Math.floor(secs / 60);
      const remainingSecs = Math.floor(secs % 60);
      setDuration(`${mins}:${remainingSecs < 10 ? '0' : ''}${remainingSecs}`);
      videoEl.currentTime = Math.min(2, secs / 2);
    }
  };

  const handleSeeked = (e) => {
    if (isImage) return;
    const videoEl = e.target;
    try {
      const canvas = document.createElement('canvas');
      canvas.width = videoEl.videoWidth || 640;
      canvas.height = videoEl.videoHeight || 360;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(videoEl, 0, 0, canvas.width, canvas.height);
      setPosterUrl(canvas.toDataURL('image/jpeg'));
    } catch (err) {
      console.error("Poster generation error:", err);
    }
  };

  const toggleSave = (e) => {
    e.preventDefault();
    const saved = JSON.parse(localStorage.getItem('saved_media') || '[]');
    const exists = saved.some((s) => s.id === video.id);
    let updated;
    if (exists) {
      updated = saved.filter((s) => s.id !== video.id);
    } else {
      updated = [...saved, video];
    }
    localStorage.setItem('saved_media', JSON.stringify(updated));
    alert(exists ? 'Removed from saved' : 'Added to saved!');
  };

  return (
    <Link 
      to={`/watch/${encodeURIComponent(video.id)}`} 
      className="group bg-[#0d111c] rounded-3xl overflow-hidden border border-white/5 hover:border-red-600/50 hover:shadow-2xl hover:shadow-red-600/15 transition-all duration-500 hover:-translate-y-1.5 flex flex-col animate-fadeIn"
    >
      <div className="aspect-video bg-[#05070f] relative overflow-hidden flex items-center justify-center">
        {isImage ? (
          <img 
            src={`${API_URL}/api/stream/${encodeURIComponent(video.id)}`} 
            alt={video.title} 
            className="w-full h-full object-cover group-hover:scale-105 transition duration-700" 
          />
        ) : (
          <>
            <video 
              src={`${API_URL}/api/stream/${encodeURIComponent(video.id)}`} 
              preload="metadata" 
              crossOrigin="anonymous"
              onLoadedMetadata={handleLoadedMetadata}
              onSeeked={handleSeeked}
              className="hidden"
            />

            {posterUrl ? (
              <img src={posterUrl} alt={video.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-700" />
            ) : (
              <div className="w-full h-full bg-[#121624] animate-pulse flex flex-col justify-end p-4">
                <div className="h-3 bg-gray-800 rounded w-3/4 mb-2"></div>
                <div className="h-2 bg-gray-800 rounded w-1/2"></div>
              </div>
            )}

            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent opacity-40 group-hover:opacity-20 transition"></div>
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-300 bg-black/40 backdrop-blur-[2px]">
              <div className="w-12 h-12 rounded-full bg-red-600 text-white flex items-center justify-center shadow-2xl transform scale-75 group-hover:scale-100 transition duration-300">
                <svg className="w-5 h-5 translate-x-0.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              </div>
            </div>
            
            <div className="absolute bottom-2.5 left-2.5 bg-black/80 backdrop-blur-md text-[10px] font-bold px-2 py-0.5 rounded-lg text-gray-300 border border-white/10 shadow">
              {duration}
            </div>
          </>
        )}
        
        <div className="absolute bottom-2.5 right-2.5 bg-red-600 text-[10px] font-black px-2 py-0.5 rounded-lg text-white shadow">
          {isImage ? 'IMAGE' : 'HD'}
        </div>
      </div>

      <div className="p-4.5 flex flex-col flex-grow bg-[#0d111c]">
        <h3 className="font-bold text-gray-200 group-hover:text-red-400 transition text-xs line-clamp-2 leading-relaxed">
          {video.title}
        </h3>
        <div className="flex items-center justify-between text-[11px] text-gray-500 mt-3.5 pt-3 border-t border-white/5">
          <span className="text-red-500 font-bold">{isImage ? 'Gallery Item' : '100% HD'}</span>
          <button onClick={toggleSave} className="hover:text-red-400 transition font-bold">
            ♡ Save
          </button>
        </div>
      </div>
    </Link>
  );
}

function SectionHeader({ title, count }) {
  return (
    <div className="flex justify-between items-center mb-6 pt-4 animate-fadeIn">
      <h2 className="text-lg md:text-xl font-black tracking-tight text-white flex items-center space-x-2">
        <span>{title}</span>
      </h2>
      <span className="text-xs text-gray-400 font-bold bg-[#121624] px-3.5 py-1 rounded-full border border-white/5 shadow-inner">{count} items available</span>
    </div>
  );
}

export default function Home() {
  const [videos, setVideos] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [liveAd, setLiveAd] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isVerified, setIsVerified] = useState(false);
  const [showLogoReveal, setShowLogoReveal] = useState(false);

  useEffect(() => {
    const verified = sessionStorage.getItem('cornhub_age_verified');
    if (verified === 'true') {
      setIsVerified(true);
    }

    fetch(`${API_URL}/api/videos`)
      .then(res => res.json())
      .then(data => setVideos(data))
      .catch(err => console.error(err));

    fetch(`${API_URL}/api/admin/ad`)
      .then(res => res.json())
      .then(data => {
        if (data.active) setLiveAd(data);
      })
      .catch(err => console.error(err));
  }, []);

  const handleVerifyAge = () => {
    setShowLogoReveal(true);
  };

  const handleRevealComplete = () => {
    sessionStorage.setItem('cornhub_age_verified', 'true');
    setShowLogoReveal(false);
    setIsVerified(true);
  };

  const filteredVideos = videos.filter(video => 
    video.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredVideos.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentVideos = filteredVideos.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <div className="min-h-screen bg-[#03050b] text-gray-100 font-sans selection:bg-red-600 selection:text-white overflow-x-hidden">
      {!isVerified && !showLogoReveal && <AgeVerificationModal onVerify={handleVerifyAge} />}
      {showLogoReveal && <LogoRevealOverlay onComplete={handleRevealComplete} />}

      <Navbar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <HeroAd liveAd={liveAd} />

      <main className="max-w-[1500px] mx-auto px-6 py-8 pb-20 space-y-16">
        <section>
          <SectionHeader title="🔥 Recommended Vault Media" count={filteredVideos.length} />
          {filteredVideos.length === 0 ? (
            <div className="text-center py-16 bg-[#0d111c] rounded-3xl border border-white/5">
              <p className="text-gray-400 text-xs font-bold">No vault media found matching your filter.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {currentVideos.map(video => (
                  <VideoCard key={video.id} video={video} />
                ))}
              </div>

              {totalPages > 1 && (
                <div className="flex justify-center items-center space-x-3 pt-12">
                  <button
                    onClick={() => { setCurrentPage(p => Math.max(p - 1, 1)); window.scrollTo({ top: 400, behavior: 'smooth' }); }}
                    disabled={currentPage === 1}
                    className="px-5 py-2.5 rounded-2xl bg-[#0d111c] border border-white/10 text-xs font-bold disabled:opacity-30 hover:bg-[#161c2d] transition"
                  >
                    &larr; Previous
                  </button>

                  <div className="flex items-center space-x-1.5">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                      <button
                        key={page}
                        onClick={() => { setCurrentPage(page); window.scrollTo({ top: 400, behavior: 'smooth' }); }}
                        className={`w-10 h-10 rounded-2xl text-xs font-black transition ${
                          currentPage === page 
                            ? 'bg-red-600 text-white shadow-lg shadow-red-600/30' 
                            : 'bg-[#0d111c] border border-white/5 text-gray-400 hover:bg-[#161c2d] hover:text-white'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => { setCurrentPage(p => Math.min(p + 1, totalPages)); window.scrollTo({ top: 400, behavior: 'smooth' }); }}
                    disabled={currentPage === totalPages}
                    className="px-5 py-2.5 rounded-2xl bg-[#0d111c] border border-white/10 text-xs font-bold disabled:opacity-30 hover:bg-[#161c2d] transition"
                  >
                    Next &rarr;
                  </button>
                </div>
              )}
            </>
          )}
        </section>
      </main>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        @keyframes fadeOut {
          from { opacity: 1; }
          to { opacity: 0; }
        }
        .animate-fadeOut {
          animation: fadeOut 0.4s ease-in-out 1.1s forwards;
        }

        @keyframes cinematicReveal {
          0% {
            opacity: 0;
            transform: scale(0.7) translateY(20px);
            filter: blur(10px);
          }
          50% {
            opacity: 1;
            transform: scale(1.05) translateY(0);
            filter: blur(0px);
          }
          100% {
            opacity: 1;
            transform: scale(1) translateY(0);
            filter: blur(0px);
          }
        }
        .animate-cinematicReveal {
          animation: cinematicReveal 1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        @keyframes logoReveal {
          0% { opacity: 0; transform: scale(0.85); }
          60% { opacity: 1; transform: scale(1.05); }
          100% { opacity: 1; transform: scale(1); }
        }

        @keyframes slideDownStagger1 {
          from { opacity: 0; transform: translateY(-15px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes slideDownStagger2 {
          from { opacity: 0; transform: translateY(-15px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes slideRight {
          from { opacity: 0; transform: translateX(-30px); }
          to { opacity: 1; transform: translateX(0); }
        }

        @keyframes slideItem {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }

        .animate-logoReveal { animation: logoReveal 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .animate-slideDownStagger1 { animation: slideDownStagger1 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .animate-slideDownStagger2 { animation: slideDownStagger2 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .animate-slideRight { animation: slideRight 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .animate-slideItem { animation: slideItem 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; opacity: 0; }

        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(0, 0, 0, 0.2); border-radius: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(220, 38, 38, 0.4); border-radius: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(220, 38, 38, 0.7); }
      `}</style>
    </div>
  );
}