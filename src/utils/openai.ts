import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const MODEL = "text-davinci-003";

export async function generateSongList(
  title: string,
  description: string,
  categories: string[]
) {
  const songs = 20;
  const response = await openai.createCompletion({
    model: MODEL,
    prompt: `Instructions:
      \n- Generate a top ${songs} list of songs playlist that is related to the "Book Title: ", "Description: " and "Categories: "
      \n\nBook Title: ${title}  
      \nDescription: ${description}
      \nCategories: ${categories}
      \n\n\nPlaylist: `,
    temperature: 0.7,
    max_tokens: 512,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
  });

  return response.data;
}
