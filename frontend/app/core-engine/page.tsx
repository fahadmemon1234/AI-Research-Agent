'use client';

import Head from 'next/head';

const CoreEnginePage = () => {
  return (
    <div className="min-vh-100 gradient-bg-auth" style={{ paddingTop: '100px', paddingBottom: '50px' }}>
      <Head>
        <title>Core Engine | Genius.AI</title>
      </Head>
      
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-10 col-xl-8">
            <div className="card premium-card border-0 shadow-lg" style={{ background: 'rgba(255, 255, 255, 0.03)', backdropFilter: 'blur(10px)' }}>
              <div className="card-body p-4 p-md-5">
                <div className="text-center mb-5">
                  <h2 className="gradient-text-brand mb-3">Core Engine</h2>
                  <p className="text-white-50">The neural-powered foundation of Genius.AI</p>
                </div>

                <div className="core-engine-content text-start">
                  <section className="mb-5">
                    <h4 className="text-white mb-3">Advanced Processing</h4>
                    <p className="text-white-50">
                      Our proprietary engine leverages state-of-the-art machine learning algorithms to process and analyze your documents with unprecedented accuracy and speed.
                    </p>
                  </section>

                  <section className="mb-5">
                    <h4 className="text-white mb-3">Real-time Analysis</h4>
                    <p className="text-white-50">
                      Experience near-instantaneous document analysis powered by our distributed computing infrastructure. Our engine processes complex documents in seconds, not minutes.
                    </p>
                  </section>

                  <section className="mb-5">
                    <h4 className="text-white mb-3">Intelligent Extraction</h4>
                    <p className="text-white-50">
                      Our AI identifies and extracts key insights, relationships, and patterns from your documents that traditional methods would miss. 
                      This enables deeper understanding and more accurate responses to your queries.
                    </p>
                  </section>

                  <section className="mb-5">
                    <h4 className="text-white mb-3">Continuous Learning</h4>
                    <p className="text-white-50">
                      The core engine continuously improves its performance based on user interactions and feedback. 
                      Each query helps refine the system for better results in the future.
                    </p>
                  </section>

                  <section className="mb-5">
                    <h4 className="text-white mb-3">Security-First Architecture</h4>
                    <p className="text-white-50">
                      Built with security at its core, our engine ensures that your data remains private and protected at all times. 
                      End-to-end encryption and strict access controls safeguard your information.
                    </p>
                  </section>

                  <div className="text-center mt-5 pt-4 border-top border-secondary-subtle">
                    <button className="btn btn-premium-gradient px-4 py-2">Learn More About Our Technology</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoreEnginePage;