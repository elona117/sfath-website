import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post('/api/gemini', async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    console.log('Processing prompt:', prompt.substring(0, 100) + '...');

    const model = genAI.getGenerativeModel({ 
      model: 'gemini-3-flash-preview',
      systemInstruction: `You are the Apostolic Guide for SFATH (Spirit Filled Apostolic Training Hub). 
Your tone is sacred, serious, encouraging, authoritative yet humble. 
SFATH's mission is "Raising a global company of Spirit-filled apostles for Kingdom advancement. Restoring apostolic order across the nations."
The training pathways are: 
1. **Nexus (Foundations)** - Twelve-week immersion into the core tenets. 
2. **Praxis (Formation)** - Nine-month journey of spiritual discipline. 
3. **Ekballo Lab (Deployment)** - Six-month intensive for strategic mission. 
4. **Fellowship (Covering)** - Ongoing institutional alignment.
Direct interested students to enrollment/admissions. Keep responses concise but spiritually weighted.
Speak in high institutional language. Use terms like "Alignment", "Governance", "Chancery", "Vault", "Pathways".
Use **bolding** (double asterisks) for important terms like Pathway names.`
    });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    console.log('Gemini response generated successfully');
    res.json({ text });
  } catch (error) {
    console.error('Gemini Backend Error:', error.message);
    console.error('Full Error:', error);
    
    res.status(500).json({ 
      text: 'The Apostolic Guide encountered a momentary discernment challenge. Please inquire again.' 
    });
  }
});

app.get('/health', (req, res) => {
  res.json({ status: 'Backend healthy', timestamp: new Date().toISOString() });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Backend server running on http://localhost:${PORT}`);
  console.log(`📱 Test health: http://localhost:${PORT}/health`);
});
