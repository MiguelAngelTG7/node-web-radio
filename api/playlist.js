import fs from 'fs';
import path from 'path';
import { parseFile } from 'music-metadata';

export default async function handler(req, res) {
  const musicDir = path.join(process.cwd(), 'public', 'music');
  try {
    const files = fs.readdirSync(musicDir).filter(f => f.endsWith('.mp3'));

    const tracks = await Promise.all(
      files.map(async (file) => {
        const filePath = path.join(musicDir, file);
        const metadata = await parseFile(filePath);
        const common = metadata.common;

        let pictureBase64 = null;
        if (common.picture && common.picture.length > 0) {
          const pic = common.picture[0];
          const base64 = pic.data.toString('base64');
          pictureBase64 = `data:${pic.format};base64,${base64}`;
        }

        return {
          file,
          title: common.title || file,
          artist: common.artist || 'Unknown Artist',
          album: common.album || 'Unknown Album',
          year: common.year || 'Unknown Year',
          cover: pictureBase64
        };
      })
    );

    res.status(200).json(tracks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error loading music files.' });
  }
}
