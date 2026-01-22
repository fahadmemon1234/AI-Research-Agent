'use client';

import Head from 'next/head';

const VisionPage = () => {
  return (
    <div className="min-vh-100 gradient-bg-auth" style={{ paddingTop: '100px', paddingBottom: '50px' }}>
      <Head>
        <title>Our Vision | Genius.AI</title>
      </Head>
      
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-10 col-xl-8">
            <div className="card premium-card border-0 shadow-lg" style={{ background: 'rgba(255, 255, 255, 0.03)', backdropFilter: 'blur(10px)' }}>
              <div className="card-body p-4 p-md-5">
                <div className="text-center mb-5">
                  <h2 className="gradient-text-brand mb-3">Our Vision</h2>
                  <p className="text-white-50">Transforming how humanity interacts with knowledge</p>
                </div>

                <div className="vision-content text-start">
                  <section className="mb-5">
                    <h4 className="text-white mb-3">The Future of Knowledge Interaction</h4>
                    <p className="text-white-50">
                      We envision a world where accessing and understanding information is as intuitive as having a conversation. 
                      Our mission is to bridge the gap between human curiosity and the vast ocean of digital knowledge.
                    </p>
                  </section>

                  <section className="mb-5">
                    <h4 className="text-white mb-3">Democratizing AI-Powered Insights</h4>
                    <p className="text-white-50">
                      Knowledge should be accessible to everyone, regardless of technical expertise. 
                      We're building tools that empower individuals and organizations to unlock insights from their documents without requiring specialized skills.
                    </p>
                  </section>

                  <section className="mb-5">
                    <h4 className="text-white mb-3">Creating Intelligent Systems</h4>
                    <p className="text-white-50">
                      Our vision extends beyond simple document analysis. We're developing systems that understand context, 
                      recognize patterns, and provide meaningful insights that drive decision-making and innovation.
                    </p>
                  </section>

                  <section className="mb-5">
                    <h4 className="text-white mb-3">Ethical AI Development</h4>
                    <p className="text-white-50">
                      As we advance AI capabilities, we remain committed to ethical development practices. 
                      Our systems are designed with privacy, fairness, and transparency at their core.
                    </p>
                  </section>

                  <section className="mb-5">
                    <h4 className="text-white mb-3">Global Impact</h4>
                    <p className="text-white-50">
                      From researchers unlocking scientific breakthroughs to entrepreneurs making data-driven decisions, 
                      we aim to be the catalyst that transforms information into actionable knowledge across all sectors of society.
                    </p>
                  </section>

                  <section className="mb-5">
                    <h4 className="text-white mb-3">Our Commitment</h4>
                    <p className="text-white-50">
                      We're not just building software; we're crafting the future of human-AI collaboration. 
                      Every algorithm we develop, every feature we create, and every improvement we make is guided by our vision of making knowledge more accessible and actionable for everyone.
                    </p>
                  </section>

                  <div className="text-center mt-5 pt-4 border-top border-secondary-subtle">
                    <button className="btn btn-premium-gradient px-4 py-2">Join Our Mission</button>
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

export default VisionPage;