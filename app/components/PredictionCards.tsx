"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "./DemoComponents";
import { EthIcon } from "./EthIcon";
import { useEthPrice } from "@/lib/useEthPrice";

interface PredictionRound {
  id: string;
  status: "expired" | "live" | "next" | "later";
  currentPrice: number;
  lockedPrice?: number;
  prizePool: number;
  upPayout: number;
  downPayout: number;
  countdown?: number;
  entryStarts?: number;
}

interface UserChoice {
  roundId: string;
  direction: "up" | "down";
  amount: number;
}

interface PredictionCardProps {
  round: PredictionRound;
  onPredict: (roundId: string, direction: "up" | "down") => void;
  userChoice?: UserChoice;
  isCenter: boolean;
}

function PredictionCard({ round, onPredict, userChoice, isCenter }: PredictionCardProps) {
  const [timeLeft, setTimeLeft] = useState(round.countdown || 0);

  useEffect(() => {
    if (round.status === "live" && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => Math.max(0, prev - 1));
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [round.status, timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const formatPrice = (price: number) => `$${price.toFixed(4)}`;
  const formatPayout = (multiplier: number) => `${multiplier.toFixed(2)}x Payout`;

  const getStatusColor = () => {
    switch (round.status) {
      case "live":
        return "border-green-400 bg-green-500/10 shadow-green-500/20";
      case "next":
        return "border-[#0052FF] bg-[#0052FF]/10 shadow-[#0052FF]/30";
      case "later":
        return "border-gray-500 bg-gray-500/10 shadow-gray-500/20";
      case "expired":
        return "border-red-400 bg-red-500/10 shadow-red-500/20";
      default:
        return "border-gray-500 bg-gray-500/10";
    }
  };

  const getStatusLabel = () => {
    switch (round.status) {
      case "live":
        return "LIVE";
      case "next":
        return "Next";
      case "later":
        return "Later";
      case "expired":
        return "Expired";
      default:
        return "";
    }
  };

  const cardScale = isCenter ? "scale-100" : "scale-90";
  const cardOpacity = isCenter ? "opacity-100" : "opacity-70";

  return (
    <div className={`relative rounded-2xl border-2 p-4 backdrop-blur-md transition-all duration-500 ${cardScale} ${cardOpacity} bg-[var(--app-card-bg)] ${getStatusColor()} shadow-lg h-full flex flex-col`}>
      {/* Status Badge */}
      <div className="absolute top-3 left-3 flex items-center gap-2">
        <div className={`w-2 h-2 rounded-full ${round.status === "live" ? "bg-green-400 animate-pulse" : round.status === "next" ? "bg-[#0052FF]" : "bg-gray-400"}`} />
        <span className="text-xs font-bold text-white uppercase">{getStatusLabel()}</span>
        <span className="text-xs text-gray-400">#{round.id}</span>
      </div>

      {/* Timer */}
      {round.status === "live" && (
        <div className="absolute top-3 right-3 text-right">
          <div className="text-xs text-gray-400">Entry starts</div>
          <div className="text-sm font-mono text-white">{formatTime(timeLeft)}</div>
        </div>
      )}

      {round.status === "later" && round.entryStarts && (
        <div className="absolute top-3 right-3 text-right">
          <div className="text-xs text-gray-400">Entry starts</div>
          <div className="text-sm font-mono text-white">{formatTime(round.entryStarts)}</div>
        </div>
      )}

      {/* Main Content */}
      <div className="mt-10 flex-1 flex flex-col justify-between space-y-3">
        {/* Price Section */}
        <div className="text-center">
          {round.status === "expired" && round.lockedPrice ? (
            <>
              <div className="text-xs text-gray-400 uppercase">Closed Price</div>
              <div className="text-2xl font-bold text-white">{formatPrice(round.lockedPrice)}</div>
            </>
          ) : round.status === "live" && round.lockedPrice ? (
            <>
              <div className="text-xs text-gray-400 uppercase">Last Price</div>
              <div className="text-2xl font-bold text-white">{formatPrice(round.currentPrice)}</div>
              <div className="text-xs text-gray-400 mt-1">
                Locked: {formatPrice(round.lockedPrice)}
              </div>
            </>
          ) : (
            <>
              <div className="text-xs text-gray-400 uppercase">Current Price</div>
              <div className="text-2xl font-bold text-white">{formatPrice(round.currentPrice)}</div>
            </>
          )}
        </div>

        {/* Prize Pool */}
        <div className="text-center">
          <div className="text-xs text-gray-400">Prize Pool:</div>
          <div className="text-lg font-bold text-yellow-400">{round.prizePool.toFixed(4)} ETH</div>
        </div>

        {/* User Choice Display */}
        {userChoice && (
          <div className="bg-[#0052FF]/20 border border-[#0052FF]/50 rounded-lg p-3 text-center">
            <div className="text-xs text-gray-400">Your Choice</div>
            <div className={`text-lg font-bold ${userChoice.direction === "up" ? "text-green-400" : "text-pink-400"}`}>
              {userChoice.direction.toUpperCase()} - {userChoice.amount} ETH
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-auto">
          {round.status === "next" && !userChoice && (
            <div className="space-y-3">
              <Button
                onClick={() => onPredict(round.id, "up")}
                className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-4 rounded-xl transition-all transform hover:scale-105 shadow-lg"
              >
                <div className="text-center">
                  <div className="text-2xl font-bold">UP</div>
                  <div className="text-sm opacity-90">{formatPayout(round.upPayout)}</div>
                </div>
              </Button>
              <Button
                onClick={() => onPredict(round.id, "down")}
                className="w-full bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white font-bold py-4 rounded-xl transition-all transform hover:scale-105 shadow-lg"
              >
                <div className="text-center">
                  <div className="text-2xl font-bold">DOWN</div>
                  <div className="text-sm opacity-90">{formatPayout(round.downPayout)}</div>
                </div>
              </Button>
            </div>
          )}

          {round.status === "live" && (
            <div className="space-y-2">
              <div className={`rounded-lg p-3 text-center ${userChoice?.direction === "up" ? "bg-green-600/30 border border-green-400" : "bg-green-600/20"}`}>
                <div className="text-lg font-bold text-green-400">UP</div>
                <div className="text-xs text-gray-400">{formatPayout(round.upPayout)}</div>
                {userChoice?.direction === "up" && (
                  <div className="text-xs text-green-300 mt-1">Your bet: {userChoice.amount} ETH</div>
                )}
              </div>
              <div className={`rounded-lg p-3 text-center ${userChoice?.direction === "down" ? "bg-pink-600/30 border border-pink-400" : "bg-pink-600/20"}`}>
                <div className="text-lg font-bold text-pink-400">DOWN</div>
                <div className="text-xs text-gray-400">{formatPayout(round.downPayout)}</div>
                {userChoice?.direction === "down" && (
                  <div className="text-xs text-pink-300 mt-1">Your bet: {userChoice.amount} ETH</div>
                )}
              </div>
            </div>
          )}

          {(round.status === "later" || round.status === "expired") && (
            <div className="space-y-2 opacity-60">
              <div className="bg-gray-600/20 rounded-lg p-3 text-center">
                <div className="text-lg font-bold text-gray-400">UP</div>
                <div className="text-xs text-gray-500">{formatPayout(round.upPayout)}</div>
              </div>
              <div className="bg-gray-600/20 rounded-lg p-3 text-center">
                <div className="text-lg font-bold text-gray-400">DOWN</div>
                <div className="text-xs text-gray-500">{formatPayout(round.downPayout)}</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function PredictionCards() {
  const [currentIndex, setCurrentIndex] = useState(2); // Start with the "live" card centered
  const [userChoices, setUserChoices] = useState<UserChoice[]>([]);
  const { price: livePrice, change24h, loading } = useEthPrice();
  
  const [rounds] = useState<PredictionRound[]>([
    {
      id: "410431",
      status: "expired",
      currentPrice: livePrice,
      lockedPrice: livePrice - 0.3278,
      prizePool: 15.906,
      upPayout: 1.94,
      downPayout: 2.06,
    },
    {
      id: "410432",
      status: "expired", 
      currentPrice: livePrice,
      lockedPrice: livePrice + 0.3025,
      prizePool: 14.895,
      upPayout: 1.58,
      downPayout: 2.79,
    },
    {
      id: "410433",
      status: "live",
      currentPrice: livePrice,
      lockedPrice: livePrice - 0.0071,
      prizePool: 19.024,
      upPayout: 1.87,
      downPayout: 2.15,
      countdown: 219,
    },
    {
      id: "410434",
      status: "next",
      currentPrice: livePrice,
      prizePool: 0.0001,
      upPayout: 2.1,
      downPayout: 1.9,
    },
    {
      id: "410435",
      status: "later",
      currentPrice: livePrice,
      prizePool: 0,
      upPayout: 2.0,
      downPayout: 2.0,
      entryStarts: 359,
    },
  ]);

  // Get statistics for header
  const getTotalStats = () => {
    const upChoices = userChoices.filter(choice => choice.direction === "up");
    const downChoices = userChoices.filter(choice => choice.direction === "down");
    const totalUpPool = rounds.reduce((sum, round) => sum + (round.prizePool * 0.6), 0); // Estimate 60% for up
    const totalDownPool = rounds.reduce((sum, round) => sum + (round.prizePool * 0.4), 0); // Estimate 40% for down
    
    return {
      upCount: upChoices.length,
      downCount: downChoices.length,
      upPool: totalUpPool,
      downPool: totalDownPool,
      totalPool: rounds.reduce((sum, round) => sum + round.prizePool, 0)
    };
  };

  const stats = getTotalStats();

  const handlePredict = useCallback((roundId: string, direction: "up" | "down") => {
    const amount = 0.001; // Default bet amount
    const newChoice: UserChoice = {
      roundId,
      direction,
      amount,
    };
    
    setUserChoices(prev => {
      const filtered = prev.filter(choice => choice.roundId !== roundId);
      return [...filtered, newChoice];
    });
    
    console.log(`Predict ${direction} for round ${roundId} with ${amount} ETH`);
  }, []);

  // Infinite scroll handlers
  const slideUp = () => {
    setCurrentIndex((prev) => {
      const newIndex = prev - 1;
      if (newIndex < 0) {
        return rounds.length - 1; // Go to last item
      }
      return newIndex;
    });
  };

  const slideDown = () => {
    setCurrentIndex((prev) => {
      const newIndex = prev + 1;
      if (newIndex >= rounds.length) {
        return 0; // Go to first item
      }
      return newIndex;
    });
  };

  const slideToCard = (index: number) => {
    setCurrentIndex(Math.max(0, Math.min(index, rounds.length - 1)));
  };

  const getUserChoice = (roundId: string): UserChoice | undefined => {
    return userChoices.find(choice => choice.roundId === roundId);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Statistics Header */}
      <div className="bg-gradient-to-r from-[#0052FF]/20 to-purple-600/20 rounded-2xl p-4 mb-6 border border-[#0052FF]/30">
        <div className="text-center mb-3">
          <div className="text-white font-bold text-lg">Total Pool</div>
          <div className="text-yellow-400 font-bold text-2xl">{stats.totalPool.toFixed(4)} ETH</div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          {/* UP Statistics */}
          <div className="bg-green-500/20 rounded-xl p-3 border border-green-400/30">
            <div className="text-center">
              <div className="text-green-400 font-bold text-lg">UP</div>
              <div className="text-white text-sm">Users: {stats.upCount}</div>
              <div className="text-green-300 font-semibold">{stats.upPool.toFixed(4)} ETH</div>
            </div>
          </div>
          
          {/* DOWN Statistics */}
          <div className="bg-pink-500/20 rounded-xl p-3 border border-pink-400/30">
            <div className="text-center">
              <div className="text-pink-400 font-bold text-lg">DOWN</div>
              <div className="text-white text-sm">Users: {stats.downCount}</div>
              <div className="text-pink-300 font-semibold">{stats.downPool.toFixed(4)} ETH</div>
            </div>
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between mb-6 px-1">
        <div className="flex items-center gap-3">
          <EthIcon className="w-10 h-10" />
          <div>
            <div className="text-white font-bold text-lg">ETH/USD</div>
            <div className="flex items-center gap-2">
              <div className="text-[#0052FF] font-bold text-sm">
                {loading ? "Loading..." : `$${livePrice.toFixed(4)}`}
              </div>
              {!loading && (
                <div className={`text-xs font-semibold ${change24h >= 0 ? "text-green-400" : "text-red-400"}`}>
                  {change24h >= 0 ? "+" : ""}{change24h.toFixed(2)}%
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={slideUp}
            className="w-10 h-10 rounded-full bg-[#0052FF]/20 hover:bg-[#0052FF]/40 flex items-center justify-center text-white text-lg transition-all border border-[#0052FF]/30"
          >
            ‹
          </button>
          <button
            onClick={slideDown}
            className="w-10 h-10 rounded-full bg-[#0052FF]/20 hover:bg-[#0052FF]/40 flex items-center justify-center text-white text-lg transition-all border border-[#0052FF]/30"
          >
            ›
          </button>
        </div>
      </div>

      {/* Horizontal Cards Container - Center Mode with 1 visible card */}
      <div className="relative overflow-hidden">
        <div
          className="flex transition-transform duration-500 ease-out"
          style={{
            transform: `translateX(calc(-${currentIndex * 100}%))`,
          }}
        >
          {rounds.map((round, index) => {
            const isCenter = index === currentIndex;
            const originalRoundId = round.id;
            const userChoice = getUserChoice(originalRoundId);
            
            return (
              <div
                key={`${round.id}-${index}`}
                className="w-full flex-shrink-0 px-2"
                onClick={() => slideToCard(index)}
              >
                <PredictionCard 
                  round={{...round, currentPrice: livePrice}} 
                  onPredict={handlePredict} 
                  userChoice={userChoice}
                  isCenter={isCenter}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Dots Indicator */}
      <div className="flex justify-center gap-2 mt-6">
        {rounds.map((_, index) => (
          <button
            key={index}
            onClick={() => slideToCard(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentIndex 
                ? "bg-[#0052FF] w-6" 
                : "bg-gray-600 hover:bg-gray-500"
            }`}
          />
        ))}
      </div>
    </div>
  );
}