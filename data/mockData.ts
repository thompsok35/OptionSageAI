
import { CourseModule } from '../types';

export const COURSES: CourseModule[] = [
  // --- LEVEL 1: Due Diligence ---
  {
    id: 'oa-1.0',
    title: '1.0 OptionsANIMAL Orientation',
    category: 'Orientation',
    level: 1,
    duration: '25 min',
    thumbnail: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&auto=format&fit=crop&q=60', // Classroom/Library
    description: 'Welcome to the program. An overview of the 8 Levels of education, the proprietary method, and how to navigate the education center.',
    mockTranscript: `Welcome to the OptionsANIMAL Orientation. This program is designed to take you from a novice to a professional grade trader... (Full transcript truncated for brevity)`
  },
  {
    id: 'oa-1.1',
    title: '1.1 The OptionsANIMAL Method',
    category: 'Live Class Archives',
    level: 1,
    duration: '55 min',
    thumbnail: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&auto=format&fit=crop&q=60', // Strategy/Planning
    description: 'Understand the core philosophy: Capital Preservation, Spread Trading, and the Secondary Exit Strategy.',
    mockTranscript: `The OptionsANIMAL method is distinct. We do not gamble. We trade... (Full transcript truncated for brevity)`
  },
  {
    id: 'oa-1.2',
    title: '1.2 Stock Market Basics',
    category: 'Live Class Archives',
    level: 1,
    duration: '48 min',
    thumbnail: 'https://images.unsplash.com/photo-1611974765270-ca1258634369?w=800&auto=format&fit=crop&q=60', // Stock Market Ticker
    description: 'Market mechanics, order types, and understanding Bid/Ask spreads.',
    mockTranscript: `Let's cover the basics. What is a Stock? What is an Option?... (Full transcript truncated for brevity)`
  },
  {
    id: 'oa-1.3',
    title: '1.3 Fundamental Analysis',
    category: 'Live Class Archives',
    level: 1,
    duration: '60 min',
    thumbnail: 'https://images.unsplash.com/photo-1554224155-984067941747?w=800&auto=format&fit=crop&q=60', // Financial Documents
    description: 'Evaluating a company’s intrinsic value by examining related economic and financial factors.',
    mockTranscript: `
      Fundamental Analysis is about the health of the company.
      We look at:
      1. Earnings Reports (EPS)
      2. P/E Ratios
      3. Balance Sheets (Assets vs Liabilities)
      
      If the company is fundamentally strong, the long-term trend is likely up.
    `
  },
  {
    id: 'oa-1.4',
    title: '1.4 Technical & Sentimental Analysis',
    category: 'Live Class Archives',
    level: 1,
    duration: '65 min',
    thumbnail: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=800&auto=format&fit=crop&q=60', // Candlestick Charts
    description: 'Forecasting future price movements based on past price action and market psychology.',
    mockTranscript: `
      Technical Analysis uses charts.
      Key concepts:
      - Support and Resistance levels
      - Trend lines (Higher highs, Higher lows)
      - Moving Averages (50-day, 200-day)
      
      Sentiment Analysis:
      - The Put/Call Ratio
      - The VIX (Fear Index)
      - When everyone is greedy, be fearful.
    `
  },
  {
    id: 'oa-1.5',
    title: '1.5 Economic Events',
    category: 'Live Class Archives',
    level: 1,
    duration: '45 min',
    thumbnail: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&auto=format&fit=crop&q=60', // Newspaper/Global News
    description: 'How macroeconomic reports like GDP, Jobs, and Inflation impact the markets.',
    mockTranscript: `
      The market moves on news.
      Big movers:
      1. FOMC Meetings (Interest Rates)
      2. Non-Farm Payrolls (Jobs report, usually first Friday of the month)
      3. CPI (Inflation data)
      
      Never trade blindly through a major economic event without knowing the risks.
    `
  },

  // --- LEVEL 2: Options Instruments ---
  {
    id: 'oa-2.1',
    title: '2.1 Defining Options',
    category: 'Live Class Archives',
    level: 2,
    duration: '52 min',
    thumbnail: 'https://picsum.photos/400/225?random=21',
    description: 'The rights and obligations of Call and Put contracts. Moneyness (ITM, ATM, OTM).',
    mockTranscript: `
      An option is a contract.
      A CALL option gives the buyer the RIGHT to BUY stock.
      A PUT option gives the buyer the RIGHT to SELL stock.
      
      Intrinsic Value vs Extrinsic Value:
      - Intrinsic: The real value if exercised today.
      - Extrinsic: Time value + Volatility value.
    `
  },
  {
    id: 'oa-2.2',
    title: '2.2 The Options Instrument',
    category: 'Live Class Archives',
    level: 2,
    duration: '50 min',
    thumbnail: 'https://images.unsplash.com/photo-1642543492481-44e81e3914a7?w=800&auto=format&fit=crop&q=60', // Option Chain / Screen
    description: 'Reading the Option Chain, expiration cycles (Weekly vs Monthly), and contract specifications.',
    mockTranscript: `
      Navigating the Option Chain is skill #1.
      You have the Calls on the left, Puts on the right.
      Strike prices down the middle.
      
      One contract = 100 shares.
      Multipliers and liquidity (Open Interest and Volume) are critical when selecting which instrument to trade.
    `
  },
  {
    id: 'oa-2.3',
    title: '2.3 An Introduction to Volatility',
    category: 'Live Class Archives',
    level: 2,
    duration: '58 min',
    thumbnail: 'https://images.unsplash.com/photo-1611974765270-ca1258634369?w=800&auto=format&fit=crop&q=60', // Volatility / Heartbeat chart
    description: 'Understanding Implied Volatility (IV) vs Historical Volatility (HV) and how it affects pricing.',
    mockTranscript: `
      Volatility is the "fear gauge" of the market.
      Implied Volatility (IV) tells us what the market expects the move to be in the future.
      
      When IV is high, option prices are expensive (Sellers market).
      When IV is low, option prices are cheap (Buyers market).
      
      Standard Deviation moves: 68% of the time price stays within 1 SD.
    `
  },
  {
    id: 'oa-2.4',
    title: '2.4 The Greeks',
    category: 'Live Class Archives',
    level: 2,
    duration: '65 min',
    thumbnail: 'https://picsum.photos/400/225?random=24',
    description: 'Mastering Delta, Gamma, Theta, and Vega. Measuring risk mathematically.',
    mockTranscript: `
      The Greeks are the dashboard of your trade.
      
      DELTA: Rate of change of option price relative to stock price. Also roughly the probability of expiring ITM.
      THETA: Time decay. Options are wasting assets. As sellers, Theta is our friend.
      VEGA: Sensitivity to volatility.
      
      If you don't understand the Greeks, you are flying the plane blind.
    `
  },

  // --- LEVEL 3: Credit Spreads ---
  {
    id: 'oa-3.1',
    title: '3.1 Credit Spreads',
    category: 'Live Class Archives',
    level: 3,
    duration: '58 min',
    thumbnail: 'https://picsum.photos/400/225?random=31',
    description: 'Selling premium for income. Vertical spreads where you receive a net credit.',
    mockTranscript: `
      Credit Spreads involve selling a closer-to-the-money option and buying a further-out-of-the-money option.
      
      Net Credit = The max profit you can make.
      Risk is defined.
      
      Bull Put Spread: You want the stock to stay above a certain level.
      Bear Call Spread: You want the stock to stay below a certain level.
    `
  },
  {
    id: 'oa-3.2',
    title: '3.2 The Covered Call',
    category: 'Live Class Archives',
    level: 3,
    duration: '45 min',
    thumbnail: 'https://picsum.photos/400/225?random=32',
    description: 'Generating income on stocks you own. The foundational strategy for many portfolios.',
    mockTranscript: `
      The Covered Call.
      Setup: Own 100 shares of stock, Sell 1 Call option against it.
      
      Why? To generate monthly income (rent) from your assets.
      Risk: You limit your upside potential if the stock rockets up, but you lower your cost basis.
      
      This is a bullish to neutral strategy.
    `
  },
  {
    id: 'oa-3.3',
    title: '3.3 The Bull Put',
    category: 'Live Class Archives',
    level: 3,
    duration: '55 min',
    thumbnail: 'https://images.unsplash.com/photo-1611974765270-ca1258634369?w=800&auto=format&fit=crop&q=60',
    description: 'A bullish vertical credit spread using Puts. Profiting when the market stays up.',
    mockTranscript: `
      The Bull Put Spread.
      Strategy: Sell a Put (closer to money), Buy a Put (further OTM).
      Sentiment: Moderately Bullish to Neutral.
      
      Goal: Have the stock stay above your Short Strike at expiration.
      Max Profit: The net credit received.
      Max Risk: Difference in strikes minus credit received.
    `
  },
  {
    id: 'oa-3.4',
    title: '3.4 The Bear Call',
    category: 'Live Class Archives',
    level: 3,
    duration: '52 min',
    thumbnail: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=800&auto=format&fit=crop&q=60',
    description: 'A bearish vertical credit spread using Calls. Profiting when the market stays down.',
    mockTranscript: `
      The Bear Call Spread.
      Strategy: Sell a Call (closer to money), Buy a Call (further OTM).
      Sentiment: Moderately Bearish to Neutral.
      
      Goal: Have the stock stay below your Short Strike at expiration.
      This is an excellent way to fade a rally or generate income in a down market.
    `
  },
  {
    id: 'oa-3.5',
    title: '3.5 The Iron Condor',
    category: 'Live Class Archives',
    level: 3,
    duration: '70 min',
    thumbnail: 'https://picsum.photos/400/225?random=35',
    description: 'Non-directional trading. Profiting when the stock stays within a specific range.',
    mockTranscript: `
      The Iron Condor combines a Bull Put Spread and a Bear Call Spread.
      You profit if the stock stays "between the wings."
      
      This is a pure volatility play. You want low movement and time decay.
    `
  },

  // --- LEVEL 4: Debit Spreads ---
  {
    id: 'oa-4.1',
    title: '4.1 Debit Spreads',
    category: 'Live Class Archives',
    level: 4,
    duration: '50 min',
    thumbnail: 'https://picsum.photos/400/225?random=41',
    description: 'Buying premium with defined risk. Reducing the cost of long options.',
    mockTranscript: `
      Debit Spreads are directional trades where you pay to enter.
      Unlike naked calls, you sell a further OTM option to reduce cost.
    `
  },
  {
    id: 'oa-4.2',
    title: '4.2 The Bull Call',
    category: 'Live Class Archives',
    level: 4,
    duration: '55 min',
    thumbnail: 'https://picsum.photos/400/225?random=42',
    description: 'A cheaper way to play a bullish move than buying stock or naked calls.',
    mockTranscript: `
      Bull Call Spread:
      Buy Lower Strike Call (ITM usually)
      Sell Higher Strike Call (OTM)
      
      Max Profit is limited to the width of the strikes minus the debit paid.
    `
  },
  {
    id: 'oa-4.3',
    title: '4.3 The Bear Put',
    category: 'Live Class Archives',
    level: 4,
    duration: '58 min',
    thumbnail: 'https://images.unsplash.com/photo-1611974765270-ca1258634369?w=800&auto=format&fit=crop&q=60',
    description: 'A bearish directional strategy. Buying a higher strike Put and selling a lower strike Put.',
    mockTranscript: `
      The Bear Put Spread is a debit spread.
      You pay money to enter the trade.
      
      Setup:
      - Buy Put (Higher Strike, usually ATM or ITM)
      - Sell Put (Lower Strike, OTM)
      
      Max Profit: Width of strikes - Debit Paid.
      Max Loss: Debit Paid.
      
      Use this when you are moderately bearish and want to limit cost/risk compared to a long put.
    `
  },
  {
    id: 'oa-4.4',
    title: '4.4 The Put Calendar',
    category: 'Live Class Archives',
    level: 4,
    duration: '62 min',
    thumbnail: 'https://picsum.photos/400/225?random=44',
    description: 'A time spread using Puts. Profiting from time decay differences between months.',
    mockTranscript: `
      Calendar Spreads (Horizontal Spreads).
      
      Setup:
      - Sell Short-term Put
      - Buy Long-term Put
      - Same Strike Price
      
      Goal: Have the stock price sit right at the strike price at the expiration of the short option.
      We want the short option to decay faster than the long option (Theta arbitrage).
    `
  },
  {
    id: 'oa-4.5',
    title: '4.5 The Call Calendar',
    category: 'Live Class Archives',
    level: 4,
    duration: '60 min',
    thumbnail: 'https://picsum.photos/400/225?random=45',
    description: 'A time spread using Calls. Neutral to bullish outlook targeting a specific price.',
    mockTranscript: `
      The Call Calendar is similar to the Put Calendar but using Calls.
      
      Setup:
      - Sell Front-month Call
      - Buy Back-month Call
      - Same Strike
      
      This is a "Targeted" trade. You want the stock to end up at your strike.
      Low risk, high potential reward if you nail the price target.
    `
  },
  {
    id: 'oa-4.6',
    title: '4.6 The Diagonal',
    category: 'Live Class Archives',
    level: 4,
    duration: '70 min',
    thumbnail: 'https://picsum.photos/400/225?random=46',
    description: 'Combining different strikes and different expirations. The "Poor Man\'s Covered Call".',
    mockTranscript: `
      Diagonal Spreads involve different strikes AND different months.
      
      Most common: Long Diagonal Call (Poor Man's Covered Call).
      - Buy Deep ITM LEAPS Call (Long term)
      - Sell OTM Near-term Call (Short term)
      
      It mimics a covered call but requires much less capital.
    `
  },

  // --- LEVEL 5: Hedged Trades ---
  {
    id: 'oa-5.1',
    title: '5.1 Hedged Trades',
    category: 'Live Class Archives',
    level: 5,
    duration: '50 min',
    thumbnail: 'https://picsum.photos/400/225?random=51',
    description: 'Introduction to hedging. Reducing risk by taking offsetting positions.',
    mockTranscript: `
      Hedging is about insurance.
      We trade to make money, but we hedge to keep it.
      
      Concepts:
      - Beta weighting
      - Correlation
      - Portfolio protection
    `
  },
  {
    id: 'oa-5.2',
    title: '5.2 The Straddle/Strangle',
    category: 'Live Class Archives',
    level: 5,
    duration: '60 min',
    thumbnail: 'https://picsum.photos/400/225?random=52',
    description: 'Profiting from large moves in either direction. Long volatility strategies.',
    mockTranscript: `
      Straddle: Buy Call + Buy Put at the SAME strike.
      Strangle: Buy Call + Buy Put at DIFFERENT strikes (OTM).
      
      You need the stock to move more than the cost of the trade.
      Best used before earnings or major news events if implied volatility is low.
    `
  },
  {
    id: 'oa-5.3',
    title: '5.3 The Protective Put',
    category: 'Live Class Archives',
    level: 5,
    duration: '55 min',
    thumbnail: 'https://picsum.photos/400/225?random=53',
    description: 'Buying insurance for your stock portfolio. Limiting downside risk.',
    mockTranscript: `
      The Protective Put is like car insurance.
      You own the stock (Long Stock).
      You buy a Put option to lock in a minimum sell price.
      
      Cost: The premium paid for the put.
      Benefit: Peace of mind and capped losses.
    `
  },
  {
    id: 'oa-5.4',
    title: '5.4 Advanced Covered Calls',
    category: 'Live Class Archives',
    level: 5,
    duration: '60 min',
    thumbnail: 'https://picsum.photos/400/225?random=54',
    description: 'Rolling techniques and repair strategies for covered calls gone wrong.',
    mockTranscript: `
      What happens if your stock drops 20%?
      We discuss "Rolling Down" your short call to collect more premium.
      We discuss the "Collar" strategy to lock in capital protection.
    `
  },
  {
    id: 'oa-5.5',
    title: '5.5 The Collar Trade',
    category: 'Live Class Archives',
    level: 5,
    duration: '65 min',
    thumbnail: 'https://picsum.photos/400/225?random=55',
    description: 'The ultimate protection strategy. Combining a Covered Call with a Protective Put.',
    mockTranscript: `
      The Collar is a Covered Call + a Long Put.
      It defines a floor for your stock loss. It is low risk, low reward, but excellent for sleep-well-at-night investing.
    `
  },

  // --- LEVEL 6: Trade Application ---
  {
    id: 'oa-6.1',
    title: '6.1 Your Portfolio - Part 1',
    category: 'Live Class Archives',
    level: 6,
    duration: '60 min',
    thumbnail: 'https://picsum.photos/400/225?random=61',
    description: 'Constructing a balanced portfolio. Allocation strategies and risk tolerance.',
    mockTranscript: `
      Portfolio construction starts with your goals.
      We discuss allocation percentages for different strategies (income vs growth).
      Diversification across sectors and asset classes.
    `
  },
  {
    id: 'oa-6.2',
    title: '6.2 Your Portfolio - Part 2',
    category: 'Live Class Archives',
    level: 6,
    duration: '65 min',
    thumbnail: 'https://picsum.photos/400/225?random=62',
    description: 'Advanced portfolio management. Correlation analysis and beta weighting.',
    mockTranscript: `
      Part 2 focuses on managing the whole, not just the parts.
      Beta weighting your portfolio to SPX.
      Understanding how your positions interact during market stress.
    `
  },
  {
    id: 'oa-6.3',
    title: '6.3 Technical Analysis Workshop',
    category: 'Live Class Archives',
    level: 6,
    duration: '70 min',
    thumbnail: 'https://picsum.photos/400/225?random=63',
    description: 'Hands-on workshop applying technical indicators to real charts.',
    mockTranscript: `
      In this workshop, we pull up live charts.
      We look for confluence: where Fibonacci levels meet moving averages.
      Identifying breakout patterns and fake-outs.
    `
  },
  {
    id: 'oa-6.4',
    title: '6.4 Fundamental Analysis Workshop',
    category: 'Live Class Archives',
    level: 6,
    duration: '65 min',
    thumbnail: 'https://picsum.photos/400/225?random=64',
    description: 'Deep dive into financial statements and finding undervalued companies.',
    mockTranscript: `
      We dig into the 10-K and 10-Q reports.
      Analyzing cash flow statements vs income statements.
      Finding the "moat" around a business.
    `
  },
  {
    id: 'oa-6.5',
    title: '6.5 Option Chain History and Analysis',
    category: 'Live Class Archives',
    level: 6,
    duration: '55 min',
    thumbnail: 'https://picsum.photos/400/225?random=65',
    description: 'Analyzing historical option pricing to understand volatility skew and anomalies.',
    mockTranscript: `
      Looking back at how the option chain looked before a major move.
      Understanding Volatility Skew (Smiles and Smirks).
      Identifying unusual option activity.
    `
  },
  {
    id: 'oa-6.6',
    title: '6.6 Visual Greeks',
    category: 'Live Class Archives',
    level: 6,
    duration: '55 min',
    thumbnail: 'https://picsum.photos/400/225?random=66',
    description: 'Using chart overlays to visualize how Greeks change over time and price.',
    mockTranscript: `
      Visualizing the "PnL Tent".
      As expiration approaches, the Gamma curve steepens.
      We look at 3D graphing of volatility surfaces.
    `
  },
  {
    id: 'oa-6.9',
    title: '6.9 Practical Application Workshop',
    category: 'Live Class Archives',
    level: 6,
    duration: '90 min',
    thumbnail: 'https://picsum.photos/400/225?random=69',
    description: 'Bringing it all together. Live trading session applying all Level 6 concepts.',
    mockTranscript: `
      This is where rubber meets the road.
      We scan for a trade, analyze it fundamentally and technically.
      Select the strategy, size the position, and place the trade.
    `
  },

  // --- LEVEL 7: Trade Adjustments ---
  {
    id: 'oa-7.1',
    title: '7.1 Adjusting the Options Instrument',
    category: 'Live Class Archives',
    level: 7,
    duration: '60 min',
    thumbnail: 'https://picsum.photos/400/225?random=71',
    description: 'When and how to adjust single leg option positions.',
    mockTranscript: `
      Adjustment rule #1: Never turn a winner into a loser.
      We discuss rolling up calls, rolling out puts.
      Using spreads to lock in profit.
    `
  },
  {
    id: 'oa-7.2',
    title: '7.2 Adjusting the Collar Trade',
    category: 'Live Class Archives',
    level: 7,
    duration: '65 min',
    thumbnail: 'https://picsum.photos/400/225?random=72',
    description: 'Managing the collar when the stock moves significantly up or down.',
    mockTranscript: `
      If the stock drops, your put is gaining value. Do you roll it down to take profit?
      If the stock rises, your call is losing. Do you roll it up and out?
      Strategies for staying protected while capturing growth.
    `
  },
  {
    id: 'oa-7.3',
    title: '7.3 Flow charts - The Options Instrument',
    category: 'Live Class Archives',
    level: 7,
    duration: '50 min',
    thumbnail: 'https://picsum.photos/400/225?random=73',
    description: 'Visual decision trees for managing long calls and long puts.',
    mockTranscript: `
      We follow the flowchart.
      Is the trade profitable? Yes -> Set trailing stop.
      No -> Is the technical trend still valid?
      Systematic decision making removes emotion.
    `
  },
  {
    id: 'oa-7.4',
    title: '7.4 Flow Charts - The Call Spreads',
    category: 'Live Class Archives',
    level: 7,
    duration: '55 min',
    thumbnail: 'https://picsum.photos/400/225?random=74',
    description: 'Decision trees for managing Bull Call and Bear Call spreads.',
    mockTranscript: `
      Managing the short leg of a spread is key.
      If tested, do we roll the whole spread or just one leg?
      Analyzing risk/reward of adjustments.
    `
  },
  {
    id: 'oa-7.5',
    title: '7.5 Flow charts - The Put Spreads',
    category: 'Live Class Archives',
    level: 7,
    duration: '55 min',
    thumbnail: 'https://picsum.photos/400/225?random=75',
    description: 'Decision trees for managing Bull Put and Bear Put spreads.',
    mockTranscript: `
      The Bull Put adjustment logic.
      If support breaks, do we close for a loss or roll out in time?
      Understanding credit vs debit adjustments.
    `
  },
  {
    id: 'oa-7.6',
    title: '7.6 Dynamic Adjustments',
    category: 'Live Class Archives',
    level: 7,
    duration: '75 min',
    thumbnail: 'https://picsum.photos/400/225?random=76',
    description: 'Real-time decision making when the market moves fast against your position.',
    mockTranscript: `
      Dynamic adjustment means not waiting for end-of-day.
      If Delta gets too high, we roll.
      If a short strike is breached, we might convert a vertical into a butterfly or condor to neutralize delta.
    `
  },
  {
    id: 'oa-7.9',
    title: '7.9 Trade Adjustments Workshop',
    category: 'Live Class Archives',
    level: 7,
    duration: '90 min',
    thumbnail: 'https://picsum.photos/400/225?random=79',
    description: 'Interactive workshop applying adjustment rules to real broken trades.',
    mockTranscript: `
      We take real examples of trades that went against us.
      We simulate the repair using historical data.
      Turning a loser into a scratch or a winner.
    `
  },

  // --- LEVEL 8: Advanced Application ---
  {
    id: 'oa-8.0',
    title: '8.0 Graduation',
    category: 'Live Class Archives',
    level: 8,
    duration: '30 min',
    thumbnail: 'https://picsum.photos/400/225?random=80',
    description: 'Completion of the curriculum and next steps in your trading journey.',
    mockTranscript: `Congratulations on reaching Level 8. Graduation is just the beginning...`
  },
  {
    id: 'oa-8.1',
    title: '8.1 Verticals Outside the Box',
    category: 'Live Class Archives',
    level: 8,
    duration: '55 min',
    thumbnail: 'https://picsum.photos/400/225?random=81',
    description: 'Unconventional ways to use vertical spreads for specific market conditions.',
    mockTranscript: `We usually look for standard deviations. Here we look for skew advantages...`
  },
  {
    id: 'oa-8.2',
    title: '8.2 Calendar Strangles',
    category: 'Live Class Archives',
    level: 8,
    duration: '60 min',
    thumbnail: 'https://picsum.photos/400/225?random=82',
    description: 'Combining calendar spreads with strangles to capture volatility and time decay.',
    mockTranscript: `The Calendar Strangle allows you to have a wide profit tent...`
  },
  {
    id: 'oa-8.3',
    title: '8.3 Ratio Spreads',
    category: 'Live Class Archives',
    level: 8,
    duration: '58 min',
    thumbnail: 'https://picsum.photos/400/225?random=83',
    description: 'Buying one option and selling two (or more) to finance the trade.',
    mockTranscript: `Ratio spreads can be done for a credit or a debit. The risk is the naked portion...`
  },
  {
    id: 'oa-8.4',
    title: '8.4 Winged Spreads',
    category: 'Live Class Archives',
    level: 8,
    duration: '65 min',
    thumbnail: 'https://picsum.photos/400/225?random=84',
    description: 'Advanced butterflies, condors, and pterodactyls.',
    mockTranscript: `Winged spreads define your risk. We look at broken wing butterflies...`
  },
  {
    id: 'oa-8.5',
    title: '8.5 The Double Diagonal',
    category: 'Live Class Archives',
    level: 8,
    duration: '70 min',
    thumbnail: 'https://picsum.photos/400/225?random=85',
    description: 'Trading diagonals on both the call and put side simultaneously.',
    mockTranscript: `The Double Diagonal takes advantage of IV crush on both sides...`
  },
  {
    id: 'oa-8.6',
    title: '8.6 The Synthetic Collar',
    category: 'Live Class Archives',
    level: 8,
    duration: '80 min',
    thumbnail: 'https://picsum.photos/400/225?random=86',
    description: 'Creating a collar position using only options (LEAPS) instead of owning the stock.',
    mockTranscript: `
      The Synthetic Collar uses a LEAPS Call as a surrogate for stock ownership (The "PMCC" or Poor Man's Covered Call).
      Then we buy a protective put against it.
      Capital efficiency is the key benefit here.
    `
  },
  {
    id: 'oa-8.7',
    title: '8.7 Explosive Trades',
    category: 'Live Class Archives',
    level: 8,
    duration: '50 min',
    thumbnail: 'https://picsum.photos/400/225?random=87',
    description: 'Strategies designed for massive volatility expansion or breakouts.',
    mockTranscript: `When you expect a black swan or a massive earnings beat...`
  },
  {
    id: 'oa-8.8',
    title: '8.8 Advanced Time Decay Theory',
    category: 'Live Class Archives',
    level: 8,
    duration: '60 min',
    thumbnail: 'https://picsum.photos/400/225?random=88',
    description: 'The mathematics of Theta and second-order Greeks.',
    mockTranscript: `Theta is not linear. It accelerates as we get closer to expiration...`
  },
  {
    id: 'oa-8.9',
    title: '8.9 Advanced Options Workshop',
    category: 'Live Class Archives',
    level: 8,
    duration: '90 min',
    thumbnail: 'https://picsum.photos/400/225?random=89',
    description: 'Master class application of Level 8 strategies in live markets.',
    mockTranscript: `Putting it all together. Building a complex portfolio with Level 8 trades...`
  }
];
