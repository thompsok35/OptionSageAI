
import { StockFundamentalAnalysis } from '../types';

const TRADIER_API_URL = 'https://api.tradier.com/v1';

export const getTradierData = async (symbol: string, apiKey: string): Promise<Partial<StockFundamentalAnalysis>> => {
  try {
    const headers = {
      'Authorization': `Bearer ${apiKey}`,
      'Accept': 'application/json'
    };

    // 1. Fetch Quote Data (Price, Volume, 52-Week Range)
    const quoteResponse = await fetch(`${TRADIER_API_URL}/markets/quotes?symbols=${symbol}`, { headers });
    
    if (!quoteResponse.ok) {
      throw new Error(`Tradier API Error: ${quoteResponse.statusText}`);
    }

    const quoteJson = await quoteResponse.json();
    const quote = quoteJson.quotes?.quote;

    if (!quote) {
      throw new Error("Symbol not found in Tradier");
    }

    // 2. Map Tradier Data to our Interface
    // Note: Tradier Quotes provide high-level data. 
    // Deep fundamental data (PE, Debt/Equity) often requires a separate 'fundamentals' endpoint 
    // which may require specific permissions. We map what is available in standard quotes.

    return {
      symbol: quote.symbol,
      name: quote.description || symbol,
      avgVolume: quote.average_volume ? formatNumber(quote.average_volume) : 'N/A',
      range52Week: `${formatCurrency(quote.week_52_low)} - ${formatCurrency(quote.week_52_high)}`,
      // Tradier quotes sometimes include these, sometimes not depending on the feed
      // We will leave others as empty strings to let the user or AI fill the gaps if needed, 
      // or we could fallback to AI for the missing pieces in a hybrid approach.
    };

  } catch (error) {
    console.error("Tradier Service Error:", error);
    throw error;
  }
};

// Helper to format large numbers (e.g. 1500000 -> 1.5M)
const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(2) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(2) + 'K';
  }
  return num.toString();
};

const formatCurrency = (num: number): string => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(num);
};
