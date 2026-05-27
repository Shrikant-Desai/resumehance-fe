import { useNavigate, Link } from "react-router-dom";
import { useSelector } from "react-redux";

const LandingPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.auth);

  return (
    <div className="min-h-screen flex flex-col bg-surface select-none">
      {/* Top Navigation Bar */}
      <nav className="sticky top-0 z-40 w-full bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-b border-slate-100 dark:border-slate-900 shadow-sm">
        <div className="flex justify-between items-center h-16 px-8 max-w-7xl mx-auto w-full">
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => navigate("/")}
          >
            <span className="text-xl font-headline font-extrabold text-primary tracking-tight">
              Curator AI
            </span>
          </div>

          <div className="hidden md:flex items-center gap-8 font-label text-sm font-medium">
            <a
              href="#how-it-works"
              className="text-on-surface-variant hover:text-primary transition-colors"
            >
              How it Works
            </a>
            <a
              href="#features"
              className="text-on-surface-variant hover:text-primary transition-colors"
            >
              Features
            </a>
            <a
              href="#pricing"
              className="text-on-surface-variant hover:text-primary transition-colors"
            >
              Pricing
            </a>
          </div>

          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <button
                onClick={() => navigate("/dashboard")}
                className="bg-primary-gradient text-on-primary px-5 py-2 rounded-lg text-sm font-bold shadow-md hover:shadow-lg transition-all scale-100 active:scale-95 cursor-pointer"
              >
                Go to Dashboard
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-on-surface-variant hover:text-primary text-sm font-semibold transition-colors"
                >
                  Log In
                </Link>
                <button
                  onClick={() => navigate("/signup")}
                  className="bg-primary-gradient text-on-primary px-5 py-2 rounded-lg text-sm font-bold shadow-md hover:shadow-lg transition-all scale-100 active:scale-95 cursor-pointer"
                >
                  Sign Up
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative px-8 pt-20 pb-28 overflow-hidden bg-surface">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 z-10 text-left">
              <h1 className="font-headline text-5xl md:text-7xl font-extrabold tracking-tight text-on-surface leading-[1.1] mb-6">
                AI Resume & <br />
                <span className="text-primary bg-gradient-to-r from-primary to-indigo-600 bg-clip-text text-transparent">
                  Job Match Analyzer
                </span>
              </h1>
              <p className="text-lg md:text-xl text-on-surface-variant font-body max-w-xl mb-10 leading-relaxed">
                Parsing + Analysis made simple. Stop guessing. Use
                editorial-grade AI to find the perfect alignment between talent
                and opportunity.
              </p>
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={() =>
                    navigate(isAuthenticated ? "/resumes" : "/signup")
                  }
                  className="bg-primary-gradient text-on-primary px-8 py-4 rounded-lg font-bold flex items-center gap-3 hover:shadow-lg transition-all scale-100 active:scale-95 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-lg">
                    upload_file
                  </span>
                  Upload Resume
                </button>
                <button
                  onClick={() =>
                    navigate(isAuthenticated ? "/analysis" : "/signup")
                  }
                  className="bg-surface-container-high text-primary px-8 py-4 rounded-lg font-bold hover:bg-surface-container-highest transition-all cursor-pointer"
                >
                  Start Analysis
                </button>
              </div>
            </div>

            <div className="lg:col-span-5 relative">
              {/* Asymmetric Decorative Element */}
              <div className="aspect-square w-full bg-indigo-50 dark:bg-slate-900/50 rounded-2xl relative overflow-hidden shadow-inner flex items-center justify-center">
                {/* SVG Visual Representation instead of broken images */}
                <svg
                  className="w-2/3 h-2/3 text-indigo-200 dark:text-slate-800"
                  viewBox="0 0 200 200"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M40 20H160C171.046 20 180 28.9543 180 40V160C180 171.046 171.046 180 160 180H40C28.9543 180 20 171.046 20 160V40C20 28.9543 28.9543 20 40 20Z"
                    fill="currentColor"
                    fillOpacity="0.1"
                  />
                  <rect
                    x="40"
                    y="50"
                    width="120"
                    height="8"
                    rx="4"
                    fill="currentColor"
                    fillOpacity="0.3"
                  />
                  <rect
                    x="40"
                    y="70"
                    width="80"
                    height="8"
                    rx="4"
                    fill="currentColor"
                    fillOpacity="0.3"
                  />
                  <rect
                    x="40"
                    y="90"
                    width="100"
                    height="8"
                    rx="4"
                    fill="currentColor"
                    fillOpacity="0.3"
                  />
                  <circle
                    cx="60"
                    cy="135"
                    r="15"
                    fill="currentColor"
                    fillOpacity="0.4"
                  />
                  <circle
                    cx="100"
                    cy="135"
                    r="15"
                    fill="currentColor"
                    fillOpacity="0.4"
                  />
                  <circle
                    cx="140"
                    cy="135"
                    r="15"
                    fill="currentColor"
                    fillOpacity="0.4"
                  />
                </svg>

                {/* Floating Glass Card */}
                <div className="absolute bottom-8 -left-4 glass-panel p-6 rounded-xl shadow-2xl border border-white/20 w-64 text-left">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-bold text-primary uppercase tracking-wider">
                      Match Score
                    </span>
                    <span className="text-2xl font-headline font-extrabold text-secondary">
                      98%
                    </span>
                  </div>
                  <div className="w-full h-2 bg-surface-container-highest rounded-full overflow-hidden">
                    <div className="h-full bg-secondary w-[98%] shadow-[0_0_12px_rgba(0,108,73,0.3)]"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How it Works: Editorial Flow */}
        <section
          id="how-it-works"
          className="bg-surface-container-low py-28 px-8 border-t border-slate-100 dark:border-slate-900"
        >
          <div className="max-w-7xl mx-auto">
            <div className="mb-20 text-left">
              <h2 className="font-headline text-3xl font-extrabold mb-4 text-slate-800 dark:text-slate-200">
                The Curation Process
              </h2>
              <div className="w-24 h-1.5 bg-primary rounded-full"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-16 text-left">
              {/* Step 1 */}
              <div className="relative">
                <span className="text-8xl font-headline font-extrabold text-slate-200/60 dark:text-slate-800 absolute -top-12 -left-4 z-0">
                  01
                </span>
                <div className="relative z-10">
                  <h3 class="text-xl font-bold mb-4 flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">
                      description
                    </span>
                    Intake
                  </h3>
                  <p className="text-on-surface-variant leading-relaxed">
                    Upload your resumes and job descriptions in any format. Our
                    parser extracts the soul of the document, not just the
                    keywords.
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="relative">
                <span className="text-8xl font-headline font-extrabold text-slate-200/60 dark:text-slate-800 absolute -top-12 -left-4 z-0">
                  02
                </span>
                <div className="relative z-10">
                  <h3 class="text-xl font-bold mb-4 flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">
                      analytics
                    </span>
                    Alignment
                  </h3>
                  <p className="text-on-surface-variant leading-relaxed">
                    Our AI cross-references skills, experience vectors, and
                    cultural signals to determine the true match potential
                    beyond the surface.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="relative">
                <span className="text-8xl font-headline font-extrabold text-slate-200/60 dark:text-slate-800 absolute -top-12 -left-4 z-0">
                  03
                </span>
                <div className="relative z-10">
                  <h3 class="text-xl font-bold mb-4 flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">
                      verified
                    </span>
                    Selection
                  </h3>
                  <p className="text-on-surface-variant leading-relaxed">
                    Receive a detailed readiness score, highlighted skill gap
                    reports, and a week-by-week learning roadmap customized to
                    land the job.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Bento Grid */}
        <section
          id="features"
          className="py-28 px-8 bg-surface border-t border-slate-100 dark:border-slate-900"
        >
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-20">
              <h2 className="font-headline text-4xl font-extrabold mb-4">
                Precision Engineering
              </h2>
              <p className="text-on-surface-variant max-w-2xl mx-auto">
                Every tool you need to transform your career strategy from
                manual searching to intelligent curation.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              {/* Large Feature */}
              <div className="md:col-span-8 bg-surface-container-lowest dark:bg-slate-900 p-10 rounded-xl flex flex-col justify-between hover:scale-[1.01] transition-transform duration-300 group border border-slate-100/50 dark:border-slate-800 text-left min-h-[380px]">
                <div>
                  <div className="w-12 h-12 rounded-lg bg-indigo-50 dark:bg-slate-800 flex items-center justify-center text-primary mb-6">
                    <span className="material-symbols-outlined">
                      psychology
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold mb-4">
                    Semantic Context Mapping
                  </h3>
                  <p className="text-on-surface-variant max-w-md">
                    Our embedding engine understands that "ML" translates to
                    "Machine Learning", mapping credentials conceptually.
                    Context is everything.
                  </p>
                </div>
                <div className="mt-8 rounded-xl bg-surface-container-low dark:bg-slate-800/50 h-40 flex items-center justify-center overflow-hidden">
                  {/* Semantic match demo visual */}
                  <div className="flex items-center gap-4 text-xs font-semibold">
                    <span className="bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 px-4 py-2 rounded-full shadow-sm">
                      React.js
                    </span>
                    <span className="material-symbols-outlined text-slate-400">
                      sync_alt
                    </span>
                    <span className="bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 px-4 py-2 rounded-full shadow-sm">
                      React Framework
                    </span>
                    <span className="text-emerald-600 font-bold ml-2">
                      97% Match
                    </span>
                  </div>
                </div>
              </div>

              {/* Small Feature 1 */}
              <div className="md:col-span-4 bg-primary text-on-primary p-10 rounded-xl flex flex-col justify-between text-left min-h-[380px]">
                <div>
                  <div className="w-12 h-12 rounded-lg bg-white/10 flex items-center justify-center mb-6">
                    <span className="material-symbols-outlined">bolt</span>
                  </div>
                  <h3 className="text-2xl font-bold mb-4">
                    Instant Match Analysis
                  </h3>
                  <p className="text-on-primary/70">
                    Analyze resumes against multiple job requirements in seconds
                    with vector-database accuracy.
                  </p>
                </div>
                <div className="font-headline text-3xl font-extrabold opacity-30 self-end">
                  FAST
                </div>
              </div>

              {/* Small Feature 2 */}
              <div className="md:col-span-4 bg-surface-container-low dark:bg-slate-900/60 p-10 rounded-xl flex flex-col justify-center gap-4 text-left border border-slate-100/50 dark:border-slate-800">
                <div className="w-12 h-12 rounded-lg bg-white dark:bg-slate-800 flex items-center justify-center text-secondary shadow-sm">
                  <span className="material-symbols-outlined">security</span>
                </div>
                <h3 className="text-xl font-bold">Privacy First</h3>
                <p className="text-on-surface-variant text-sm">
                  Enterprise-grade isolation models to guarantee all candidate
                  parameters remain private and encrypted.
                </p>
              </div>

              {/* Medium Feature */}
              <div className="md:col-span-8 bg-surface-container-high dark:bg-slate-900/80 p-10 rounded-xl flex items-center justify-between gap-8 overflow-hidden border border-slate-100/50 dark:border-slate-800 text-left">
                <div className="flex-1">
                  <h3 className="text-2xl font-bold mb-4">
                    Deterministic Scoring
                  </h3>
                  <p className="text-on-surface-variant">
                    Readiness score is calculated using exact mathematical
                    formulas based on skill weights, prioritizing critical needs
                    for maximum transparency.
                  </p>
                </div>
                <div className="hidden sm:flex w-1/3 aspect-square bg-white dark:bg-slate-850 rounded-full items-center justify-center shadow-lg border-8 border-surface-container">
                  <span className="material-symbols-outlined text-primary text-5xl">
                    balance
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Call to action section */}
        <section
          id="pricing"
          className="py-28 px-8 bg-surface-container-low dark:bg-slate-950/40 border-t border-slate-100 dark:border-slate-900"
        >
          <div className="max-w-3xl mx-auto">
            <div className="bg-surface-container-lowest dark:bg-slate-900 rounded-xl p-16 text-center border-2 border-transparent hover:border-primary-fixed dark:hover:border-slate-800 transition-all shadow-md">
              <div className="mb-8">
                <div className="w-20 h-20 bg-indigo-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                  <span className="material-symbols-outlined text-primary text-4xl">
                    cloud_upload
                  </span>
                </div>
                <h2 className="text-3xl font-headline font-extrabold mb-2 text-slate-800 dark:text-slate-200">
                  Ready to Curator?
                </h2>
                <p className="text-on-surface-variant max-w-sm mx-auto">
                  Sign up for a free account today to analyze resumes and job
                  descriptions using Google Gemini AI.
                </p>
              </div>
              <button
                onClick={() =>
                  navigate(isAuthenticated ? "/dashboard" : "/signup")
                }
                className="bg-primary-gradient text-on-primary px-12 py-5 rounded-lg font-bold text-lg hover:shadow-2xl transition-all scale-100 active:scale-95 cursor-pointer"
              >
                Get Started Free
              </button>
              <p className="mt-6 text-xs text-on-surface-variant font-medium tracking-wide uppercase">
                No credit card required
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-slate-950 py-16 px-8 border-t border-slate-100 dark:border-slate-900 text-left">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-12">
          <div className="max-w-xs">
            <span className="text-2xl font-headline font-extrabold text-primary tracking-tight block mb-4">
              Curator AI
            </span>
            <p className="text-on-surface-variant text-sm leading-relaxed">
              Elevating the matching experience through sophisticated semantic
              AI alignment and premium-quality analytics.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-16">
            <div>
              <h4 className="font-bold text-sm mb-6 uppercase tracking-widest text-on-surface">
                Product
              </h4>
              <ul className="space-y-4 text-on-surface-variant text-sm">
                <li>
                  <Link
                    to="/signup"
                    className="hover:text-primary transition-colors"
                  >
                    Start Free
                  </Link>
                </li>
                <li>
                  <a
                    href="#features"
                    className="hover:text-primary transition-colors"
                  >
                    Features
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-sm mb-6 uppercase tracking-widest text-on-surface">
                Support
              </h4>
              <ul className="space-y-4 text-on-surface-variant text-sm">
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>
            <div className="hidden sm:block">
              <h4 className="font-bold text-sm mb-6 uppercase tracking-widest text-on-surface">
                Legal
              </h4>
              <ul className="space-y-4 text-on-surface-variant text-sm">
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Cookie settings
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-slate-100 dark:border-slate-900 text-xs text-on-surface-variant/50 flex justify-between">
          <span>© 2026 Curator AI. All rights reserved.</span>
          <div className="flex gap-6">
            <a href="#" className="hover:text-primary">
              Twitter
            </a>
            <a href="#" className="hover:text-primary">
              LinkedIn
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
