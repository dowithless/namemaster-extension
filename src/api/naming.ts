import Axios from "axios";

const baseURL = process.env.API_URL || "https://www.namemaster.org";

const axios = Axios.create({ baseURL });

interface GenerateNamingSuggestionsParams {
  key: string;
  text: string;
  language: string;
}
interface GenerateNamingSuggestionsReturns {
  error?: string;
  match: string;
  kind: string;
  results: { name: string; desc: string }[];
}

export async function generateNamingSuggestions(
  params: GenerateNamingSuggestionsParams
): Promise<GenerateNamingSuggestionsReturns> {
  const { key, text, language } = params;

  const { data } = await axios.get("/api/naming", {
    params: { key, language, text },
  });

  return data;
}
