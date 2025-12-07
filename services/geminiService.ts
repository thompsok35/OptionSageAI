
import { GoogleGenAI, Type } from "@google/genai";
import { TradingPlan, StockFundamentalAnalysis } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateSummary = async (
  title: string,
  transcriptOrContext: string,
  fileData?: { mimeType: string; data: string }
): Promise<string> => {
  try {
    let promptText = '';
    let parts: any[] = [];

    if (fileData) {
      // Determine file type context
      const isVideo = fileData.mimeType.startsWith('video/');
      const isAudio = fileData.mimeType.startsWith('audio/');
      const isImage = fileData.mimeType.startsWith('image/');
      const isPdf = fileData.mimeType.includes('pdf');

      let contextInstruction = "";
      if (isVideo) {
        contextInstruction = "The attached file is a video clip from an options trading training session. Please analyze the visual chart setups, instructor commentary, and on-screen text.";
      } else if (isAudio) {
        contextInstruction = "The attached file is an audio recording of a trading instructor. Please listen carefully to the strategies and rules discussed.";
      } else if (isPdf) {
        contextInstruction = "The attached file is a PDF slide deck. Extract the key concepts, strategies, and rules defined in the visual slides.";
      } else if (isImage) {
        contextInstruction = "The attached file is a screenshot of a trading setup or chart. Analyze the technical indicators and market structure shown.";
      }

      // Multimodal Prompt
      promptText = `
        You are an expert Options Trading instructor assisting a student.
        Please summarize the educational content provided in the attached file titled "${title}".
        ${contextInstruction}

        Format the response in Markdown with the following structure:
        ## 🎯 Core Concept
        (Brief explanation of the strategy/topic)
        
        ## 🛠️ Setup & Mechanics
        (Bulleted list of how to execute the trade, specific rules, or chart patterns observed)
        
        ## ⚠️ Risk Management
        (What are the risks and how to mitigate them)
        
        ## 💡 Key Takeaways
        (The most important lessons to remember)
      `;

      parts = [
        { text: promptText },
        {
          inlineData: {
            mimeType: fileData.mimeType,
            data: fileData.data
          }
        }
      ];

    } else {
      // Transcript/Text Mode
      promptText = `
        You are an expert Options Trading instructor assisting a student.
        Please summarize the following educational content titled "${title}".
        
        Format the response in Markdown with the following structure:
        ## 🎯 Core Concept
        (Brief explanation of the strategy/topic)
        
        ## 🛠️ Setup & Mechanics
        (Bulleted list of how to execute the trade or specific rules)
        
        ## ⚠️ Risk Management
        (What are the risks and how to mitigate them)
        
        ## 💡 Key Takeaways
        (The most important lessons to remember)
        
        ---
        CONTENT / TRANSCRIPT:
        ${transcriptOrContext}
      `;
      
      parts = [{ text: promptText }];
    }

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: { parts },
      config: {
        thinkingConfig: { thinkingBudget: 0 }, // Disable thinking for faster summary
        temperature: 0.3, // Low temperature for factual accuracy
      }
    });

    return response.text || "Failed to generate summary.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "## Error\nCould not generate summary. Please check your API key. Note: Large video files may exceed the demo limit.";
  }
};

export const reviewTradingPlan = async (plan: TradingPlan): Promise<string> => {
  try {
    const promptText = `
      You are a senior instructor at OptionsANIMAL. Review this student's graduation trading plan based on our 6-Step Process.
      Critique their logic. Ensure their strategy matches their analysis.
      
      Student Plan:
      Symbol: ${plan.symbol}
      
      Step 1 (Direction):
      - Fundamentals: ${plan.step1.fundamentals}
      - Technicals: ${plan.step1.technicals}
      - Sentiment: ${plan.step1.sentiment}
      - Conclusion: ${plan.step1.conclusion}
      
      Step 2 (IV & Possibilities):
      - IV Environment: ${plan.step2.impliedVolatility}
      - Strategies Considered: ${plan.step2.candidateStrategies.join(', ')}
      
      Step 3 (Structure):
      - Selected Strategy: ${plan.step3.selectedStrategy}
      - Strikes/Expiration: ${plan.step3.strikes} / ${plan.step3.expiration}
      
      Step 4 (Exits):
      - Primary: ${plan.step4.primaryExit}
      - Secondary (Bullish Adjustment): ${plan.step4.secondaryExitBullish}
      - Secondary (Bearish Adjustment): ${plan.step4.secondaryExitBearish}
      
      Provide a constructive critique in Markdown.
      1. **Analysis Grade**: Does the analysis support the direction?
      2. **Strategy Fit**: Is the strategy appropriate for the IV environment and directional bias?
      3. **Risk Management**: Are the secondary exits realistic?
      4. **Coach's Verdict**: Pass or Needs Improvement?
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: promptText,
      config: {
        temperature: 0.4,
      }
    });

    return response.text || "Unable to generate review.";
  } catch (error) {
    console.error("Gemini Review Error:", error);
    return "Error generating feedback. Please try again.";
  }
};

export const getStockFundamentals = async (symbol: string): Promise<Partial<StockFundamentalAnalysis>> => {
  try {
    const promptText = `
      You are a stock market data assistant.
      Provide the fundamental data for the stock symbol "${symbol}" to help a student with OptionsANIMAL Step 1 analysis.
      
      Return a JSON object matching this structure exactly (fill with estimated or recent data, note that this is for educational practice):
      {
        "name": "Full Company Name",
        "overview": "Brief description of what the company does and how it generates revenue.",
        "avgVolume": "e.g. 50M shares",
        "institutionalOwnership": "e.g. 60%",
        "earningsDate": "Next estimated earnings date",
        "range52Week": "e.g. $100 - $180",
        "peRatio": "e.g. 25.5",
        "dividend": "e.g. $0.24/qtr (1.5%)",
        "debtToEquity": "e.g. 0.8",
        "intrinsicValue": "e.g. $165 (approx)",
        "analystTargetPrice": "e.g. $180",
        "management": {
           "roic": "e.g. 15%",
           "roa": "e.g. 10%",
           "roe": "e.g. 25%"
        },
        "growth": {
          "currentQtr": "e.g. 10%",
          "nextQtr": "e.g. 12%",
          "currentYear": "e.g. 15%",
          "nextYear": "e.g. 18%",
          "next5Years": "e.g. 20%",
          "past5Years": "e.g. 14%",
          "industryAvg": "e.g. 10%"
        }
      }
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: promptText,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.1
      }
    });

    if (response.text) {
      return JSON.parse(response.text);
    }
    return {};
  } catch (error) {
    console.error("Gemini Fundamentals Error:", error);
    return {};
  }
};
