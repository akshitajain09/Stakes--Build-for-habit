import React, { useState, useEffect } from 'react';
import { 
  Wallet, Flame, Camera, CheckCircle, AlertTriangle, 
  Plus, ChevronRight, X, Trophy, Activity, ArrowRight, Eye
} from 'lucide-react';

// --- Mock Data ---

const ACTIVE_BETS = [
  { id: 1, title: "Morning 5k Run", amount: 20, deadline: "10:00 AM", category: "Fitness", status: "pending", icon: "🏃" },
  { id: 2, title: "Read 30 Pages", amount: 10, deadline: "9:00 PM", category: "Learning", status: "verified", icon: "📚" }
];

const USER_STATS = {
  saved: 450, // Money kept by succeeding
  lost: 30,   // Money lost by failing
  streak: 14  // Days in a row
};

// --- Components ---

export default function StakesApp() {
  const [view, setView] = useState('dashboard'); // dashboard, create, verify, success
  const [bets, setBets] = useState(ACTIVE_BETS);
  const [selectedBet, setSelectedBet] = useState(null);
  const [wagerAmount, setWagerAmount] = useState(10);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  // --- Actions ---

  const handleCreateBet = (title, category, icon) => {
    const newBet = {
      id: Date.now(),
      title,
      amount: wagerAmount,
      deadline: "11:59 PM",
      category,
      status: "pending",
      icon
    };
    setBets([newBet, ...bets]);
    setView('dashboard');
  };

  const handleVerify = (bet) => {
    setSelectedBet(bet);
    setView('verify');
  };

  const runVerification = () => {
    setIsAnalyzing(true);
    // Simulate AI Vision verification
    setTimeout(() => {
      setIsAnalyzing(false);
      const updatedBets = bets.map(b => 
        b.id === selectedBet.id ? { ...b, status: 'verified' } : b
      );
      setBets(updatedBets);
      setView('success');
    }, 2000);
  };

  // --- Views ---

  const Dashboard = () => (
    <div className="flex flex-col h-full bg-zinc-950 text-white">
      {/* Header Stats */}
      <div className="p-6 bg-gradient-to-b from-zinc-900 to-zinc-950 border-b border-zinc-800">
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-black tracking-tighter italic">STAKES.</h1>
          <div className="flex items-center space-x-2 bg-zinc-800 px-3 py-1 rounded-full border border-zinc-700">
            <Wallet size={14} className="text-emerald-400" />
            <span className="text-sm font-mono font-bold">$125.00</span>
          </div>
        </header>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-zinc-900/50 p-4 rounded-2xl border border-zinc-800">
            <p className="text-zinc-500 text-xs font-bold uppercase mb-1">Money Saved</p>
            <p className="text-2xl font-bold text-emerald-400 font-mono">+${USER_STATS.saved}</p>
          </div>
          <div className="bg-zinc-900/50 p-4 rounded-2xl border border-zinc-800">
            <p className="text-zinc-500 text-xs font-bold uppercase mb-1">Current Streak</p>
            <div className="flex items-center space-x-1">
              <Flame size={20} className="text-orange-500 fill-orange-500" />
              <p className="text-2xl font-bold text-white">{USER_STATS.streak}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Active Stakes List */}
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="flex justify-between items-end mb-4">
          <h2 className="text-sm font-bold text-zinc-400 uppercase tracking-wider">Active Wagers</h2>
          <span className="text-xs text-zinc-600">Total at risk: ${bets.filter(b => b.status === 'pending').reduce((a, b) => a + b.amount, 0)}</span>
        </div>

        <div className="space-y-3">
          {bets.map(bet => (
            <div 
              key={bet.id} 
              className={`relative overflow-hidden p-4 rounded-xl border transition-all ${bet.status === 'pending' ? 'bg-zinc-900 border-zinc-800' : 'bg-emerald-900/10 border-emerald-900/50 opacity-75'}`}
            >
              <div className="flex justify-between items-center relative z-10">
                <div className="flex items-center space-x-4">
                  <div className="text-2xl">{bet.icon}</div>
                  <div>
                    <h3 className={`font-bold ${bet.status === 'verified' ? 'text-emerald-400 line-through' : 'text-white'}`}>{bet.title}</h3>
                    <p className="text-xs text-zinc-500">Deadline: {bet.deadline}</p>
                  </div>
                </div>
                
                {bet.status === 'pending' ? (
                  <div className="flex flex-col items-end space-y-2">
                    <span className="font-mono text-red-400 font-bold">-${bet.amount}</span>
                    <button 
                      onClick={() => handleVerify(bet)}
                      className="bg-zinc-100 text-black text-xs font-bold px-3 py-1.5 rounded-full hover:bg-zinc-200 active:scale-95 transition-transform flex items-center space-x-1"
                    >
                      <Camera size={12} />
                      <span>Prove It</span>
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-end">
                    <span className="font-mono text-emerald-500 font-bold">SAVED</span>
                    <CheckCircle size={16} className="text-emerald-500 mt-1" />
                  </div>
                )}
              </div>
              
              {/* Risk Gradient Background */}
              {bet.status === 'pending' && (
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 to-transparent opacity-50" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* FAB */}
      <div className="p-6 pt-0 bg-gradient-to-t from-zinc-950 to-transparent">
        <button 
          onClick={() => setView('create')}
          className="w-full bg-red-600 hover:bg-red-500 text-white font-bold text-lg py-4 rounded-2xl shadow-[0_0_20px_rgba(220,38,38,0.3)] active:scale-[0.98] transition-all flex items-center justify-center space-x-2"
        >
          <Plus size={24} />
          <span>New Stake</span>
        </button>
      </div>
    </div>
  );

  const CreateStake = () => {
    const [selectedCategory, setSelectedCategory] = useState("Fitness");
    
    return (
      <div className="flex flex-col h-full bg-zinc-950 text-white">
        <div className="p-4 flex items-center justify-between border-b border-zinc-900">
          <button onClick={() => setView('dashboard')} className="p-2 hover:bg-zinc-900 rounded-full"><X size={20} /></button>
          <span className="font-bold text-sm">Make a Pledge</span>
          <div className="w-9" /> {/* Spacer */}
        </div>

        <div className="p-8 flex-1 flex flex-col items-center">
          <div className="w-full mb-10">
            <h2 className="text-center text-zinc-500 text-sm font-bold uppercase mb-8">How much do you trust yourself?</h2>
            
            <div className="relative h-64 flex flex-col items-center justify-center">
              <div className="absolute inset-0 bg-red-500/5 rounded-full blur-3xl animate-pulse" />
              <span className="text-8xl font-black font-mono tracking-tighter text-white z-10">${wagerAmount}</span>
              <p className="text-red-500 font-bold mt-2 flex items-center space-x-1">
                <AlertTriangle size={14} />
                <span>At Risk</span>
              </p>
            </div>

            <input 
              type="range" 
              min="5" 
              max="100" 
              step="5" 
              value={wagerAmount}
              onChange={(e) => setWagerAmount(parseInt(e.target.value))}
              className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-red-600"
            />
            <div className="flex justify-between text-zinc-600 text-xs font-mono mt-2">
              <span>$5</span>
              <span>$100+</span>
            </div>
          </div>

          <div className="w-full space-y-3">
             <p className="text-zinc-500 text-xs font-bold uppercase">Choose Habit</p>
             <button 
               onClick={() => handleCreateBet("Evening Workout", "Fitness", "🏋️")}
               className="w-full p-4 bg-zinc-900 border border-zinc-800 rounded-xl flex items-center justify-between hover:border-zinc-600 transition-colors"
             >
               <span className="font-bold">🏋️ Evening Workout</span>
               <ChevronRight size={16} className="text-zinc-600" />
             </button>
             <button 
               onClick={() => handleCreateBet("Cold Shower", "Health", "🚿")}
               className="w-full p-4 bg-zinc-900 border border-zinc-800 rounded-xl flex items-center justify-between hover:border-zinc-600 transition-colors"
             >
               <span className="font-bold">🚿 Cold Shower</span>
               <ChevronRight size={16} className="text-zinc-600" />
             </button>
             <button 
               onClick={() => handleCreateBet("No Sugar", "Health", "🍬")}
               className="w-full p-4 bg-zinc-900 border border-zinc-800 rounded-xl flex items-center justify-between hover:border-zinc-600 transition-colors"
             >
               <span className="font-bold">🍬 No Sugar</span>
               <ChevronRight size={16} className="text-zinc-600" />
             </button>
          </div>
        </div>
      </div>
    );
  };

  const Verify = () => (
    <div className="h-full bg-black text-white relative flex flex-col">
      {/* Mock Camera View */}
      <div className="flex-1 bg-zinc-900 relative overflow-hidden flex items-center justify-center">
         {/* Grid lines to simulate camera UI */}
         <div className="absolute inset-0 border-[20px] border-black/50 z-10 pointer-events-none" />
         <div className="absolute top-1/3 w-full h-px bg-white/20" />
         <div className="absolute bottom-1/3 w-full h-px bg-white/20" />
         <div className="absolute left-1/3 h-full w-px bg-white/20" />
         <div className="absolute right-1/3 h-full w-px bg-white/20" />

         <p className="text-zinc-500">Camera Active</p>

         {isAnalyzing && (
           <div className="absolute inset-0 bg-emerald-500/20 z-20 flex items-center justify-center backdrop-blur-sm">
             <div className="flex flex-col items-center animate-pulse">
               <Activity size={48} className="text-emerald-400 mb-4" />
               <span className="text-xl font-bold font-mono tracking-widest text-emerald-400">ANALYZING...</span>
             </div>
           </div>
         )}
      </div>

      <div className="h-48 bg-black p-6 flex flex-col items-center justify-center">
        {!isAnalyzing ? (
          <>
            <p className="text-zinc-400 text-sm mb-6 text-center">Take a photo of your running shoes to verify <br/><span className="text-white font-bold">"{selectedBet?.title}"</span></p>
            <button 
              onClick={runVerification}
              className="w-20 h-20 rounded-full border-4 border-white flex items-center justify-center group active:scale-95 transition-transform"
            >
              <div className="w-16 h-16 bg-white rounded-full group-hover:bg-red-600 transition-colors" />
            </button>
          </>
        ) : (
           <p className="text-zinc-500 text-sm animate-pulse">Verifying proof...</p>
        )}
      </div>

      <button onClick={() => setView('dashboard')} className="absolute top-6 left-6 z-30 p-2 bg-black/50 rounded-full backdrop-blur-md">
        <X size={20} />
      </button>
    </div>
  );

  const Success = () => (
    <div className="h-full bg-emerald-600 text-white flex flex-col items-center justify-center p-8 text-center relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20" />
      
      <div className="relative z-10 flex flex-col items-center">
        <div className="w-24 h-24 bg-white text-emerald-600 rounded-full flex items-center justify-center mb-6 shadow-2xl animate-bounce">
          <Trophy size={48} fill="currentColor" />
        </div>
        
        <h2 className="text-4xl font-black italic tracking-tighter mb-2">SAFE.</h2>
        <p className="text-emerald-100 font-medium mb-8 max-w-xs">
          You kept your <span className="font-bold text-white">${selectedBet?.amount}</span>. Your streak is safe.
        </p>

        <button 
          onClick={() => setView('dashboard')}
          className="bg-white text-emerald-900 font-bold px-8 py-4 rounded-full shadow-lg hover:bg-emerald-50 transition-colors flex items-center space-x-2"
        >
          <span>Return to Dashboard</span>
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );

  return (
    <div className="h-full bg-zinc-950 font-sans overflow-hidden sm:rounded-3xl shadow-2xl max-w-md mx-auto border border-zinc-800">
      {view === 'dashboard' && <Dashboard />}
      {view === 'create' && <CreateStake />}
      {view === 'verify' && <Verify />}
      {view === 'success' && <Success />}
    </div>
  );
}