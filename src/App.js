import React from 'react';
import "./css/Landing.css";
import { Dice5, IndianRupee, Coins, Users, Shield, ArrowRight } from 'lucide-react';

function App() {
  return (
    <div className="min-vh-100">
      <header className="container py-5">
        <nav className="d-flex justify-content-between align-items-center mb-5">
          <div className="d-flex align-items-center gap-2">
            <Dice5 className="text-yellow" size={32} />
            <span className="fs-4 fw-bold text-white">SnakesWin</span>
          </div>
          <div className="d-flex gap-3">
            <button className="btn text-white">Login</button>
            <button className="btn btn-yellow">Play Now</button>
          </div>
        </nav>

        <div className="row align-items-center gy-4">
          <div className="col-md-6 text-center text-md-start">
            <h1 className="display-4 fw-bold text-white mb-4">
              Play Snakes & Ladders
              <span className="d-block text-yellow">Win Real Money!</span>
            </h1>
            <p className="lead text-white-50 mb-4">
              Experience the classic game with a modern twist. Compete with players worldwide and win big with INR or Solana.
            </p>
            <div className="d-flex flex-column flex-sm-row gap-3 justify-content-center justify-content-md-start">
              <button className="btn btn-yellow btn-lg d-flex align-items-center justify-content-center gap-2">
                Start Playing <ArrowRight size={20} />
              </button>
              <a href='#learnMore'> <button className="btn btn-outline-light btn-lg">Learn More</button></a>
            </div>
          </div>
          <div className="col-md-6">
            <img 
              src="https://images.unsplash.com/photo-1611996575749-79a3a250f948?auto=format&fit=crop&q=80&w=600"
              alt="Dice Game"
              className="img-fluid rounded-4 shadow"
            />
          </div>
        </div>
      </header>

      <section className="py-5 bg-purple-dark" id="learnMore">
        <div className="container">
          <h2 className="text-center text-white mb-5">Why Choose SnakesWin?</h2>
          <div className="row g-4">
            <div className="col-md-4">
              <FeatureCard 
                icon={<IndianRupee size={32} />}
                title="INR Support"
                description="Play with Indian Rupees. Easy deposits and instant withdrawals."
              />
            </div>
            <div className="col-md-4">
              <FeatureCard 
                icon={<Coins size={32} />}
                title="Solana Integration"
                description="Use Solana for lightning-fast crypto transactions."
              />
            </div>
            <div className="col-md-4">
              <FeatureCard 
                icon={<Users size={32} />}
                title="Multiplayer"
                description="Compete with players from around the world in real-time."
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-5 bg-purple-dark">
        <div className="container text-center">
          <div className="d-flex align-items-center justify-content-center gap-2 mb-4">
            <Shield className="text-yellow" size={32} />
            <h2 className="mb-0 text-white">Secure Gaming</h2>
          </div>
          <p className="text-white-50 mx-auto" style={{ maxWidth: '600px' }}>
            Your security is our priority. All transactions are encrypted and protected. 
            We are licensed and regulated to ensure fair play.
          </p>
        </div>
      </section>

      <footer className="py-4 footer">
        <div className="container">
          <div className="d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center gap-2">
              <Dice5 className="text-yellow" size={24} />
              <span className="text-white">SnakesWin</span>
            </div>
            <p className="text-white-50 mb-0 small">
              © 2024 SnakesWin. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }) {
  return (
    <div className="feature-card h-100 p-4 rounded-4 text-center">
      <div className="text-yellow mb-3">{icon}</div>
      <h3 className="fs-5 fw-semibold text-white mb-2">{title}</h3>
      <p className="text-white-50 mb-0">{description}</p>
    </div>
  );
}

export default App;