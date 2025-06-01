import axios from 'axios';
import { MessageInterface } from '@/types/types';
import { API_KEY, API_URL } from '@/config/runpodConfigs';

export async function callChatBotAPI(messages: MessageInterface[]): Promise<MessageInterface> {
  try {
    const response = await axios.post(API_URL, {
      input: { messages }
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      }
    });

    console.log('Runpod Response:', response.data);   // ✅ Logs the API response

    // Improved error handling for axios responses
    if (response.status !== 200) {
      throw new Error(`Chatbot API error: ${response.status} - ${response.statusText || 'Unknown error'}`);
    }

    if (!response.data) {
      throw new Error('Chatbot API returned an empty data object');
    }

    const output = response.data;
    if (!output['output']) {
      throw new Error('Chatbot API response is missing the "output" field');
    }
    const outputMessage: MessageInterface = output['output'];

    return outputMessage;

  } catch (error: any) {
    console.error('Error calling the API:', error);

    let errorMessage = "Sorry, I'm having trouble responding right now. Please try again later.";

    if (error.response) {
      // Axios-specific error handling with more details
      errorMessage = error.response.data?.message || error.response.data || errorMessage;
      console.error('API Error Details:', error.response.data);
    } else if (error.request) {
      errorMessage = error.message || "Network error. Please check your connection.";
      console.error('Network Error:', error.request);
    } else {
      errorMessage = error.message || error.toString() || errorMessage;
    }

    // ⛔ Fallback message in case of API failure
    return {
      role: 'assistant',
      content: errorMessage
    };
  }
}