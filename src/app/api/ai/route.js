import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env["OPENAI_API_KEY"], // This is the default and can be omitted
});

const exampleResponse = {
  question: "What is photosynthesis?",
  answer: "Photosynthesis is the process by which green plants and some other organisms use sunlight to synthesize foods with the help of chlorophyll pigments.",
  explanation: [
    {
      step: "Light Absorption",
      description: "Chlorophyll in plant cells absorbs light energy, primarily from the sun.",
      keyPoints: ["Occurs in chloroplasts", "Green pigment absorbs light"]
    },
    {
      step: "Water Splitting",
      description: "Light energy splits water molecules into hydrogen and oxygen.",
      keyPoints: ["Oxygen is released as byproduct", "Hydrogen is used in next steps"]
    },
    {
      step: "Glucose Formation",
      description: "Carbon dioxide from air combines with hydrogen to form glucose (sugar).",
      keyPoints: ["Glucose stores energy", "Used for plant growth"]
    }
  ],
  formula: "6CO₂ + 6H₂O + Light Energy → C₆H₁₂O₆ + 6O₂"
};

export async function GET(req) {
  // WARNING: Do not expose your keys
  // WARNING: If you host publicly your project, add an authentication layer to limit the consumption of ChatGPT resources

  const question = req.nextUrl.searchParams.get("question") || "What is the Pythagorean theorem?";

  const chatCompletion = await openai.chat.completions.create({
    messages: [
      {
        role: "system",
        content: `You are a knowledgeable science and mathematics teacher. 
Your student asks you questions about science, mathematics, physics, chemistry, biology, or any academic subject.
You should provide clear, educational explanations suitable for students.

You should respond with: 
- question: Restate the question clearly
- answer: A concise, clear answer to the question
- explanation: Break down the concept into steps or key points (array of objects with step, description, and keyPoints)
- formula: If applicable, include any relevant formulas or equations (optional)

Example response format: ${JSON.stringify(exampleResponse)}
`,
      },
      {
        role: "system",
        content: `You always respond with a JSON object with the following format: 
        {
          "question": "",
          "answer": "",
          "explanation": [{
            "step": "",
            "description": "",
            "keyPoints": ["", ""]
          }],
          "formula": ""
        }
        
        The formula field is optional and should only be included if relevant to the question.`,
      },
      {
        role: "user",
        content: question,
      },
    ],
    // model: "gpt-4-turbo-preview", // https://platform.openai.com/docs/models/gpt-4-and-gpt-4-turbo
    model: "gpt-3.5-turbo", // https://help.openai.com/en/articles/7102672-how-can-i-access-gpt-4
    response_format: {
      type: "json_object",
    },
  });
  console.log(chatCompletion.choices[0].message.content);
  return Response.json(JSON.parse(chatCompletion.choices[0].message.content));
}
