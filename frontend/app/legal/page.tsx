'use client';

import Head from 'next/head';

const LegalPage = () => {
  return (
    <div className="min-vh-100 gradient-bg-auth" style={{ paddingTop: '100px', paddingBottom: '50px' }}>
      <Head>
        <title>Legal | Genius.AI</title>
      </Head>
      
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-10 col-xl-8">
            <div className="card premium-card border-0 shadow-lg" style={{ background: 'rgba(255, 255, 255, 0.03)', backdropFilter: 'blur(10px)' }}>
              <div className="card-body p-4 p-md-5">
                <div className="text-center mb-5">
                  <h2 className="gradient-text-brand mb-3">Legal Information</h2>
                  <p className="text-white-50">Important legal documents and policies</p>
                </div>

                <div className="legal-content text-start">
                  <section className="mb-5">
                    <h4 className="text-white mb-3">Overview</h4>
                    <p className="text-white-50">
                      This section contains all legal documents related to Genius.AI. Please read these carefully as they govern your use of our services.
                    </p>
                  </section>

                  <section className="mb-5">
                    <h4 className="text-white mb-3">Main Legal Documents</h4>
                    <div className="list-group">
                      <a href="/terms" className="list-group-item list-group-item-action bg-dark text-white border-secondary">
                        <div className="d-flex w-100 justify-content-between">
                          <h5 className="mb-1">Terms of Service</h5>
                        </div>
                        <p className="mb-1 text-white-50">The rules that govern your use of Genius.AI services</p>
                      </a>
                      <a href="/privacy" className="list-group-item list-group-item-action bg-dark text-white border-secondary">
                        <div className="d-flex w-100 justify-content-between">
                          <h5 className="mb-1">Privacy Policy</h5>
                        </div>
                        <p className="mb-1 text-white-50">How we collect, use, and protect your personal information</p>
                      </a>
                      <a href="#" className="list-group-item list-group-item-action bg-dark text-white border-secondary">
                        <div className="d-flex w-100 justify-content-between">
                          <h5 className="mb-1">Cookie Policy</h5>
                        </div>
                        <p className="mb-1 text-white-50">Information about cookies and how we use them</p>
                      </a>
                      <a href="#" className="list-group-item list-group-item-action bg-dark text-white border-secondary">
                        <div className="d-flex w-100 justify-content-between">
                          <h5 className="mb-1">Copyright Policy</h5>
                        </div>
                        <p className="mb-1 text-white-50">Our approach to copyright protection and infringement claims</p>
                      </a>
                    </div>
                  </section>

                  <section className="mb-5">
                    <h4 className="text-white mb-3">Data Protection</h4>
                    <p className="text-white-50">
                      Genius.AI is committed to protecting your data and privacy. We comply with international data protection regulations, 
                      including the General Data Protection Regulation (GDPR) for EU residents and similar laws in other jurisdictions.
                    </p>
                  </section>

                  <section className="mb-5">
                    <h4 className="text-white mb-3">Intellectual Property</h4>
                    <p className="text-white-50">
                      All intellectual property rights in Genius.AI, including trademarks, copyrights, patents, and trade secrets, 
                      are owned by Genius AI Labs or our licensors. You may not use our intellectual property without our express written consent.
                    </p>
                  </section>

                  <section className="mb-5">
                    <h4 className="text-white mb-3">Dispute Resolution</h4>
                    <p className="text-white-50">
                      Any disputes arising from your use of Genius.AI will be resolved through binding arbitration, 
                      unless otherwise required by law. Please refer to our Terms of Service for complete details.
                    </p>
                  </section>

                  <section className="mb-5">
                    <h4 className="text-white mb-3">Contact Legal Department</h4>
                    <p className="text-white-50">
                      For legal inquiries, please contact our legal department at legal@genius.ai. 
                      Please note that communications via email do not constitute attorney-client privilege.
                    </p>
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

export default LegalPage;