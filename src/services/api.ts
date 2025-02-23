import axios from "axios";
import { OpenAI_API_KEY, API_BASE_URL } from "../config/constants";
import { supabase } from "../config/supabase";

export const transcribeImage = async (file: File): Promise<string> => {
  try {
    const base64Image = await fileToBase64(file);
    // Remove the data:image prefix from base64 string
    const base64WithoutPrefix = base64Image.split(',')[1];

    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4o",
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: "Please transcribe this text. Correct any spelling mistakes and grammatical errors. Do not include any introductions, explanations, or headers. Only output the corrected text."
              },
              {
                type: "image_url",
                image_url: {
                  url: `data:image/jpeg;base64,${base64WithoutPrefix}`
                }
              }
            ]
          }
        ],
        max_tokens: 500,
        temperature: 0
      },
      {
        headers: {
          'Authorization': `Bearer ${OpenAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    // Extract the transcribed text from the response
    const transcribedText = response.data.choices[0]?.message?.content || "No text detected";
    return transcribedText;
  } catch (error: any) {
    console.error("Error transcribing image:", error.response?.data || error.message);
    throw error;
  }
};

// Helper function to convert File to base64
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('Failed to convert file to base64'));
      }
    };
    reader.onerror = (error) => reject(error);
  });
};

export interface TranscriptionSubmission {
  content: string;
  original_files: string[];  // Changed to snake_case for Supabase
  created_at: Date;
}

export const submitTranscriptions = async (
  transcriptions: string[], 
  files: File[]
): Promise<any> => {
  try {
    const combinedText = transcriptions.join('\n\n---\n\n');
    const fileNames = files.map(file => file.name);

    // Get the current user data
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) throw new Error('No authenticated user');

    const { data, error } = await supabase
      .from('transcriptions')
      .insert({
        content: combinedText,
        original_files: fileNames,
        created_at: new Date().toISOString(),
        user_id: user.id
      });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error submitting transcriptions:", error);
    throw error;
  }
};

export interface JournalEntry {
  id: string;
  title: string;
  content: string;
  created_at: string;
  user_id: string;
}

export const getJournalEntries = async (): Promise<JournalEntry[]> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) throw new Error('No authenticated user');

    const { data, error } = await supabase
      .from('journal_entries')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error fetching journal entries:", error);
    throw error;
  }
};

export const submitJournalEntry = async (title: string, content: string): Promise<void> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) throw new Error('No authenticated user');

    const { error } = await supabase
      .from('journal_entries')
      .insert({
        title,
        content,
        user_id: user.id,
        created_at: new Date().toISOString()
      });

    if (error) throw error;
  } catch (error) {
    console.error("Error submitting journal entry:", error);
    throw error;
  }
};

export const generateTitle = async (content: string): Promise<string> => {
  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are a helpful assistant that generates concise, descriptive titles for journal entries. Keep titles under 50 characters."
          },
          {
            role: "user",
            content: `Generate a title for this journal entry:\n\n${content}`
          }
        ],
        max_tokens: 50,
        temperature: 0.7
      },
      {
        headers: {
          'Authorization': `Bearer ${OpenAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const title = response.data.choices[0]?.message?.content?.trim() || "Untitled Entry";
    return title;
  } catch (error: any) {
    console.error("Error generating title:", error.response?.data || error.message);
    throw error;
  }
};

export const analyzeJournalEntries = async (
  content: string,
  type: 'themes' | 'focus' | 'mood' | 'goals'
): Promise<string[]> => {
  const prompts = {
    themes: "Analyze these journal entries and identify 3-5 recurring themes or patterns. List each point on a new line starting with a bullet point (•). Do not use markdown formatting.",
    focus: "Based on these journal entries, suggest 3-4 areas or activities the writer should focus on for personal growth. List each point on a new line starting with a bullet point (•). Do not use markdown formatting.",
    mood: "Analyze the emotional tone of these entries and provide 3-4 insights about the writer's emotional patterns. List each point on a new line starting with a bullet point (•). Do not use markdown formatting.",
    goals: "Extract and analyze any mentioned goals or aspirations, and provide 3-4 suggestions for achieving them. List each point on a new line starting with a bullet point (•). Do not use markdown formatting."
  };

  try {
    console.log('Analyzing content:', content.substring(0, 100) + '...');
    console.log('Analysis type:', type);

    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "You are an insightful AI that analyzes journal entries to provide helpful insights. Be concise and specific. Format your response as a bullet-pointed list, with each point on a new line starting with •. Do not use markdown formatting."
          },
          {
            role: "user",
            content: `${prompts[type]}\n\nJournal entries:\n${content}`
          }
        ],
        max_tokens: 250,
        temperature: 0.7
      },
      {
        headers: {
          'Authorization': `Bearer ${OpenAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    console.log('API Response:', response.data);

    const analysis = response.data.choices[0]?.message?.content || "";
    const items = analysis
      .split('\n')
      .filter(Boolean)
      .map((item: string) => 
        item
          .replace(/^[•\-\d.]+\s*/, '') // Remove bullet points and numbers
          .replace(/\*\*/g, '') // Remove bold markdown
          .replace(/\*/g, '') // Remove italic markdown
          .replace(/`/g, '') // Remove code markdown
          .trim()
      )
      .filter((item: string) => item.length > 0); // Add type annotation here

    console.log('Processed items:', items);

    if (items.length === 0) {
      throw new Error('No insights were generated from the analysis');
    }

    return items;
  } catch (error: any) {
    console.error("Error analyzing journal entries:", {
      error: error.response?.data || error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      headers: error.response?.headers,
    });
    throw error;
  }
}; 