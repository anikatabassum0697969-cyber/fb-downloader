const express = require('express');
const { execFile } = require('child_process');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(__dirname));

app.post('/get-video', (req, res) => {
    const videoUrl = req.body.url;
    try { 
        new URL(videoUrl); 
    } catch (_) {
        return res.status(400).json({ error: 'সঠিক লিংক দিন' });
    }

    const args = [
        '-g',
        '-f', 'best[ext=mp4]/best',
        '--no-playlist',
        '--user-agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        videoUrl
    ];

    execFile('yt-dlp', args, (error, stdout, stderr) => {
        if (error) {
            console.error('yt-dlp Error:', stderr || error.message);
            return res.status(500).json({ 
                error: 'ভিডিওটি প্রাইভেট অথবা সার্ভার থেকে ব্লক করা হয়েছে।' 
            });
        }
        
        const directUrl = stdout.trim().split('\n')[0];
        res.json({ downloadUrl: directUrl });
    });
});

app.listen(PORT, () => {
    console.log(`সার্ভার চলছে পোর্ট ${PORT}-এ`);
});
