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
        return res.status(400).json({ error: 'Please enter a valid Facebook URL.' });
    }

    const args = [
        '-g',
        '-f', 'best[ext=mp4]/best',
        '--no-playlist',
        '--no-check-certificates',
        '--geo-bypass',
        '--user-agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
        '--add-header', 'Accept-Language:en-US,en;q=0.9',
        '--add-header', 'Sec-Fetch-Mode:navigate',
        videoUrl
    ];

    execFile('yt-dlp', args, (error, stdout, stderr) => {
        if (error || !stdout.trim()) {
            console.error('yt-dlp Error:', stderr || error.message);
            return res.status(500).json({ 
                error: 'Could not fetch video. Make sure the video is Public or try again.' 
            });
        }
        
        const directUrl = stdout.trim().split('\n')[0];
        res.json({ downloadUrl: directUrl });
    });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
