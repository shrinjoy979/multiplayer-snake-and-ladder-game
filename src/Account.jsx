import React, { useState } from 'react';
import { Coins, IndianRupee, RefreshCcw } from 'lucide-react';
import './css/Account.css'

function App() {
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('INR');
  const [isSpinning, setIsSpinning] = useState(false);
  const [result, setResult] = useState(null);
  const [isWalletConnected, setIsWalletConnected] = useState(false);

  const handleBet = () => {
    if (!amount || parseFloat(amount) <= 0) return;
    if (currency === 'SOL' && !isWalletConnected) return;
    
    setIsSpinning(true);
    setResult(null);
    
    // Simulate betting result after 2 seconds
    setTimeout(() => {
      const win = Math.random() >= 0.5;
      setResult(win ? 'win' : 'lose');
      setIsSpinning(false);
    }, 2000);
  };

  const getSymbol = (curr) => curr === 'INR' ? '₹' : 'SOL';

  return (
    <div className="container min-vh-100 d-flex align-items-center justify-content-center py-4">
      <div className="betting-card p-4 p-md-5" style={{ maxWidth: '32rem' }}>
        <h1 className="text-center mb-4 fw-bold">Double or Nothing</h1>
        
        <div className="d-flex flex-column gap-4">
          {/* Currency Selection */}
          <div className="d-flex justify-content-center gap-3">
            <button
              onClick={() => setCurrency('INR')}
              className={`btn currency-btn d-flex align-items-center gap-2 px-4 py-2 ${
                currency === 'INR' ? 'active' : 'btn-outline-light'
              }`}
            >
              <IndianRupee size={20} />
              INR
            </button>
            <button
              onClick={() => setCurrency('SOL')}
              className={`btn currency-btn d-flex align-items-center gap-2 px-4 py-2 ${
                currency === 'SOL' ? 'active' : 'btn-outline-light'
              }`}
            >
              <Coins size={20} />
              SOL
            </button>
          </div>

          {/* Wallet Connection (Dummy) */}
          {currency === 'SOL' && (
            <div className="d-flex justify-content-center">
              <button
                onClick={() => setIsWalletConnected(!isWalletConnected)}
                className={`btn wallet-btn px-4 py-2 ${isWalletConnected ? 'connected' : ''}`}
              >
                {isWalletConnected ? 'Wallet Connected' : 'Connect Wallet'}
              </button>
            </div>
          )}

          {/* Amount Input */}
          <div className="position-relative">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder={`Enter amount in ${currency}`}
              className="form-control bet-input"
            />
            <span className="position-absolute end-0 top-50 translate-middle-y pe-3 text-white-50">
              {getSymbol(currency)}
            </span>
          </div>

          {/* Bet Button */}
          <button
            onClick={handleBet}
            disabled={isSpinning || !amount || parseFloat(amount) <= 0 || (currency === 'SOL' && !isWalletConnected)}
            className="btn place-bet-btn d-flex align-items-center justify-content-center gap-2 py-3"
          >
            {isSpinning ? (
              <>
                <RefreshCcw className="spinner" size={20} />
                Betting...
              </>
            ) : (
              currency === 'SOL' && !isWalletConnected ? 'Connect Wallet to Bet' : 'Place Bet'
            )}
          </button>

          {/* Result Display */}
          {result && (
            <div className={`result-box ${result}`}>
              {result === 'win' ? (
                <>
                  <p className="fs-5 fw-bold mb-2 text-center">Congratulations! 🎉</p>
                  <p className="mb-0 text-center">You won {getSymbol(currency)}{(parseFloat(amount) * 2).toFixed(2)}!</p>
                </>
              ) : (
                <>
                  <p className="fs-5 fw-bold mb-2 text-center">Better luck next time! 😔</p>
                  <p className="mb-0 text-center">You lost {getSymbol(currency)}{amount}</p>
                </>
              )}
            </div>
          )}
        </div>

        <p className="text-white-50 small text-center mt-4 mb-0">
          Place your bet and double your money if you win!
        </p>
      </div>
    </div>
  );
}

export default App;