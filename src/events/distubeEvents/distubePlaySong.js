// src/events/distubeEvents/distubePlaySong.js
const shared = require('./shared');

module.exports = (distube) => {
    distube.on('playSong', (queue, song) => {
        if (queue.leaveTimeout) {
            clearTimeout(queue.leaveTimeout);
            queue.leaveTimeout = null;
        }
    });
};