// requiring dependencies for app
const express = require('express');
const fs = require('fs');
const youtubedl = require('youtube-dl');
const app = express.Router();

// routes
app.post('/', (req, res) => {
    const input = req.body.cta;
    url = req.body.url;
    process.env.UV_THREADPOOL_SIZE = 128;

    if (input === "video" && matchYoutubeUrl(url)) {
        try{
            youtubedl.getInfo(url, (err, info) => {
                if (err) {
                    res.status(404).send(err);
                }
        
                const video = youtubedl(url,
                    // Optional arguments passed to youtube-dl.
                    ['--format=best'],
                    // Additional options can be given for calling `child_process.execFile()`.
                    { cwd: __dirname })
                
                // Will be called when the download starts.
                video.on('info', function (info) {
                    console.log('Download started')
                    console.log('filename: ' + info._filename)
                    console.log('size: ' + info.size)
                })
        
                video.pipe(res.attachment(`${info._filename}.mp4`));
            })
        }
        catch (ex) {
            console.log(ex.message);
            res.render('error-handler', {msg: ex.message});
        }
    } else if(input === "audio" && matchYoutubeUrl(url)) {
        try {
            youtubedl.getInfo(url, (err, info) => {
                if (err) {
                    res.status(404).send(err);
                }
        
                const video = youtubedl(url,
                    // Optional arguments passed to youtube-dl.
                    ['--format=bestaudio'],
                    // Additional options can be given for calling `child_process.execFile()`.
                    { cwd: __dirname })
                
                // Will be called when the download starts.
                video.on('info', function (info) {
                    console.log('Download started')
                    console.log('filename: ' + info._filename)
                    console.log('size: ' + info.size)
                })
                
                // sending file to client
                video.pipe(res.attachment(`${info._filename}.mp3`));
            })
        }
        catch (ex) {
            console.log(ex.message);
            // redirecting to error handler route and page
            res.render('error-handler', {msg: ex.message});
        }
    } else {
        // redirecting to error handler route and page
        res.redirect('/er1/er2/er3');
    }
})

// for validating the url which is from youtube or not
function matchYoutubeUrl(url) {
    var p = /^(?:https?:\/\/)?(?:m\.|www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
    if(url.match(p)){
        return url.match(p)[1];
    }
    return false;
}

module.exports = app;