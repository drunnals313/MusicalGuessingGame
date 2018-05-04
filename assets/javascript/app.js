$(document).ready(function() {

    var choices = [];
    var bank = [];
    var randomBank = [];
    var ansBank = [];
    var arrOfArrs = [];
    var randomAnsBank = [];
    var bankLink = [];
    var choicesLink = [];
    var choicesTimes = [];
    var question;
    var incorrect;
    var userGuess;
    var clicks = 0;
    var gameLength = 20;
    var time = 0;
    var intervalId;
    var correctAns = 0;
    var totalQs = 0;
    var windowTimeout;
    var questionCounter = 0;

    function authenticate(query) {
        var auth = {
            url: "https://fathomless-eyrie-24498.herokuapp.com/spotify/authenticate",
            method: "GET"
        }
        $.ajax(auth).done(function (response) {
            var authToken = response;
            search(authToken, query);
        });
    };

    function search(authToken, query) {
        var searchParam = {
            "async": true,
            "crossDomain": true,
            "url": `https://fathomless-eyrie-24498.herokuapp.com/spotify/${authToken}/search?q=${query}&type=track`,
            "method": "GET"
        }
          
        $.ajax(searchParam).done(function (response) {
            var results = response.tracks.items;            
            var indexChecker = [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19];
            var currentWrongAnswers = [];
            var currentIncorrect = [];
            bankLink = [];
            ansBank = [];
            randomBank = [];
            bank = [];
            choices = [];
            choicesLink = [];
            bankTimes = [];
            for ( i = 0; i < results.length; i++) {
                bank.push(results[i].name);
                bankLink.push(results[i].uri);
                bankTimes.push(results[i].duration_ms);
            }
            for ( j = 0; j < bank.length; j++) {
                num = Math.floor(Math.random() * (indexChecker.length - 1))
                randomIndex = indexChecker[num];
                choices[randomIndex] = bank[j];
                choicesLink[randomIndex] = bankLink[j];
                choicesTimes[randomIndex] = bankTimes[j];
                time = Math.floor(choicesTimes[0] / 1000);
                indexChecker.splice(num, 1);
            }
            for ( k = 0; k < choices.length; k++) {
                ansBank.push(choices[k]);
                createRandomBank(randomBank);
                for ( l = 0; l < 3; l++) {
                    if (choices[k] == randomBank[l]) {
                        ansBank.push(randomBank[l+4]);
                    } else {
                        ansBank.push(randomBank[l]);
                    }
                }
            }
            var arr = [];
            var counter = 0;
            for ( m = 0; m < ansBank.length; m++) {
                var currentArrayElement = ansBank[m];
                if ( counter == 3) {
                    currentWrongAnswers.push(currentArrayElement);
                    arrOfArrs.push(currentWrongAnswers);
                    currentWrongAnswers = [];
                    counter = 0;
                } else {
                    currentWrongAnswers.push(currentArrayElement);
                    counter++;
                }
            }
            renderButtons();
        }).fail(function (error) { 
            if(error.message == "Invalid access token") {
                var token = authenticate();
                authenticate(query);
            }
        });
    }

    function createRandomBank() {
        randomBank = [];
        var indexCheckerTwo = [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19];
        for ( i = 0; i < bank.length; i++) {
            num = Math.floor(Math.random() * (indexCheckerTwo.length - 1))
            randomIndex = indexCheckerTwo[num];
            randomBank[randomIndex] = bank[i];
            indexCheckerTwo.splice(num, 1);
        }
    }

    function randomizeAnswers() {
        randomAnsBank = [];
        var indexCheckerThree = [ 0, 1, 2, 3];
        for ( i = 0; i < 4; i++) {
            num = Math.floor(Math.random() * (indexCheckerThree.length - 1))
            randomIndex = indexCheckerThree[num];
            randomAnsBank[randomIndex] = arrOfArrs[questionCounter][i];
            indexCheckerThree.splice(num, 1);
        }
    }

    function getGiphy() {
        var giphyURL = "https://api.giphy.com/v1/gifs/random?api_key=dc6zaTOxFJmzC&tag=no";
        $.ajax({
            url: giphyURL,
            method: "GET"
        }).then(function(response) {
            var results = response.data;
            var noGif = $("<img>");
            noGif.attr("src", results.images.fixed_height.url);
            $("#victory").append(noGif);
        })
    }

    function renderButtons() {
        $("#displayButtons").empty();
        randomizeAnswers();
        displaySong();
        for (var i = 0; i < randomAnsBank.length; i++) {
            var a = $("<button>");
            a.addClass("btn");
            a.addClass('btn-block')
            a.attr("data-name", randomAnsBank[i]);
            a.text(randomAnsBank[i]);
            $("#displayButtons").append(a); 
        }
        questionCounter++;
    };

    function displaySong() {
        currentUri = choicesLink[questionCounter];
        $("#playButton").html('<iframe src="https://open.spotify.com/embed?uri=' + currentUri + '" width="300" height="80" allowtransparency="true" allow="encrypted-media"></iframe>')
    }

    function displayAnswer() {
        if ( time === 0 ) {
            loss();
            timeOut();
            $("#timer").html("<h3>Oh No! Times Up!</h3>");
        } else if ( userGuess == choices[questionCounter-1] ) {
            clearScreen();
            correctAns++;
            stewie = "assets/images/stewie.jpg";
            img = $("<img>");
            img.attr("src", stewie);
            $("#victory").append(img);
            timeOut();
        } else if ( userGuess !== choices[questionCounter-1] ) {
            loss();
            timeOut();
        }
        totalQs++;
    }

    function clearScreen() {
        $("#playButton").empty();
        $("#victory").empty();
        $("#displayButtons").empty();
        $("#timer").empty();
    }

    function run() {
        clearInterval(intervalId);
        intervalId = setInterval(decrement, 1000);
    }
    
    function decrement() {
        time--;
        $("#timer").html("Time Left: " + time);
        if ( time === 0) {
            stop();
            displayAnswer();
        }
    }

    function stop() {
        clearInterval(intervalId);
    }

    function timeOut() {
        windowTimeout = setTimeout(function() {
            clearScreen();
            time = Math.floor(choicesTimes[questionCounter] / 1000);
            run();
            renderButtons();
        }, 3000);
    }

    function loss() {
        clearScreen();
        getGiphy();
    }

    function endGame() {
        if ( totalQs === gameLength ) {
            clearScreen();
            $("#victory").html("Game Over!<br>You Scored " + correctAns + " Out of " + totalQs);
            clearTimeout(windowTimeout);
            restartGame();
        }
    }

    function restartGame() {
        totalQs = 0;
        correctAns = 0;
        clicks = -1;
        var btn = $("<button>");
        btn.attr("id", "start");
        btn.text("Restart Game!")
        $("#displayButtons").append(btn);
    }
    
    $("#displayButtons").on("click", "button", function(event) {
        event.preventDefault();
        query = $("#artist-input").val();
        if ( clicks === 0 ) {
            $("#victory").empty();
            $("#button-form").empty();
            authenticate(query);
            // run();
        } else {
            $("#victory").empty();
            userGuess = $(this).attr("data-name");
            displayAnswer();
            stop();
            endGame();
        }
        clicks++;
    })
    $("#playButton").on("click", function() {
        console.log("clicked");
    });      

})