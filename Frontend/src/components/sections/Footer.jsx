import { Globe, Linkedin, Twitter, Github, ArrowUp } from 'lucide-react';
import {Link} from "react-router-dom"
// import logoImg from "../../assets/logo2.png"
// import logoImg from '../../assets/BlinkusLogo.jpeg';
import logoImg from '../../assets/logoBG.png';



export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-white pt-24 pb-12 px-6 border-t border-black/5">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12 mb-20">
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <Link to="/"><img src={logoImg} alt="logoimage" className='h-10'/></Link>
            </div>
            <p className="text-black/60 max-w-sm mb-8 leading-relaxed">
              Advancing global trade through autonomous intelligence and real-time connectivity.
              Built for the modern trader.
            </p>
            <div className="flex gap-4">
              {[Linkedin, Twitter, Github].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-10 h-10 rounded-full border border-black/5 flex items-center justify-center hover:bg-accent hover:text-white hover:border-accent transition-all"
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-bold text-sm uppercase tracking-widest mb-6">Platform</h4>
            <ul className="space-y-4 text-sm font-medium text-black/60">
              <li><a href="#" className="hover:text-accent transition-colors">Trade Agent</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Market Discovery</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Risk Engine</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">API Access</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-sm uppercase tracking-widest mb-6">Company</h4>
            <ul className="space-y-4 text-sm font-medium text-black/60">
              <li><a href="#" className="hover:text-accent transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Intelligence Feed</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Contact</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-sm uppercase tracking-widest mb-6">Resources</h4>
            <ul className="space-y-4 text-sm font-medium text-black/60">
              <li><a href="#" className="hover:text-accent transition-colors">Knowledge Base</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Global Trade Map</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Compliance Guide</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">H5 Codes</a></li>
            </ul>
          </div>
        </div>

        <div className="pt-12 border-t border-black/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-sm text-black/40 font-medium">
            © 2026 BLINKUS GLOBAL TRADE SOLUTIONS. ALL RIGHTS RESERVED.
          </div>
          <div className="flex gap-8 text-xs font-bold text-black/40 uppercase tracking-widest">
            <a href="#" className="hover:text-accent">Terms</a>
            <a href="#" className="hover:text-accent">Privacy</a>
            <a href="#" className="hover:text-accent">Cookies</a>
            <button
              onClick={scrollToTop}
              className="flex items-center gap-2 hover:text-accent transition-colors"
            >
              BACK TO TOP <ArrowUp size={14} />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
