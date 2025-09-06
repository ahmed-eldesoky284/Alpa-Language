import { COMMAND_MAP, CommandDef } from '../constants.ts';
import { generateImage, generateText, summarizeText } from './geminiService.ts';
import { ObjectDetectionMode, HistoryItem, OutputType } from '../types.ts';

interface ProcessResult {
  commandKey?: string;
  output?: string;
  action?: string;
  payload?: any;
}

const findCommand = (commandAlias: string): { key: string; def: CommandDef } | null => {
  const lowerCaseAlias = commandAlias.toLowerCase();
  const commandKey = Object.keys(COMMAND_MAP).find(key =>
    (COMMAND_MAP[key as keyof typeof COMMAND_MAP] as CommandDef).aliases.includes(lowerCaseAlias)
  );
  if (commandKey) {
    return { key: commandKey, def: COMMAND_MAP[commandKey as keyof typeof COMMAND_MAP] };
  }
  return null;
};

const generateHelpMessage = (): string => {
  let message = 'Available Commands:\n\n';
  for (const key in COMMAND_MAP) {
    const cmd = COMMAND_MAP[key as keyof typeof COMMAND_MAP] as CommandDef;
    message += `  ${cmd.aliases.join(', ')}\n`;
    if (cmd.usage) message += `    Usage: ${cmd.usage}\n`;
    message += `    Description: ${cmd.description}\n\n`;
  }
  return message;
};

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Calculates the Levenshtein distance between two strings, which is a measure of their difference.
 * @param s1 The first string.
 * @param s2 The second string.
 * @returns The Levenshtein distance.
 */
const levenshtein = (s1: string, s2: string): number => {
  if (s1.length < s2.length) {
    return levenshtein(s2, s1);
  }
  if (s2.length === 0) {
    return s1.length;
  }
  let previousRow = Array.from({ length: s2.length + 1 }, (_, i) => i);
  for (let i = 0; i < s1.length; i++) {
    let currentRow = [i + 1];
    for (let j = 0; j < s2.length; j++) {
      let insertions = previousRow[j + 1] + 1;
      let deletions = currentRow[j] + 1;
      let substitutions = previousRow[j] + (s1[i] !== s2[j] ? 1 : 0);
      currentRow.push(Math.min(insertions, deletions, substitutions));
    }
    previousRow = currentRow;
  }
  return previousRow[s2.length];
};


