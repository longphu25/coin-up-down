import { useState, useEffect } from 'react';

interface CoinGeckoPrice {
  ethereum: {
    usd: number;
    usd_24h_change: number;
  };
}

export function useEthPrice() {
  const [price, setPrice] = useState<number>(3856.5453);
  const [change24h, setChange24h] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPrice = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          'https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd&include_24hr_change=true'
        );
        
        if (!response.ok) {
          throw new Error('Failed to fetch price');
        }
        
        const data: CoinGeckoPrice = await response.json();
        setPrice(data.ethereum.usd);
        setChange24h(data.ethereum.usd_24h_change);
        setError(null);
      } catch (err) {
        console.error('Error fetching ETH price:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
        // Keep using fallback price if API fails
      } finally {
        setLoading(false);
      }
    };

    // Fetch immediately
    fetchPrice();

    // Set up interval to fetch every 30 seconds
    const interval = setInterval(fetchPrice, 30000);

    return () => clearInterval(interval);
  }, []);

  return { price, change24h, loading, error };
}
