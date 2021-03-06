const express = require('express'),
    app = express(),
    fetch = require("node-fetch"),
    port = 3001;

let arr = [],
    showId = '2993',
    totalSeconds = 0,
    numberOfEpisodes,
    numberOfSeasons = 3,
    averageEpisodesPerSeason,
    roundedAverageEpisodesPerSeason,
    firstSentence = '',
    episodes = [],
    result;

function calculateTotalDurationSec() {
    arr.forEach((item) => {
        let seconds = (item.runtime * 60)
        totalSeconds += seconds;
    })
}

function calculateAverageEpisodePerSeason() {
    numberOfEpisodes = arr.length;
    averageEpisodesPerSeason = (numberOfEpisodes / numberOfSeasons);
    roundedAverageEpisodesPerSeason = Math.round(averageEpisodesPerSeason * 10) / 10;
}

function createEpisodeObj() {

    // short title
    arr.forEach(function (item) {
        let epiName = item.name,
            split = epiName.split(': '),
            shortTitle = split[1];

        // date
        function Epoch(date) {
            return Math.round(new Date(date).getTime() / 1000.0);
        }

        // summary
        let summary = item.summary;

        if (summary != null) {
            if (summary.length > 1) {
                let splitSummary = summary.split('>'),
                    multiSplit = splitSummary[1].split('.');

                    let newSplitUp, sentence;
                    if(multiSplit[0] == "Dr" || multiSplit[0] == "Mr" || multiSplit[0] == "Mrs") {
                        newSplitUp = multiSplit[0].concat('', '.')
                        sentence = newSplitUp.concat(multiSplit[1])
                        firstSentence = sentence;
                    }


                if (!firstSentence.endsWith('.')) {
                    firstSentence = firstSentence.concat('', '.');
                }
            }
        } else {
            firstSentence = 'n/a'
        }

        // sequence
        let sequence = `S${item.season}E${item.number}`,
            id = item.id,
            airTimeStamp = Epoch(item.airstamp);

        // episode object
        const episodeObj = {
            [id]: {
                "sequenceNumber": sequence,
                "shortTitle": shortTitle,
                "airTimeStamp": airTimeStamp,
                "shortSummary": firstSentence
            }
        }
        // push to episodes array
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

// fetch data + create json
const getData = fetch(`http://api.tvmaze.com/shows/${showId}/episodes`)
    .then((res) => res.json())
    .then((data) => {
        arr.push(...data);
        data1 = data;
        console.log(data);
        calculateTotalDurationSec();
        calculateAverageEpisodePerSeason();
    })
    .then(() => createEpisodeObj())
    .catch((err) => console.log(`Error: ${err}`));

// GET route for json
app.get('/', (req, res) => {
    res.json(result).status(200)
})

module.exports = app.listen(port, () => {
    console.log(`Server is running on port: ${port}`)
})

