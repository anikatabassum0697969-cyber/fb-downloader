const express = require('express');
const { execFile } = require('child_process');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(__dirname));

app.post('/get-video', (req, res) => {
    const videoUrl = req.body.url;
    try { new URL(videoUrl); } catch (_) {
        return res.status(400).json({ error: 'সঠিক লিংক দিন' });
    }

    // অনলাইন লিনাক্স সার্ভারে সরাসরি 'yt-dlp' চলবে
    execFile('yt-dlp', ['-g', '-f', 'best', '--no-playlist', videoUrl], (error, stdout) => {
        if (error) {
            return res.status(500).json({ error: 'ভিডিওটি প্রাইভেট অথবা ডাউনলোডযোগ্য নয়।' });
        }
        res.json({ downloadUrl: stdout.trim() });
    });
});

app.listen(PORT, () => {
    console.log(`সার্ভার চলছে পোর্ট ${PORT}-এ`);
});
