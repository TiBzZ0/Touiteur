require("dotenv").config();
const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

module.exports = {
  ask: async (req, res) => {
      const { message } = req.body;
      
      try {
        const completion = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                { role: "system", content: "Tu es l'ia de touiteur.be, Tu t'appel Fryte. Si tu envoi du latex, encardre le de '$', ne renvoi pas de markdown." },
                { role: "user", content: message }
            ],
        });

        res.json({ reply: completion.choices[0].message.content });

      } catch (error) {
        console.error("Erreur IA détaillée :", JSON.stringify(error, null, 2));
        res.status(500).json({ error: "Erreur IA" });
    }
  },

  generateImage: async (req, res) => {
    const { prompt } = req.body;

    try {
      const response = await openai.images.generate({
        model: "dall-e-3",
        prompt,
        n: 1,
        size: "1024x1024"
      });

      res.json({ imageUrl: response.data[0].url });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erreur génération image." });
    }
  },

}
