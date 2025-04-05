import React, { useState } from 'react';
import { Coins, RefreshCcw } from 'lucide-react';
import "./css/Account.css";

function Account() {
  const [amount, setAmount] = useState('');
  const [isSpinning, setIsSpinning] = useState(false);
  const [result, setResult] = useState(null);
  const [isWalletConnected, setIsWalletConnected] = useState(false);

  const betAmounts = [0.1, 0.25, 0.5, 1, 2, 3, 4, 5];

  const handleBet = () => {
    if (!amount || parseFloat(amount) <= 0) return;
    if (!isWalletConnected) return;
    
    setIsSpinning(true);
    setResult(null);
    
    // Simulate betting result after 2 seconds
    setTimeout(() => {
      const win = Math.random() >= 0.5;
      setResult(win ? 'win' : 'lose');
      setIsSpinning(false);
    }, 2000);
  };

  return (
    <div className="container min-vh-100 d-flex align-items-center justify-content-center py-4">
      <div className="betting-card p-4 p-md-5" style={{ maxWidth: '32rem' }}>
        <h1 className="text-center mb-4 fw-bold">Double or Nothing</h1>
        
        <div className="d-flex flex-column gap-4">
          {/* Wallet Connection (Dummy) */}
          <div className="d-flex justify-content-center">
            <button
              onClick={() => setIsWalletConnected(!isWalletConnected)}
              className={`btn wallet-btn px-4 py-2 ${isWalletConnected ? 'connected' : ''}`}
            >
              <Coins className="me-2" size={20} />
              {isWalletConnected ? 'Wallet Connected' : 'Connect Wallet'}
            </button>
          </div>

          {/* Bet Amount Buttons */}
          <div className="d-flex flex-wrap gap-2 justify-content-center">
            {betAmounts.map((betAmount) => (
              <button
                key={betAmount}
                onClick={() => setAmount(betAmount.toString())}
                className={`btn bet-amount-btn ${amount === betAmount.toString() ? 'active' : ''}`}
              >
                {betAmount} SOL
              </button>
            ))}
          </div>

          {/* Bet Button */}
          <button
            onClick={handleBet}
            disabled={isSpinning || !amount || parseFloat(amount) <= 0 || !isWalletConnected}
            className="btn place-bet-btn d-flex align-items-center justify-content-center gap-2 py-3"
          >
            {isSpinning ? (
              <>
                <RefreshCcw className="spinner" size={20} />
                Betting...
              </>
            ) : (
              !isWalletConnected ? 'Connect Wallet to Bet' : 'Place Bet'
            )}
          </button>

          {/* Result Display */}
          {result && (
            <div className={`result-box ${result}`}>
              {result === 'win' ? (
                <>
                  <p className="fs-5 fw-bold mb-2 text-center">Congratulations! 🎉</p>
                  <p className="mb-0 text-center">You won {(parseFloat(amount) * 2).toFixed(2)} SOL!</p>
                </>
              ) : (
                <>
                  <p className="fs-5 fw-bold mb-2 text-center">Better luck next time! 😔</p>
                  <p className="mb-0 text-center">You lost {amount} SOL</p>
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

export default Account;