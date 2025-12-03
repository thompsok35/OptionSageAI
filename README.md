# OptionSage AI 🧙‍♂️📈

**OptionSage** is an intelligent educational companion designed specifically for **OptionsAnimal** students. It leverages the power of Google Gemini 2.5 to provide real-time coaching, content summarization, and graduation project assistance.

## 🚀 Key Features

### 1. 📚 Smart Curriculum Navigation
- Browse the full **OptionsAnimal 8-Level Curriculum**.
- Mock data includes transcripts for 40+ specialized options trading modules.
- Tracks user progress and unlocks visual completion indicators.

### 2. 🤖 AI-Powered Study Guides
- **Video Analysis**: Simulates watching course videos and generates structured Markdown notes (Concept, Mechanics, Risks).
- **Slide Deck Analysis**: Upload PDF slides directly. The **Multimodal AI** extracts text and visuals to create comprehensive summaries.
- **Text-to-Speech**: Listen to your study guides on the go with the built-in "Read Aloud" player.

### 3. 🎓 Graduation Project Wizard
- A dedicated workspace to build your **Level 8 Trading Plan**.
- Follows the proprietary **OptionsAnimal 6-Step Methodology**:
  1.  Determine Direction (Fundamental/Technical/Sentiment)
  2.  Analyze Possibilities (IV Environment)
  3.  Structure Strategy (Strikes/Expiration/Risk)
  4.  Determine Exits (Primary/Secondary)
  5.  Execution
  6.  Monitoring
- **AI Coach**: Click "Ask AI Coach" to get a detailed critique of your plan before submission.

### 4. 👤 Student Profile
- Track your "Friendly Name" and current Level status.
- Visual progress bars for the entire curriculum.

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript
- **Styling**: Tailwind CSS
- **AI Engine**: Google Gemini API (`gemini-2.5-flash`)
- **State Management**: React Hooks + Local Storage persistence

## 📦 Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/your-username/OptionSage.git
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Set up your environment variables:
    - Create a `.env` file and add your Google Gemini API Key.
    ```env
    REACT_APP_GEMINI_API_KEY=your_api_key_here
    ```
4.  Run the application:
    ```bash
    npm start
    ```

## 📝 License

This project is a demonstration of AI capabilities and is not affiliated with OptionsAnimal officially. All trademarks belong to their respective owners.

---
*Built with ❤️ for the Options Trading Community.*
