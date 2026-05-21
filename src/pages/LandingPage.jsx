const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-8 py-6 bg-white shadow-sm">
        <div className="text-2xl font-bold text-indigo-700">Resumehance</div>
        <nav className="space-x-8">
          <a
            href="#"
            className="text-indigo-700 font-medium border-b-2 border-indigo-700 pb-1"
          >
            Resumes
          </a>
          <a
            href="#"
            className="text-gray-700 font-medium hover:text-indigo-700"
          >
            Job Descriptions
          </a>
          <a
            href="#"
            className="text-gray-700 font-medium hover:text-indigo-700"
          >
            Analysis
          </a>
        </nav>
        <div className="flex items-center space-x-4">
          <button className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
            <span className="material-icons text-gray-600">notifications</span>
          </button>
          <button className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
            <span className="material-icons text-gray-600">settings</span>
          </button>
          <div className="w-8 h-8 rounded-full bg-indigo-200 flex items-center justify-center font-bold text-indigo-700">
            A
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex flex-col md:flex-row items-center justify-between px-8 py-16 max-w-7xl mx-auto w-full gap-12">
        <div className="flex-1">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            AI Resume &{" "}
            <span className="text-indigo-700">Job Match Analyzer</span>
          </h1>
          <p className="text-lg text-gray-600 mb-8 max-w-xl">
            Parsing + Analysis made simple. Stop guessing. Use editorial-grade
            AI to find the perfect alignment between talent and opportunity.
          </p>
          <div className="flex gap-4">
            <button className="bg-indigo-700 text-white px-6 py-3 rounded-lg font-semibold shadow hover:bg-indigo-800 transition">
              Upload Resume
            </button>
            <button className="bg-white border border-indigo-700 text-indigo-700 px-6 py-3 rounded-lg font-semibold shadow hover:bg-indigo-50 transition">
              Start Analysis
            </button>
          </div>
        </div>
        <div className="flex-1 flex justify-center">
          <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center w-80">
            <img
              src="/assets/hero-graph.png"
              alt="Graph"
              className="w-full mb-4 rounded-lg"
            />
            <div className="w-full flex flex-col items-center">
              <span className="text-xs text-gray-500 mb-1">MATCH SCORE</span>
              <span className="text-3xl font-bold text-green-600">98%</span>
            </div>
          </div>
        </div>
      </section>

      {/* Curation Process */}
      <section className="bg-white py-16 px-8">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold mb-8 text-gray-900">
            The Curation Process
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center mb-4">
                <span className="material-icons text-indigo-700">
                  upload_file
                </span>
              </div>
              <div className="text-3xl font-bold text-indigo-700 mb-2">01</div>
              <div className="font-semibold mb-2">Intake</div>
              <div className="text-gray-500">
                Upload your resumes and job descriptions in any format. Our
                parser extracts the soul of the document, not just the keywords.
              </div>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center mb-4">
                <span className="material-icons text-indigo-700">
                  compare_arrows
                </span>
              </div>
              <div className="text-3xl font-bold text-indigo-700 mb-2">02</div>
              <div className="font-semibold mb-2">Alignment</div>
              <div className="text-gray-500">
                Our AI cross-references skills, experience vectors, and cultural
                signals to determine the true match potential beyond the
                surface.
              </div>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center mb-4">
                <span className="material-icons text-indigo-700">
                  check_circle
                </span>
              </div>
              <div className="text-3xl font-bold text-indigo-700 mb-2">03</div>
              <div className="font-semibold mb-2">Selection</div>
              <div className="text-gray-500">
                Receive a curated list of top candidates ranked by relevance,
                with detailed insights on why they are the perfect fit.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Precision Engineering */}
      <section className="py-16 px-8 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold mb-8 text-center text-gray-900">
            Precision Engineering
          </h2>
          <p className="text-center text-gray-600 mb-12">
            Every tool you need to transform your hiring workflow from manual
            searching to intelligent curation.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-xl shadow p-6 flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <span className="material-icons text-indigo-700">
                  psychology
                </span>
                <span className="font-semibold">Semantic Context Mapping</span>
              </div>
              <div className="text-gray-500">
                Our engine understands that "Architect" means something
                different in software than it does in construction. Context is
                everything.
              </div>
              <img
                src="/assets/semantic-context.png"
                alt="Semantic Context"
                className="rounded-lg mt-2"
              />
            </div>
            <div className="bg-indigo-700 rounded-xl shadow p-6 flex flex-col gap-4 text-white">
              <div className="flex items-center gap-2">
                <span className="material-icons">bolt</span>
                <span className="font-semibold">Instant Batch Processing</span>
              </div>
              <div>
                Analyze thousands of resumes against multiple job descriptions
                in seconds.
              </div>
              <div className="mt-auto text-right font-bold opacity-60">
                TURBO
              </div>
            </div>
            <div className="bg-white rounded-xl shadow p-6 flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <span className="material-icons text-indigo-700">lock</span>
                <span className="font-semibold">Privacy First</span>
              </div>
              <div className="text-gray-500">
                Enterprise-grade encryption for all sensitive talent data.
              </div>
            </div>
            <div className="bg-white rounded-xl shadow p-6 flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <span className="material-icons text-indigo-700">balance</span>
                <span className="font-semibold">Bias-Free Analysis</span>
              </div>
              <div className="text-gray-500">
                Focus purely on competence and experience vectors. Our AI is
                trained to ignore demographic signals.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Ready to Curator */}
      <section className="py-16 px-8">
        <div className="max-w-3xl mx-auto bg-gray-100 rounded-2xl flex flex-col items-center py-16">
          <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center mb-6">
            <span className="material-icons text-indigo-700 text-3xl">
              cloud_upload
            </span>
          </div>
          <h3 className="text-xl font-bold mb-4">Ready to Resumehance?</h3>
          <p className="text-gray-600 mb-8">
            Drag and drop your resume file here or click to browse.
          </p>
          <button className="bg-indigo-700 text-white px-8 py-3 rounded-lg font-semibold shadow hover:bg-indigo-800 transition">
            Choose Files
          </button>
          <div className="text-xs text-gray-400 mt-4">
            SUPPORTED FORMATS: PDF, DOCX, TXT
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white py-8 px-8 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center text-gray-500 text-sm">
          <div className="mb-4 md:mb-0">
            <span className="font-bold text-indigo-700">Resumehance</span> —
            Elevating the talent acquisition experience through sophisticated AI
            alignment and editorial-grade design.
          </div>
          <div className="flex gap-8">
            <div>
              <div className="font-semibold text-gray-700 mb-1">Product</div>
              <div>Pricing</div>
              <div>Features</div>
              <div>Enterprise</div>
            </div>
            <div>
              <div className="font-semibold text-gray-700 mb-1">Support</div>
              <div>Documentation</div>
              <div>Help Center</div>
              <div>API Status</div>
            </div>
            <div>
              <div className="font-semibold text-gray-700 mb-1">Legal</div>
              <div>Privacy</div>
              <div>Terms</div>
              <div>Security</div>
            </div>
          </div>
        </div>
        <div className="text-center text-xs text-gray-400 mt-8">
          © 2026 Resumehance. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
