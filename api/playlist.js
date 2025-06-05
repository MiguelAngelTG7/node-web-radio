// api/playlist.js
import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  const musicDir = path.join(process.cwd(), 'public', 'music');

  fs.readdir(musicDir, (err, files) => {
    if (err) {
      res.status(500).json({ error: 'No se pudo leer la carpeta de música' });
      return;
    }

    const mp3Files = files.filter(file => file.endsWith('.mp3'));
    res.status(200).json(mp3Files);
  });
}