export const processCommand = async (
    command: string, 
    isCameraOpen: boolean,
    onOutput: (item: HistoryItem) => void
): Promise<ProcessResult> => {
  const trimmedCommand = command.trim();
  if (!trimmedCommand) {
    return {};
  }

  const parts = trimmedCommand.match(/(?:[^\s"]+|"[^"]*")+/g)?.map(part => part.replace(/"/g, '')) ?? [];
  const commandAlias = parts[0];
  const args = parts.slice(1);

  const foundCommand = findCommand(commandAlias);

  if (!foundCommand) {
     // Suggest a command if there's a typo
    let bestMatch: string | null = null;
    let minDistance = 3; // Threshold for suggestion
    const allCommandAliases = Object.values(COMMAND_MAP).flatMap(cmd => (cmd as CommandDef).aliases);
    
    for (const alias of allCommandAliases) {
        const distance = levenshtein(commandAlias.toLowerCase(), alias);
        if (distance < minDistance) {
            minDistance = distance;
            bestMatch = alias;
        }
    }

    if (bestMatch) {
        return { output: `Error: Command '${commandAlias}' not found. Did you mean '${bestMatch}'?` };
    }
    
     const response = await generateText(command);
     return { output: response };
  }
  
  const { key, def } = foundCommand;

  if ((key === 'CAMERA_DESCRIBE' || key === 'DETECT_OBJECTS' || key === 'DETECT_FACES') && !isCameraOpen) {
    return { output: `Error: Camera is not open. Use 'camera.open' first.` };
  }

  switch (key) {
    case 'HELP':
      return { output: generateHelpMessage() };
    case 'EXIT':
      return { output: 'Simulating exit. In a real terminal, this would close.' };
    case 'CLEAR':
      return { commandKey: key, action: def.action };
    case 'AI_CHAT':
        return { 
            action: def.action, 
            output: 'Starting chat session. Type "exit" or "خروج" to end.' 
        };
    case 'AI_IMAGE':
      const imagePrompt = args.join(' ');
      if (!imagePrompt) {
          return { output: `Error: An image prompt is required.\n\nUsage: ${def.usage}\nExample: image a futuristic city at sunset` };
      }
      return { output: await generateImage(imagePrompt) };
        
    case 'CAMERA_OPEN':
    case 'CAMERA_CLOSE':
      return { action: def.action };
        
    case 'CAMERA_DESCRIBE':
      const describePayload = def.payload ? def.payload(args) : undefined;
      return { action: def.action, payload: describePayload, output: '[AI]: Capturing frame for analysis...' };
    
    case 'DETECT_OBJECTS': {
      const mode = (args[0] || 'objects') as ObjectDetectionMode;
      if (def.args && !def.args.includes(mode)) {
          return { output: `Error: Invalid detection mode '${mode}'.\n\nUsage: ${def.usage}\nAvailable modes are: ${def.args.join(', ')}.` };
      }
      const payload = def.payload ? def.payload(args) : mode;
      return { action: def.action, payload, output: `Object detection mode set to: ${payload}` };
    }
    
    case 'DETECT_FACES': {
      const mode = args[0];
      if (def.args && !def.args.includes(mode)) {
          return { output: `Error: Invalid argument '${mode}'.\n\nUsage: ${def.usage}\nExample: detect.faces on` };
      }
      const payload = def.payload ? def.payload(args) : undefined;
      return { action: def.action, payload, output: `Face detection set to: ${payload ? 'on' : 'off'}` };
    }
    
    case 'BOT_NEW': {
        if (args.length < 2) {
            return { output: `Error: Missing arguments for creating a bot.\n\nUsage: ${def.usage}\nExample: bot.new web "https://example.com/faq.json"` };
        }
        const [platform, dataSource] = args;
        const supportedPlatforms = ['web', 'whatsapp', 'telegram', 'facebook', 'instagram'];
        if (!supportedPlatforms.includes(platform.toLowerCase())) {
            return { output: `Error: Unsupported platform '${platform}'.\n\nSupported platforms are: ${supportedPlatforms.join(', ')}.` };
        }
        return {
            output: `[INFO]: Initializing chatbot project...\n` +
                    `[AI]: Connecting to data source: ${dataSource}...\n` +
                    `[OK]: Data source validated.\n` +
                    `[INFO]: Configuring platform adapter for ${platform}...\n` +
                    `[DEPLOY]: Deploying chatbot...\n` +
                    `[SUCCESS]: Chatbot is now live! Endpoint: https://bot.alpa.cloud/${platform}/${Math.random().toString(36).substring(7)}`
        };
    }

    case 'AI_SPEECH_TO_TEXT': {
        if (args.length < 1) return { output: `Error: Missing file argument.\n\nUsage: ${def.usage}` };
        return { output: `[AI]: Transcribing ${args[0]}...\n[SUCCESS]: Transcription complete.\n\n"Hello, this is a simulated transcription from Alpa's speech-to-text engine. It demonstrates the ability to convert audio into written text."` };
    }

    case 'AI_TEXT_TO_SPEECH': {
        const textToSpeak = args.join(' ');
        if (!textToSpeak) {
            return { output: `Error: Missing text to speak.\n\nUsage: ${def.usage}\nExample: ai.tts "Hello from Alpa"` };
        }
        return { 
            action: def.action, 
            payload: def.payload ? def.payload(args) : undefined, 
            output: `[AI]: Speaking...`
        };
    }

    case 'AI_OCR': {
        if (args.length < 1) return { output: `Error: Missing file argument.\n\nUsage: ${def.usage}` };
        return { output: `[AI]: Performing OCR on ${args[0]}...\n[SUCCESS]: Extracted text:\n\n"ALPA LANGUAGE\n- AI Native\n- Bilingual\n- Production Ready"` };
    }

    case 'AI_ANALYZE': {
        const contentToAnalyze = args.join(' ');
        if (!contentToAnalyze) {
            return { output: `Error: Missing content to analyze.\n\nUsage: ${def.usage}\nExample: ai.analyze "Alpa is a fantastic language."` };
        }
        
        onOutput({ type: OutputType.RESPONSE, content: '[AI]: Analyzing content...' });

        const analysisPrompt = `Analyze the following text and provide a report for a terminal interface. The report must include these sections with clear headings: "Sentiment", "Key Topics", and "Summary".

Text to analyze: "${contentToAnalyze}"`;
        
        const analysisResult = await generateText(analysisPrompt);
        return { output: `[AI]: Analysis Report\n${analysisResult}` };
    }

    case 'AI_SUMMARIZE': {
        const url = args[0];
        if (!url) {
            return { output: `Error: A URL is required.\n\nUsage: ${def.usage}\nExample: ai.summarize https://en.wikipedia.org/wiki/Artificial_intelligence` };
        }
        
        try {
            new URL(url);
        } catch (_) {
            return { output: `Error: Invalid URL provided.` };
        }
        
        onOutput({ type: OutputType.RESPONSE, content: `[AI]: Simulating content fetch from ${url}...` });
        await sleep(1500);
        onOutput({ type: OutputType.RESPONSE, content: `[OK]: Content retrieved successfully.` });
        onOutput({ type: OutputType.RESPONSE, content: `[AI]: Analyzing and generating summary...` });
        
        const sampleText = `Artificial intelligence is intelligence demonstrated by machines, as opposed to the natural intelligence displayed by humans and other animals. AI research has been defined as the field of study of intelligent agents, which refers to any device that perceives its environment and takes actions that maximize its chance of successfully achieving its goals. The term 'artificial intelligence' had previously been used to describe machines that mimic and display 'human' cognitive skills that are associated with the human mind, such as 'learning' and 'problem-solving'. This definition has since been rejected by major AI researchers who now describe AI in terms of rationality and acting rationally, which does not limit AI to human-like cognition.`;

        const summary = await summarizeText(sampleText);

        return { output: `[AI]: Summary for ${url}\n\n${summary}` };
    }

    case 'RUN': {
      const filePath = args[0];
      if (!filePath) {
        return { output: `Error: A path to an .alpa file is required.\n\nUsage: ${def.usage}` };
      }

      try {
        // Attempt to fetch the file relative to the site (works in browser / deployed site)
        const response = await fetch(filePath, { method: 'GET' });
        if (!response.ok) {
          return { output: `Error: Could not fetch file '${filePath}' (status ${response.status}).` };
        }
        const text = await response.text();
        // Extract print(...) statements
        const printRe = /print\s*\(\s*("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')\s*\)/g;
        const outputs: string[] = [];
        let m;
        while ((m = printRe.exec(text)) !== null) {
          outputs.push(m[1].slice(1, -1));
        }
        if (outputs.length === 0) return { output: '[Alpa RUN] No print statements found in file.' };
        return { output: outputs.join('\n') };
      } catch (e) {
        return { output: `Error: Failed to run file: ${(e as Error).message}` };
      }
    }

    case 'DEPLOY_GHPAGES': {
        const steps = [
            { delay: 500, message: '[BUILD]: Building Alpa static website...' },
            { delay: 1500, message: "[OK]: Production build created in './dist' folder." },
            { delay: 500, message: "[GIT]: Committing changes to 'gh-pages' branch..." },
            { delay: 2000, message: '[DEPLOY]: Pushing to GitHub...' },
            { delay: 1000, message: '[SUCCESS]: Website is now live at: https://your-username.github.io/alpa-lang/' }
        ];

        for (const step of steps) {
            await sleep(step.delay);
            onOutput({ type: OutputType.RESPONSE, content: step.message });
        }
        return {};
    }
    
    case 'DEPLOY_VSC_EXTENSION': {
        const steps = [
            { delay: 500, message: '[VSCE]: Reading extension manifest...' },
            { delay: 1000, message: '[VSCE]: Packaging extension...' },
        ];
        
        for (const step of steps) {
            await sleep(step.delay);
            onOutput({ type: OutputType.RESPONSE, content: step.message });
        }
        
        await sleep(1500);
        onOutput({ type: OutputType.RESPONSE, content: '[OK]: Created alpa-language-support-1.0.0.vsix (1.2 MB).' });

        const packageJsonContent = {
            name: "alpa-language-support",
            displayName: "Alpa Language Support",
            description: "Syntax highlighting and snippets for the Alpa programming language.",
            version: "1.0.0",
            publisher: "AlpaLang",
            engines: {
                vscode: "^1.80.0"
            },
            categories: [
                "Programming Languages"
            ],
            contributes: {
                languages: [{
                    id: "alpa",
                    aliases: ["Alpa", "alpa"],
                    extensions: [".alpa"],
                    configuration: "./language-configuration.json"
                }],
                grammars: [{
                    language: "alpa",
                    scopeName: "source.alpa",
                    path: "./syntaxes/alpa.tmLanguage.json"
                }]
            }
        };

        const vsixContent = `// This is a simulated .vsix package file. 
// In a real scenario, this would be a ZIP archive containing the extension files.
// For demonstration, this text file includes the manifest.

// --- MANIFEST (package.json) ---
${JSON.stringify(packageJsonContent, null, 2)}
`;
        await sleep(500);
        onOutput({ type: OutputType.RESPONSE, content: '[INFO]: Packaging complete. Your file download will start shortly.' });
        onOutput({ type: OutputType.RESPONSE, content: "[INFO]: To publish a real extension, you would run 'vsce publish' in your terminal." });

        return {
            action: 'DOWNLOAD_FILE',
            payload: {
                filename: 'alpa-language-support-1.0.0.vsix.txt',
                content: vsixContent,
                mimeType: 'text/plain'
            }
        };
    }

    case 'DEPLOY_VERCEL': {
        const steps = [
            { delay: 300, message: '[VERCEL]: Deploying project...' },
            { delay: 1000, message: '[VERCEL]: Cloning repository...' },
            { delay: 1500, message: "[VERCEL]: Build command `npm run build` found." },
            { delay: 2000, message: '[VERCEL]: Building project...' },
            { delay: 2500, message: '[VERCEL]: Analyzing output...' },
            { delay: 500, message: '[VERCEL]: Running checks...' },
            { delay: 1000, message: '[SUCCESS]: Deployment complete! Project is live at: https://alpa-lang-demo-' + Math.random().toString(36).substring(2, 8) + '.vercel.app' }
        ];

        for (const step of steps) {
            await sleep(step.delay);
            onOutput({ type: OutputType.RESPONSE, content: step.message });
        }
        return {};
    }

    default:
      if (def.action) {
        const payload = def.payload ? def.payload(args) : undefined;
        return { action: def.action, payload };
      }
      return { output: `Command '${commandAlias}' is recognized but not yet implemented.` };
  }
};