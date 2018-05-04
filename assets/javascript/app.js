$(document).ready(function() {

    var choices = [];
    var bank = [];
    var randomBank = [];
    var ansBank = [];
    var arrOfArrs = [];
    var question;
    var correct;
    var incorrect;
    var userGuess;
    var clicks = 0;
    var gameLength = 20;
    var time = 20;
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
            var bankLink = [];
            var indexChecker = [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19];
            var currentWrongAnswers = [];
            var currentIncorrect = [];
            ansBank = [];
            randomBank = [];
            bank = [];
            for ( i = 0; i < results.length; i++) {
                bank.push(results[i].name);
                bankLink.push(results[i].external_urls.spotify);
            }
            for ( j = 0; j < bank.length; j++) {
                num = Math.floor(Math.random() * (indexChecker.length - 1))
                randomIndex = indexChecker[num];
                choices[randomIndex] = bank[j];
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
            for (var i = 0; i < arrOfArrs[questionCounter].length; i++) {
                var a = $("<button>");
                a.addClass("btn");
                a.addClass('btn-block')
                a.attr("data-name", arrOfArrs[questionCounter[i]]);
                a.text(arrOfArrs[questionCounter][i]);
                $("#displayButtons").append(a); 
            }
    };

    function showQuestion() {
        $("#question").html("Question: " + question);
        $("#category").html("Category: " + category);
    }

    function displayAnswer() {
        if ( time === 0 ) {
            $("#timer").html("<h3>Times Up!</h3>");
            loss();
            timeOut();
        } else if ( userGuess == correct ) {
            clearScreen();
            correctAns++;
            stewie = "assets/images/stewie.jpg";
            img = $("<img>");
            img.attr("src", stewie);
            $("#victory").append(img);
            timeOut();
        } else if ( userGuess !== correct ) {
            loss();
            timeOut();
        }
        totalQs++;
    }

    function clearScreen() {
        $("#displayButtons").empty();
        $("#question").empty();
        $("#category").empty();
        $("#timer").empty();
        choices = [];
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
            getAPI();
            time = 20;
            run();
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
    
    $("#start").on("click", function(event) {
        event.preventDefault();
        query = $("#artist-input").val();
        if ( clicks === 0 ) {
            $("#victory").empty();
            $("#displayButtons").empty();
            authenticate(query);
            run();
        } else {
            $("#victory").empty();
            userGuess = $(this).attr("data-name");
            displayAnswer();
            stop();
            endGame();
        }
        clicks++
    })

})