export default async function handler(req, res) {
  const fs = require('fs');
  const path = require('path');

  const musicDir = path.join(process.cwd(), 'public', 'music');
  try {
    const files = fs.readdirSync(musicDir).filter(f => f.endsWith('.mp3'));
    res.status(200).json(files);
  } catch (err) {
    res.status(500).json({ error: 'Error loading music files.' });
  }
}


