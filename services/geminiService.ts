import { GoogleGenAI, Chat } from "@google/genai";

// Use a variable that can be lazily initialized.
let ai: GoogleGenAI | null = null;

/**
 * Lazily initializes and returns the GoogleGenAI client instance.
 * This prevents the app from crashing on load if the API key is missing or invalid.
 */
const getAiClient = (): GoogleGenAI => {
  if (!ai) {
    // Initialize on first use, as per the guidelines.
    ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }
  return ai;
};

/**
 * Handles errors from the Google GenAI API, providing user-friendly messages.
 * @param error The error object caught.
 * @param context A string describing the operation that failed (e.g., 'text generation').
 * @returns A formatted, user-friendly error string.
 */
const handleApiError = (error: unknown, context: string): string => {
    console.error(`Error during ${context}:`, error);
    if (error instanceof Error) {
        if (error.message.includes('API key not valid') || error.message.includes('API_KEY_INVALID')) {
            return `Error: Your API key is invalid or missing.
Please ensure the API_KEY environment variable is set correctly. The application cannot function without a valid key.`;
        }
        return `Error from AI service during ${context}: ${error.message}`;
    }
    return `An unknown error occurred during ${context}.`;
};


/**
 * Generates text content using the Gemini model.
 * @param prompt The text prompt to send to the model.
 * @returns The generated text as a string.
 */
export const generateText = async (prompt: string): Promise<string> => {
  try {
    const client = getAiClient();
    const response = await client.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    return handleApiError(error, 'text generation');
  }
};

/**
 * Generates a summary for a given block of text.
 * @param text The text to summarize.
 * @returns A concise summary of the text.
 */
export const summarizeText = async (text: string): Promise<string> => {
  try {
    const client = getAiClient();
    const prompt = `Provide a concise, one-paragraph summary of the following text:\n\n---\n${text}\n---`;
    const response = await client.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    return handleApiError(error, 'text summarization');
  }
};

/**
 * Creates a new chat session.
 * @returns A Chat instance.
 */
export const createChat = (): Chat => {
    const client = getAiClient();
    return client.chats.create({ model: 'gemini-2.5-flash' });
};

/**
 * Sends a message to an ongoing chat session.
 * @param chat The chat instance to send the message to.
 * @param message The user's message.
 * @returns The AI's response text.
 */
export const sendMessage = async (chat: Chat, message: string): Promise<string> => {
    try {
        const response = await chat.sendMessage({ message });
        return response.text;
    } catch (error) {
        return handleApiError(error, 'chat message');
    }
};

/**
 * Generates an image using the Imagen model.
 * @param prompt The text prompt to generate the image from.
 * @returns A base64 encoded data URL of the generated image.
 */
export const generateImage = async (prompt: string): Promise<string> => {
  try {
    const client = getAiClient();
    const response = await client.models.generateImages({
      model: 'imagen-4.0-generate-001',
      prompt: prompt,
      config: {
        numberOfImages: 1,
        outputMimeType: 'image/jpeg',
        aspectRatio: '1:1',
      },
    });
    
    if (response.generatedImages && response.generatedImages.length > 0) {
      const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
      return `data:image/jpeg;base64,${base64ImageBytes}`;
    } else {
      return "Could not generate image. The response was empty.";
    }

  } catch (error) {
    return handleApiError(error, 'image generation');
  }
};


/**
 * Generates a text description for a given image.
 * @param base64ImageData The base64 encoded image data (without the 'data:image/jpeg;base64,' prefix).
 * @param prompt The text prompt to guide the description.
 * @returns A text description of the image.
 */
export const generateDescriptionForImage = async (base64ImageData: string, prompt: string): Promise<string> => {
    try {
        const client = getAiClient();
        const imagePart = {
            inlineData: {
                mimeType: 'image/jpeg',
                data: base64ImageData,
            },
        };
        const textPart = {
            text: prompt || "Describe what you see in this image in detail.", // Default prompt if user provides none
        };

        const response = await client.models.generateContent({
            model: 'gemini-2.5-flash', // This model is multimodal
            contents: { parts: [imagePart, textPart] },
        });

        return response.text;
    } catch (error) {
       return handleApiError(error, 'image analysis');
    }
};