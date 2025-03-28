// ------------------------------------------------------------------------------------------------

import fs from "fs";
import path from "path";

// ------------------------------------------------------------------------------------------------

export type AILogData = {
  task: string;
  system: string;
  prompt: string;
  result: any;
  response: {
    model: string;
    timestamp: string;
  };
};

export type AILogSafeData = {
  task: string;
  model: string;
  system: string;
  prompt: string;
  result: any;
};

// ------------------------------------------------------------------------------------------------
export const logAIGeneration = async ({ task, system, prompt, result, response }: AILogData) => {
  // Create logs directory if it doesn't exist
  const logDir = path.join(path.resolve(), "..", "..", "logs");
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
  }

  // Generate a timestamped filename
  const timestamp = new Date().toISOString().replace(/[:.-]/g, "");
  const baseFileName = `${timestamp}-${task}`;

  // Prepare full log object
  const fullLog: AILogSafeData = {
    task,
    model: response.model,
    system,
    prompt,
    result,
  };

  // Save JSON log
  fs.writeFileSync(path.join(logDir, `${baseFileName}.json`), JSON.stringify(fullLog, null, 2));

  // Save Markdown log
  const markdown = `
## AI Generation Log: ${task}

- **Model:** ${response.model}
- **Timestamp:** ${response.timestamp}

### System Prompt
\`\`\`
${system}
\`\`\`

### User Prompt
\`\`\`
${prompt}
\`\`\`

### Result
\`\`\`json
${JSON.stringify(result, null, 2)}
\`\`\`
`.trim();

  fs.writeFileSync(path.join(logDir, `${baseFileName}.md`), markdown);
};

// ------------------------------------------------------------------------------------------------
