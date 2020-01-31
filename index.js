const express = require('express')
const app = express();
const fetch = require("node-fetch");


const port = process.env.PORT || 3003;

let arr = [];
let showId = '2993';
let totalSeconds = 0;
let numberOfEpisodes = 0;
let numberOfSeasons = 3;
let averageEpisodesPerSeason = 0;
let firstSentence = '';
let episodes = [];
let result;

let roundedAverageEpisodesPerSeason = 0;

function calculateTotalDurationSec() {
    arr.forEach((item) => {
        totalSeconds += item.runtime;
    })
}

function calculateAverageEpisodePerSeason() {
    numberOfEpisodes = arr.length;
    averageEpisodesPerSeason = (numberOfEpisodes / numberOfSeasons);
    roundedAverageEpisodesPerSeason = Math.round(averageEpisodesPerSeason * 10) / 10;
}


function createEpisodeObj() {

    arr.forEach(function (item) {
        let epiName = item.name;
        let split = epiName.split(': ');
        let shortTitle = split[1];

        function Epoch(date) {
            return Math.round(new Date(date).getTime() / 1000.0);
        }

        let summary = item.summary;

        if (summary != null) {
            if (summary.length > 1) {
                let splitSummary = summary.split('.');
                let multiSplit = splitSummary[0].split('>');
                firstSentence = multiSplit[1];

                if (!firstSentence.endsWith('.')) {
                    firstSentence.concat('', '.');
                }
            }
        } else {
            firstSentence = 'n/a'
        }

        let sequence = `S${item.season}E${item.number}`;
        let id = item.id;
        let airTimeStamp = Epoch(item.airstamp);

        const episodeObj = {
            [id]: {
                "sequenceNumber": sequence,
                "shortTitle": shortTitle,
                "airTimeStamp": airTimeStamp,
                "shortSummary": firstSentence
            }
        }
        episodes.push(episodeObj);
    })

    let jsonData = {
        [showId]: {
            "totalDurationSec": totalSeconds,
            "averageEpisodesPerSeason": roundedAverageEpisodesPerSeason,
            "episodes": {
                ...episodes
            }
        }
    }

    result = jsonData;
    console.log(result);
}

const getData = fetch(`http://api.tvmaze.com/shows/${showId}/episodes`)
    .then((res) => res.json())
    .then((data) => {
        arr.push(...data);

        calculateTotalDurationSec();
        calculateAverageEpisodePerSeason();

    })
    .then(() => createEpisodeObj())
    .catch((err) => console.log(`Error: ${err}`));

app.get('/', (req, res) => {
    res.json(result).status(200)
})

module.exports = app.listen(port, () => {
    console.log(`Server is running on port: ${port}`)
})

