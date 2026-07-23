import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white mt-24">
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 bg-mlh-blue rounded flex items-center justify-center">
                <span className="font-heading font-bold text-white text-xl">F</span>
              </div>
              <span className="font-heading font-bold text-2xl tracking-tight text-mlh-blue">
                FLUX
              </span>
            </Link>
            <p className="text-slate-600 max-w-sm mb-6 font-medium">
              India's emerging student innovation movement. Built for students, by students.
            </p>
            <div className="flex gap-4">
              {/* LinkedIn */}
              <a href="#" className="text-slate-400 hover:text-mlh-blue transition-colors">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
              </a>
              {/* Instagram */}
              <a href="#" className="text-slate-400 hover:text-mlh-red transition-colors">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
              </a>
              {/* Twitter */}
              <a href="#" className="text-slate-400 hover:text-mlh-light-blue transition-colors">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4.01c-1 .49-1.98.68-3 .99-1.12-1.27-2.74-1.25-4.08-.14-1.34 1.11-1.89 2.89-1.4 4.59-4.28-.21-8.11-2.22-10.66-5.59-1.29 2.22-.67 5.16 1.48 6.64-.84-.03-1.63-.26-2.31-.66-.02 1.62 1.13 3.06 2.76 3.41-.53.15-1.09.18-1.64.06.45 1.4 1.76 2.37 3.24 2.4-1.74 1.35-3.9 2.05-6.14 1.83 2.19 1.41 4.79 2.22 7.51 2.22 8.92 0 13.91-7.24 13.91-13.62l-.01-.61C21.16 6.08 21.66 5.11 22 4.01z"></path></svg>
              </a>
              {/* GitHub */}
              <a href="#" className="text-slate-400 hover:text-slate-900 transition-colors">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="font-heading font-bold text-lg mb-6 text-slate-800">Quick Links</h3>
            <ul className="flex flex-col gap-3 font-bold">
              <li><Link href="/about" className="text-slate-500 hover:text-mlh-blue transition-colors">About Us</Link></li>
              <li><Link href="/events" className="text-slate-500 hover:text-mlh-blue transition-colors">Events & Schedule</Link></li>
              <li><Link href="/sponsors" className="text-slate-500 hover:text-mlh-blue transition-colors">Sponsors</Link></li>
              <li><Link href="/community" className="text-slate-500 hover:text-mlh-blue transition-colors">Community</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-heading font-bold text-lg mb-6 text-slate-800">Legal</h3>
            <ul className="flex flex-col gap-3 font-bold">
              <li><Link href="#" className="text-slate-500 hover:text-mlh-blue transition-colors">Code of Conduct</Link></li>
              <li><Link href="#" className="text-slate-500 hover:text-mlh-blue transition-colors">Privacy Policy</Link></li>
              <li><Link href="#" className="text-slate-500 hover:text-mlh-blue transition-colors">Terms of Service</Link></li>
              <li><Link href="/contact" className="text-slate-500 hover:text-mlh-blue transition-colors">Contact Us</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-slate-200 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between text-sm text-slate-500 font-bold">
          <p>© 2026 FLUX. Built by student builders.</p>
          <p className="mt-2 md:mt-0">Designed for the next wave of innovation.</p>
        </div>
      </div>
    </footer>
  )
}
