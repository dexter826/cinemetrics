import React from 'react';
import { Facebook, Instagram, Github, Mail } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-surface border-t border-black/10 dark:border-white/10 py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-center md:text-left">
            <h3 className="text-lg font-bold text-primary">Cinemetrics</h3>
            <p className="text-sm text-text-muted mt-1">
              Theo dõi hành trình điện ảnh của bạn.
            </p>
          </div>
          
          <div className="flex items-center gap-6">
            <a 
              href="https://www.facebook.com/ctrlkd1" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-text-muted hover:text-primary transition-colors"
            >
              <Facebook size={24} />
            </a>
            <a 
              href="https://www.instagram.com/trcongminh_04/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-text-muted hover:text-primary transition-colors"
            >
              <Instagram size={24} />
            </a>
            <a
              href="https://github.com/dexter826"
              target="_blank"
              rel="noopener noreferrer"
              className="text-text-muted hover:text-primary transition-colors"
            >
              <Github size={24} />
            </a>
            <a
              href="mailto:contact@cinemetrics.com"
              className="text-text-muted hover:text-primary transition-colors"
            >
              <Mail size={24} />
            </a>
          </div>
          
          <div className="text-sm text-text-muted">
            © {new Date().getFullYear()} Cinemetrics. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
