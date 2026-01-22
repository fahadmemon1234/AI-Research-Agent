'use client';

import Head from 'next/head';

const PricingPage = () => {
  return (
    <div className="min-vh-100 luxury-bg" style={{ paddingTop: '120px', paddingBottom: '100px' }}>
      <style jsx>{`
        .luxury-bg {
          background: radial-gradient(circle at top right, #0a1221 0%, #020408 100%);
          color: #fff;
        }

        .pricing-card {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.08);
          backdrop-filter: blur(20px);
          border-radius: 35px;
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          position: relative;
          overflow: hidden;
        }

        .pricing-card:hover {
          transform: translateY(-15px);
          background: rgba(255, 255, 255, 0.04);
          border-color: rgba(0, 210, 255, 0.4);
          box-shadow: 0 30px 60px rgba(0, 0, 0, 0.5);
        }

        .pro-card {
          background: rgba(0, 210, 255, 0.03);
          border: 2px solid #00d2ff !important;
        }

        .price-text {
          font-size: 3.5rem;
          font-weight: 800;
          background: linear-gradient(180deg, #fff 0%, #aaa 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .feature-list {
          list-style: none;
          padding: 0;
          margin: 30px 0;
        }

        .feature-list li {
          padding: 10px 0;
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 0.95rem;
          color: rgba(255, 255, 255, 0.7);
        }

        .feature-list li i {
          font-size: 1.1rem;
        }

        .popular-badge {
          background: #00d2ff;
          color: #000;
          font-weight: 800;
          font-size: 0.7rem;
          padding: 5px 20px;
          border-radius: 0 0 15px 15px;
          letter-spacing: 2px;
        }

        .btn-upgrade {
          background: #fff;
          color: #000;
          border: none;
          padding: 15px;
          border-radius: 15px;
          font-weight: 700;
          transition: 0.3s;
        }

        .btn-upgrade:hover {
          background: #00d2ff;
          color: #fff;
          transform: scale(1.02);
        }

        .faq-item {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 20px;
          margin-bottom: 15px;
          overflow: hidden;
        }

        .accordion-button {
          color: white !important;
          padding: 25px;
          font-weight: 600;
        }

        .accordion-button:not(.collapsed) {
          background: rgba(0, 210, 255, 0.05);
          color: #00d2ff !important;
        }
      `}</style>

      <Head>
        <title>Pricing Plans | Genius.AI</title>
      </Head>

      <div className="container">
        {/* Header */}
        <div className="text-center mb-5 pb-4">
          <h1 className="display-4 fw-bold mb-3">Precision Pricing</h1>
          <p className="text-white-50 mx-auto" style={{ maxWidth: '600px' }}>
            Scale your document intelligence with plans designed for individuals and global enterprises.
          </p>
        </div>

        <div className="row g-4 align-items-center">
          {/* Starter Plan */}
          <div className="col-lg-4">
            <div className="pricing-card card h-100">
              <div className="card-body p-5">
                <h5 className="text-uppercase text-white-50 small fw-bold mb-4">Starter</h5>
                <div className="mb-4">
                  <span className="price-text">$0</span>
                  <span className="text-white-50 ms-2">/month</span>
                </div>
                <p className="small text-white-50">Essential tools for individual researchers.</p>
                <ul className="feature-list">
                  <li><i className="bi bi-check2 text-info"></i> Up to 5 documents</li>
                  <li><i className="bi bi-check2 text-info"></i> 100 queries/month</li>
                  <li><i className="bi bi-check2 text-info"></i> Basic AI analysis</li>
                  <li className="opacity-25"><i className="bi bi-lock-fill"></i> Priority processing</li>
                  <li className="opacity-25"><i className="bi bi-lock-fill"></i> Team collaboration</li>
                </ul>
                <button className="btn btn-outline-light w-100 rounded-pill py-3">Begin Trial</button>
              </div>
            </div>
          </div>

          {/* Pro Plan */}
          <div className="col-lg-4">
            <div className="pricing-card pro-card card h-100">
              <div className="position-absolute top-0 start-50 translate-middle-x">
                <span className="popular-badge">MOST POPULAR</span>
              </div>
              <div className="card-body p-5 pt-5">
                <h5 className="text-info text-uppercase small fw-bold mb-4">Professional</h5>
                <div className="mb-4">
                  <span className="price-text">$29</span>
                  <span className="text-white-50 ms-2">/month</span>
                </div>
                <p className="small text-white-50">Advanced intelligence for heavy workloads.</p>
                <ul className="feature-list">
                  <li><i className="bi bi-check2-all text-info"></i> Up to 50 documents</li>
                  <li><i className="bi bi-check2-all text-info"></i> 1,000 queries/month</li>
                  <li><i className="bi bi-check2-all text-info"></i> Advanced AI analysis</li>
                  <li><i className="bi bi-check2-all text-info"></i> Priority processing</li>
                  <li className="opacity-25"><i className="bi bi-lock-fill"></i> Team collaboration</li>
                </ul>
                <button className="btn-upgrade w-100">Upgrade to Pro</button>
              </div>
            </div>
          </div>

          {/* Enterprise Plan */}
          <div className="col-lg-4">
            <div className="pricing-card card h-100">
              <div className="card-body p-5">
                <h5 className="text-uppercase text-white-50 small fw-bold mb-4">Enterprise</h5>
                <div className="mb-4">
                  <span className="price-text">$99</span>
                  <span className="text-white-50 ms-2">/month</span>
                </div>
                <p className="small text-white-50">Infinite scale for high-performance teams.</p>
                <ul className="feature-list">
                  <li><i className="bi bi-infinity text-info"></i> Unlimited documents</li>
                  <li><i className="bi bi-infinity text-info"></i> Unlimited queries</li>
                  <li><i className="bi bi-check2-all text-info"></i> Dedicated Support</li>
                  <li><i className="bi bi-check2-all text-info"></i> Team collaboration</li>
                  <li><i className="bi bi-check2-all text-info"></i> Custom API Access</li>
                </ul>
                <button className="btn btn-outline-info w-100 rounded-pill py-3">Contact Sales</button>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-5 pt-5 row justify-content-center">
          <div className="col-lg-8">
            <h3 className="text-center mb-5">Common Inquiries</h3>
            <div className="accordion accordion-flush" id="pricingFAQ">
              
              <div className="faq-item">
                <h2 className="accordion-header">
                  <button className="accordion-button bg-transparent collapsed shadow-none" type="button" data-bs-toggle="collapse" data-bs-target="#q1">
                    What constitutes a document?
                  </button>
                </h2>
                <div id="q1" className="accordion-collapse collapse" data-bs-parent="#pricingFAQ">
                  <div className="accordion-body text-white-50">
                    A document is any single file (PDF, DOCX, TXT) uploaded to your secure cloud. 
                    Each file counts as one unit regardless of page density.
                  </div>
                </div>
              </div>

              <div className="faq-item">
                <h2 className="accordion-header">
                  <button className="accordion-button bg-transparent collapsed shadow-none" type="button" data-bs-toggle="collapse" data-bs-target="#q2">
                    Can I cancel my subscription anytime?
                  </button>
                </h2>
                <div id="q2" className="accordion-collapse collapse" data-bs-parent="#pricingFAQ">
                  <div className="accordion-body text-white-50">
                    Yes. Genius.AI operates on a monthly rolling basis. You can terminate your 
                    access at any time from your billing dashboard with zero hidden fees.
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

export default PricingPage;