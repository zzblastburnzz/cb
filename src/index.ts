
import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

let mockDB: any = {}; // Database tạm thời

app.post('/add-child', (req, res) => {
  const { phone, child } = req.body;
  if (!phone || !child) return res.status(400).send('Missing phone or child');
  if (!mockDB[phone]) mockDB[phone] = { children: [] };
  if (mockDB[phone].children.length >= 2) return res.status(403).send('Max 2 children allowed');

  mockDB[phone].children.push({ ...child, progress: {}, rewards: { stars: 0, stickers: [], unlockedSkins: [] } });
  res.status(200).send('Child added');
});

app.patch('/update-progress', (req, res) => {
  const { phone, childIndex = 0, subject, amount } = req.body;
  const child = mockDB[phone]?.children?.[childIndex];
  if (!child) return res.status(404).send('Child not found');

  child.progress[subject] = Math.min((child.progress[subject] || 0) + amount, 100);
  res.status(200).send('Progress updated');
});

app.patch('/unlock-reward', (req, res) => {
  const { phone, childIndex = 0, rewardType, reward } = req.body;
  const child = mockDB[phone]?.children?.[childIndex];
  if (!child) return res.status(404).send('Child not found');

  if (rewardType === 'stars') child.rewards.stars += reward;
  else if (rewardType === 'stickers' || rewardType === 'unlockedSkins') {
    child.rewards[rewardType].push(reward);
  }

  res.status(200).send('Reward granted');
});

app.get('/get-parent-info', (req, res) => {
  const phone = req.query.phone as string;
  if (!mockDB[phone]) return res.status(404).send('Parent not found');
  res.status(200).json(mockDB[phone]);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
