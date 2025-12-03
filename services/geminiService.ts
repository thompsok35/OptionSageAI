
import { GoogleGenAI } from "@google/genai";
import { TradingPlan } from "../types";

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
      // PDF/Image Mode
      promptText = `
        You are an expert Options Trading instructor assisting a student.
        Please summarize the educational content provided in the attached file (Slide Deck/PDF) titled "${title}".
        
        The file contains training slides. extracting the key concepts, strategies, and rules defined in the visual slides.

        Format the response in Markdown with the following structure:
        ## 🎯 Core Concept
        (Brief explanation of the strategy/topic found in the slides)
        
        ## 🛠️ Setup & Mechanics
        (Bulleted list of how to execute the trade or specific rules mentioned)
        
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
      // Transcript Mode
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
        TRANSCRIPT CONTENT:
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
    return "## Error\nCould not generate summary. Please check your API key, ensure the file is a valid PDF, or try again later.";
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
