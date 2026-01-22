'use client';

import Head from 'next/head';

const BetaAccessPage = () => {
  return (
    <div className="min-vh-100 gradient-bg-auth" style={{ paddingTop: '100px', paddingBottom: '50px' }}>
      <Head>
        <title>Beta Access | Genius.AI</title>
      </Head>
      
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-8 col-xl-6">
            <div className="card premium-card border-0 shadow-lg" style={{ background: 'rgba(255, 255, 255, 0.03)', backdropFilter: 'blur(10px)' }}>
              <div className="card-body p-4 p-md-5">
                <div className="text-center mb-5">
                  <h2 className="gradient-text-brand mb-3">Beta Access Program</h2>
                  <p className="text-white-50">Be among the first to experience our cutting-edge features</p>
                </div>

                <div className="beta-access-content text-start">
                  <section className="mb-5">
                    <h4 className="text-white mb-3">Why Join Our Beta Program?</h4>
                    <p className="text-white-50">
                      As a beta tester, you'll gain early access to new features before they're released to the general public. 
                      Your feedback directly influences our product roadmap and helps shape the future of Genius.AI.
                    </p>
                  </section>

                  <section className="mb-5">
                    <h4 className="text-white mb-3">Current Beta Features</h4>
                    <ul className="text-white-50">
                      <li>Advanced document clustering and relationship mapping</li>
                      <li>Multi-modal analysis (text + images)</li>
                      <li>Custom AI model fine-tuning for enterprise users</li>
                      <li>Enhanced collaboration tools with real-time editing</li>
                      <li>API access for custom integrations</li>
                    </ul>
                  </section>

                  <section className="mb-5">
                    <h4 className="text-white mb-3">How to Join</h4>
                    <p className="text-white-50">
                      Beta access is currently limited to ensure we can provide the best experience for our testers. 
                      Fill out the application form below, and our team will review your request.
                    </p>
                  </section>

                  <section className="mb-5">
                    <h4 className="text-white mb-3">Application Form</h4>
                    <form>
                      <div className="mb-3">
                        <label htmlFor="fullName" className="form-label text-white-50">Full Name</label>
                        <input type="text" className="form-control bg-dark text-white border-secondary" id="fullName" placeholder="John Doe" />
                      </div>
                      
                      <div className="mb-3">
                        <label htmlFor="email" className="form-label text-white-50">Email Address</label>
                        <input type="email" className="form-control bg-dark text-white border-secondary" id="email" placeholder="john@example.com" />
                      </div>
                      
                      <div className="mb-3">
                        <label htmlFor="useCase" className="form-label text-white-50">Primary Use Case</label>
                        <select className="form-select bg-dark text-white border-secondary" id="useCase">
                          <option value="">Select your primary use case</option>
                          <option value="personal">Personal Knowledge Management</option>
                          <option value="academic">Academic Research</option>
                          <option value="business">Business Intelligence</option>
                          <option value="legal">Legal Document Analysis</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                      
                      <div className="mb-3">
                        <label htmlFor="experience" className="form-label text-white-50">How would you describe your experience with AI tools?</label>
                        <textarea className="form-control bg-dark text-white border-secondary" id="experience" rows={3} placeholder="Tell us about your experience..."></textarea>
                      </div>
                      
                      <div className="d-grid">
                        <button type="submit" className="btn btn-premium-gradient">Apply for Beta Access</button>
                      </div>
                    </form>
                  </section>

                  <section className="mb-5">
                    <h4 className="text-white mb-3">Beta Tester Benefits</h4>
                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <div className="p-3 rounded bg-dark">
                          <h5 className="text-white">Early Access</h5>
                          <p className="text-white-50 small">Try new features before anyone else</p>
                        </div>
                      </div>
                      <div className="col-md-6 mb-3">
                        <div className="p-3 rounded bg-dark">
                          <h5 className="text-white">Direct Influence</h5>
                          <p className="text-white-50 small">Shape product development with your feedback</p>
                        </div>
                      </div>
                      <div className="col-md-6 mb-3">
                        <div className="p-3 rounded bg-dark">
                          <h5 className="text-white">Priority Support</h5>
                          <p className="text-white-50 small">Get help when you need it</p>
                        </div>
                      </div>
                      <div className="col-md-6 mb-3">
                        <div className="p-3 rounded bg-dark">
                          <h5 className="text-white">Special Pricing</h5>
                          <p className="text-white-50 small">Exclusive discounts for loyal beta testers</p>
                        </div>
                      </div>
                    </div>
                  </section>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BetaAccessPage;