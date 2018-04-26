$.fn.tr = function() {
    var d = this;
    d.userPk = null;
    d.answers = {
        correct: 0,
        incorrect: 0,
        unanswered: 0
    };
    d.images = null;
    d.ct = 30;
    d.current = 0;
    d.questions = [{
        question: "When you’re capernoited, what are you?",
        choices: ["Slightly Afraid", "Slightly drunk", "Slightly embarrassed", "Slightly out of tune"],
        correct: 1
    }, {
        question: "Cleromancy is divination involving what?",
        choices: ["Dice", "Glass", "Twigs", "Ink"],
        correct: 0
    }, {
        question: "What does a nuxodeltiologist prefer postcard scenes of?",
        choices: ["The road", "The trees", "The ocean", "The night"],
        correct: 3
    }, {
        question: "What do you have when you’re sciapodous?",
        choices: ["Huge nose", "Huge chin", "Huge feet", "Huge ears"],
        correct: 2
    }, {
        question: "What are you full of when you’re gambrinous?",
        choices: ["Beer", "Joy", "Chicken", "Sweat"],
        correct: 0
    }, {
        question: "Tropoclastics is actually the science of?",
        choices: ["House keeping", "Ancient writing", "Breaking habits", "Eavesdropping"],
        correct: 2
    }, {
        question: "What do you most fear in hormephobia?",
        choices: ["Salivia", "Shock", "Static", "Silence"],
        correct: 1
    }, {
        question: "What does ponophobia mean?",
        choices: ["The fear of overheating", "The fear of oversleeping", "The fear of overthinking", "The fear of overworking"],
        correct: 3
    }, {
        question: "Iatrapistia is the lack of faith in what?",
        choices: ["The medical system", "The judical system", "The educational system", "The legal system"],
        correct: 0
    }, {
        question: "Where is the dactylion?",
        choices: ["Thumb", "Forefinger", "Middle finger", "Ring Finger"],
        correct: 2
    }, {
        question: "Presbycusis is the loss of what at old age?",
        choices: ["Smelling", "Hearing", "Tasting", "Feeling"],
        correct: 1
    }, {
        question: "An icononmicar writes about what?",
        choices: ["Illness", "Religion", "Farming", "Desserts"],
        correct: 2
    }, {
        question: "When you’re a stagiary, what are you a student of?",
        choices: ["Medicine", "Law", "Geology", "Philosophy"],
        correct: 1
    }, {
        question: "What do you love eating as a pagophagiac?",
        choices: ["Fingernails", "Ash", "Pips", "Ice"],
        correct: 3
    }, {
        question: "What does napiform mean?",
        choices: ["Turnip-shaped", "Car-shaped", "Hinge-shaped", "Arch-Shaped"],
        correct: 0
    }, {
        question: "What’s another word for chirotonsor?",
        choices: ["A masseur", "A carpenter", "A barber", "A dentist"],
        correct: 2
    }, {
        question: "What’s limerance the initial thrill of?",
        choices: ["Getting a job", "Falling in love", "Learning to write", "Buying a house"],
        correct: 1
    }, {
        question: "What is a wheeple?",
        choices: ["A poor attempt at whistling", "A poor attempt at listening", "A poor attempt at sneezing", "A poor attempt at hugging"],
        correct: 0
    }, {
        question: "What does psithurism describe the sound of?",
        choices: ["Flowing water", "Rustling leaves", "Keyboard typing", "Hammer nailing"],
        correct: 1
    }, {
        question: "A person who’s a fysigunkus lacks what?",
        choices: ["Humor", "Wisdom", "Curiousity", "Temper"],
        correct: 2
    }];
    d.ask = function() {
        if (d.questions[d.current]) {
            $("#timer").html("Time remaining: " + d.ct + " secs");
            $("#questionArea").html(d.questions[d.current].question);
            var choicesArr = d.questions[d.current].choices;
            var buttonsArr = [];

            for (var i = 0; i < choicesArr.length; i++) {
                var button = $('<button>');
                button.text(choicesArr[i]);
                button.attr('data-id', i);
                $('#choicesArea').append(button);
            }
            window.trCounter = setInterval(d.timer, 1000);
        } else {
            $('body').append($('<div />', {
                text: 'Unanswered: ' + (
                    d.questions.length - (d.answers.correct + d.answers.incorrect)),
                class: 'result'
            }));  //need to not display answer buttons once time runs out, if the user clicks on them after the time runs out then sometimes the loops for the next question and timer are slightly off .  
            $('#startB').text('Restart').appendTo('body').show();
        }
    };
    d.timer = function() {
        d.ct--;
        if (d.ct <= 0) {
            setTimeout(function() {
                d.nextQ();
            });

        } else {  //do I need this else?
            $("#timer").html("Time remaining: " + d.ct + " secs");
        }
    };
    d.nextQ = function() {
        d.current++;
        clearInterval(window.trCounter);
        d.ct = 30;
        $('#timer').html("");
        setTimeout(function() {
            d.reset();
            d.ask();
        }, 2500)
    };
    d.reset = function() {
        $('div[id]').each(function(item) {
            $(this).html('');
        });
        $('.correct').html('Correct answers: ' + d.answers.correct);
        $('.incorrect').html('Incorrect answers: ' + d.answers.incorrect);
        //$('.unanswered').html('Unanswered questions: ' + d.answers.unanswered);  //add unanswered here
    };
    d.answer = function(correct) {
        var string = correct ? 'correct' : 'incorrect';
        d.answers[string]++;
        $('.' + string).html(string + ' answers: ' + d.answers[string]);
    };
    return d;
};
var tr;

$("#startB").click(function() {
    $(this).hide();
    $('.result').remove();
    $('div').html('');
    tr = new $(window).tr();
    tr.ask();
});

$('#choicesArea').on('click', 'button', function(a) {  //a for any
    var userPk = $(this).data("id"),
        d = tr || $(window).tr(),
        temp = d.questions[d.current].correct,
        correct = d.questions[d.current].choices[temp];

    if (userPk !== temp) {
        $('#choicesArea').text("Wrong Answer! The correct answer was: " + correct);
        d.answer(false);
    } else {
        $('#choicesArea').text("Correct!!! The correct answer was: " + correct);
        d.answer(true);
    }
    //I need to add logic here in order to get the not answered response to tell them the correct answer     commenting this out since it won't work; I need a function to say if timer count equals 0
    //else {
    //    $('#choicesArea').text("Sorry, too slow... The correct answer was: " + correct);
   //     d.answer(null);
    //}
    
    
    d.nextQ();
});


