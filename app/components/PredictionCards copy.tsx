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
  countdown?: n      {/* Navigation Arrows - Vertical */}
      <div className="flex justify-center gap-8 my-4">
        <button
          onClick={slideUp}
          className="w-10 h-10 rounded-full bg-[#0052FF]/20 hover:bg-[#0052FF]/40 flex items-center justify-center text-white text-lg transition-all border border-[#0052FF]/30 rotate-90"
        >
          ›
        </button>
        <button
          onClick={slideDown}
          className="w-10 h-10 rounded-full bg-[#0052FF]/20 hover:bg-[#0052FF]/40 flex items-center justify-center text-white text-lg transition-all border border-[#0052FF]/30 rotate-90"
        >
          ‹
        </button>
      </div>rts?: number;
  upPool: number;
  downPool: number;
  upUsers: number;
  downUsers: number;
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

  const cardScale = isCenter ? "scale-105" : "scale-95";
  const cardOpacity = isCenter ? "opacity-100" : "opacity-75";

  return (
    <div className={`relative rounded-2xl border-2 p-4 backdrop-blur-md transition-all duration-500 ${cardScale} ${cardOpacity} bg-[var(--app-card-bg)] ${getStatusColor()} shadow-xl h-full min-h-[300px] max-h-[400px] overflow-hidden`}>
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
      <div className="mt-12 space-y-4 h-full flex flex-col">
        {/* Price Section */}
        <div className="text-center">
          {round.status === "expired" && round.lockedPrice ? (
            <>
              <div className="text-xs text-gray-400 uppercase">Closed Price</div>
              <div className="text-xl font-bold text-white">{formatPrice(round.lockedPrice)}</div>
            </>
          ) : round.status === "live" && round.lockedPrice ? (
            <>
              <div className="text-xs text-gray-400 uppercase">Last Price</div>
              <div className="text-xl font-bold text-white">{formatPrice(round.currentPrice)}</div>
              <div className="text-xs text-gray-400 mt-1">
                Locked: {formatPrice(round.lockedPrice)}
              </div>
            </>
          ) : (
            <>
              <div className="text-xs text-gray-400 uppercase">Current Price</div>
              <div className="text-xl font-bold text-white">{formatPrice(round.currentPrice)}</div>
            </>
          )}
        </div>

        {/* Prize Pool */}
        <div className="text-center">
          <div className="text-xs text-gray-400">Prize Pool:</div>
          <div className="text-sm font-bold text-yellow-400">{round.prizePool.toFixed(4)} ETH</div>
        </div>

        {/* Pool Values and User Counts */}
        <div className="grid grid-cols-2 gap-2 text-center">
          <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-2">
            <div className="text-xs text-green-400 font-semibold">UP Pool</div>
            <div className="text-sm font-bold text-green-300">{round.upPool.toFixed(3)} ETH</div>
            <div className="text-xs text-gray-400">{round.upUsers} users</div>
          </div>
          <div className="bg-pink-500/10 border border-pink-500/30 rounded-lg p-2">
            <div className="text-xs text-pink-400 font-semibold">DOWN Pool</div>
            <div className="text-sm font-bold text-pink-300">{round.downPool.toFixed(3)} ETH</div>
            <div className="text-xs text-gray-400">{round.downUsers} users</div>
          </div>
        </div>

        {/* User Choice Display */}
        {userChoice && (
          <div className="bg-[#0052FF]/20 border border-[#0052FF]/50 rounded-lg p-2 text-center">
            <div className="text-xs text-gray-400">Your Choice</div>
            <div className={`text-sm font-bold ${userChoice.direction === "up" ? "text-green-400" : "text-pink-400"}`}>
              {userChoice.direction.toUpperCase()} - {userChoice.amount} ETH
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex-1 flex flex-col justify-end">
          {round.status === "next" && !userChoice && (
            <div className="space-y-2">
              <Button
                onClick={() => onPredict(round.id, "up")}
                className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-3 rounded-lg transition-all transform hover:scale-105 shadow-lg"
              >
                <div className="text-center">
                  <div className="text-lg font-bold">UP</div>
                  <div className="text-xs opacity-90">{formatPayout(round.upPayout)}</div>
                </div>
              </Button>
              <Button
                onClick={() => onPredict(round.id, "down")}
                className="w-full bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white font-bold py-3 rounded-lg transition-all transform hover:scale-105 shadow-lg"
              >
                <div className="text-center">
                  <div className="text-lg font-bold">DOWN</div>
                  <div className="text-xs opacity-90">{formatPayout(round.downPayout)}</div>
                </div>
              </Button>
            </div>
          )}

          {round.status === "live" && (
            <div className="space-y-2">
              <div className={`rounded-lg p-2 text-center ${userChoice?.direction === "up" ? "bg-green-600/30 border border-green-400" : "bg-green-600/20"}`}>
                <div className="text-sm font-bold text-green-400">UP</div>
                <div className="text-xs text-gray-400">{formatPayout(round.upPayout)}</div>
                {userChoice?.direction === "up" && (
                  <div className="text-xs text-green-300">Bet: {userChoice.amount} ETH</div>
                )}
              </div>
              <div className={`rounded-lg p-2 text-center ${userChoice?.direction === "down" ? "bg-pink-600/30 border border-pink-400" : "bg-pink-600/20"}`}>
                <div className="text-sm font-bold text-pink-400">DOWN</div>
                <div className="text-xs text-gray-400">{formatPayout(round.downPayout)}</div>
                {userChoice?.direction === "down" && (
                  <div className="text-xs text-pink-300">Bet: {userChoice.amount} ETH</div>
                )}
              </div>
            </div>
          )}

          {(round.status === "later" || round.status === "expired") && (
            <div className="space-y-2 opacity-60">
              <div className="bg-gray-600/20 rounded-lg p-2 text-center">
                <div className="text-sm font-bold text-gray-400">UP</div>
                <div className="text-xs text-gray-500">{formatPayout(round.upPayout)}</div>
              </div>
              <div className="bg-gray-600/20 rounded-lg p-2 text-center">
                <div className="text-sm font-bold text-gray-400">DOWN</div>
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
      upPool: 8.234,
      downPool: 7.672,
      upUsers: 23,
      downUsers: 18,
    },
    {
      id: "410432",
      status: "expired", 
      currentPrice: livePrice,
      lockedPrice: livePrice + 0.3025,
      prizePool: 14.895,
      upPayout: 1.58,
      downPayout: 2.79,
      upPool: 9.423,
      downPool: 5.472,
      upUsers: 31,
      downUsers: 12,
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
      upPool: 10.156,
      downPool: 8.868,
      upUsers: 42,
      downUsers: 28,
    },
    {
      id: "410434",
      status: "next",
      currentPrice: livePrice,
      prizePool: 0.0001,
      upPayout: 2.1,
      downPayout: 1.9,
      upPool: 0.00005,
      downPool: 0.00005,
      upUsers: 0,
      downUsers: 0,
    },
    {
      id: "410435",
      status: "later",
      currentPrice: livePrice,
      prizePool: 0,
      upPayout: 2.0,
      downPayout: 2.0,
      entryStarts: 359,
      upPool: 0,
      downPool: 0,
      upUsers: 0,
      downUsers: 0,
    },
  ]);

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

  const slideToCard = (index: number) => {
    setCurrentIndex(index);
  };

  const slideUp = () => {
    setCurrentIndex((prev) => (prev - 1 + rounds.length) % rounds.length);
  };

  const slideDown = () => {
    setCurrentIndex((prev) => (prev + 1) % rounds.length);
  };

  const getUserChoice = (roundId: string): UserChoice | undefined => {
    return userChoices.find(choice => choice.roundId === roundId);
  };

  return (
    <div className="w-full h-screen max-w-sm mx-auto px-4 py-8 flex flex-col">
      {/* Top Stats - User Choices Summary */}
      <div className="mb-4 bg-[var(--app-card-bg)] rounded-xl border border-gray-600/30 p-3">
        <div className="text-xs text-gray-400 text-center mb-2">Live Round Stats</div>
        <div className="grid grid-cols-2 gap-3">
          <div className="text-center bg-green-500/10 border border-green-500/30 rounded-lg p-2">
            <div className="text-lg font-bold text-green-400">{rounds.find(r => r.status === "live")?.upUsers || 0}</div>
            <div className="text-xs text-green-300">UP Bets</div>
            <div className="text-xs text-gray-400">{(rounds.find(r => r.status === "live")?.upPool || 0).toFixed(3)} ETH</div>
          </div>
          <div className="text-center bg-pink-500/10 border border-pink-500/30 rounded-lg p-2">
            <div className="text-lg font-bold text-pink-400">{rounds.find(r => r.status === "live")?.downUsers || 0}</div>
            <div className="text-xs text-pink-300">DOWN Bets</div>
            <div className="text-xs text-gray-400">{(rounds.find(r => r.status === "live")?.downPool || 0).toFixed(3)} ETH</div>
          </div>
        </div>
      </div>

      {/* Header - Compact for Mobile */}
      <div className="flex items-center justify-center mb-6">
        <div className="flex items-center gap-3">
          <EthIcon className="w-8 h-8" />
          <div className="text-center">
            <div className="text-white font-bold text-lg">ETH/USD</div>
            <div className="flex items-center gap-2">
              <div className="text-[#0052FF] font-bold text-base">
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
      </div>

      {/* Vertical Carousel Container */}
      <div className="flex-1 relative overflow-hidden">
        <div 
          className="flex flex-col transition-transform duration-500 ease-out"
          style={{
            transform: `translateY(calc(-${currentIndex * 100/3}% + ${100/6}%))`,
          }}
        >
          {rounds.map((round, index) => {
            const isCenter = index === currentIndex;
            const userChoice = getUserChoice(round.id);
            
            // Variable scaling and opacity for mobile vertical layout
            const getCardClasses = () => {
              const distance = Math.abs(index - currentIndex);
              if (distance === 0) {
                return "scale-100 opacity-100 z-10"; // Center card
              } else if (distance === 1) {
                return "scale-85 opacity-70 z-5"; // Adjacent cards
              } else {
                return "scale-75 opacity-40 z-0"; // Far cards
              }
            };
            
            return (
              <div
                key={round.id}
                className={`h-1/3 flex-shrink-0 px-2 py-3 transition-all duration-500 ${getCardClasses()}`}
                onClick={() => slideToCard(index)}
                style={{ cursor: 'pointer' }}
              >
                <div className="h-full">
                  <PredictionCard 
                    round={{...round, currentPrice: livePrice}} 
                    onPredict={handlePredict} 
                    userChoice={userChoice}
                    isCenter={isCenter}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Navigation Arrows - Vertical */}
      <div className="flex justify-center gap-8 my-4">
        <button
          onClick={slideLeft}
          disabled={currentIndex === 0}
          className="w-10 h-10 rounded-full bg-[#0052FF]/20 hover:bg-[#0052FF]/40 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center text-white text-lg transition-all border border-[#0052FF]/30 rotate-90"
        >
          ›
        </button>
        <button
          onClick={slideRight}
          disabled={currentIndex === rounds.length - 1}
          className="w-10 h-10 rounded-full bg-[#0052FF]/20 hover:bg-[#0052FF]/40 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center text-white text-lg transition-all border border-[#0052FF]/30 rotate-90"
        >
          ‹
        </button>
      </div>

      {/* Dots Indicator - Vertical Style */}
      <div className="flex justify-center gap-2">
        {rounds.map((_, index) => (
          <button
            key={index}
            onClick={() => slideToCard(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentIndex 
                ? "bg-[#0052FF] h-6" 
                : "bg-gray-600 hover:bg-gray-500"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
