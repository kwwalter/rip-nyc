$(document).ready(function(){
  $('#submit').click(function(event){
    event.preventDefault();

    // clear the previous results, if someone wants to play again..
    $('#result').empty();

    // set some bgm the first time the submit button is clicked..
    $('#home').append('<embed class="bgm" height="0" width="0" src="http://www.youtube.com/embed/O2RP1GivOqo?autoplay=1&loop=1&playlist=yaWkjUKSyLA" />');

    // if this is the second, third, fourth (etc) time a user clicks submit, it'll have the class submit-again, so should be able to manipulate the DOM as such (but not working yet--sort of spooky to hear it played over and over, no?):
    // $('.submit-again').click(function(event2){
    //   event2.preventDefault();
    //   $('.bgm').remove();
    // });

    // bunch of jquery stuff to manipulate the page (and change the favicon)
    $('#favicon').attr("href", "assets/skull.ico");
    $('body').css({
      'background-image': 'url("assets/images/background.gif")',
      'background-repeat': 'repeat',
      'color': '#af111c'
    });
    $('#home-img').removeClass("hidden");
    $('#home-img').css("display", "block");
    $('h4').removeClass('hidden');
    $('.welcome-h1').text('REST IN PEACE, NEW YORK CITY!');
    $('.welcome-h2').text('How many brunches do you have left?');
    $('#submit').val('Give me the bad news!');
    $('#welcome-img').removeClass("centered-img");
    $('#welcome-img').addClass("hidden");
    $('div > p').remove();
    $(':header').addClass('shadow');
    $(':header').addClass('spookify');
    // $('#submit').addClass('submit-again');
    $('label').css('font-family', 'FaceFears');
    $('#footer').css({
      'background': '#4D4D4D',
      'color': 'white'
    });
    // $('#icons > a > i:hover').css("color", "#af111c");

    // say hello
    $('#result').append('<h1>OH NooOoOooOOO! You\'ve entered a haunted domain!</h1>');

    // get the values from the form
    var name = $('#name').val();
    var age = $('#age').val();
    var gender = $('#gender').val();

    // couple other variables needed for below
    var likelyEthnicity;
    var ethCount = 0;

    // first ajax call
    var promise = $.ajax({
      url:'https://data.cityofnewyork.us/resource/g374-eanh.json',
      method: "GET",
      data: {
        nm: name.toUpperCase(),
        gndr: gender.toUpperCase()
      },
      success: function(data){
          // console.log("here's the data: ", data);

          if (data.length === 0) {
            $('#result').append('<h3>Your name could not be found on the guest list... there\'s a decent chance that you might live forever!</h3>');
          } else {
            for (var i = 0; i < data.length; i++) {
              if (data[i].cnt > ethCount) {
                likelyEthnicity = data[i].ethcty;
                ethCount = data[i].cnt;
                // console.log("ethCount is now: ", ethCount);
              }
            }
            // no idea why this isn't working, but will come back to it
            // console.log("likelyEthnicity: ", likelyEthnicity);
            if (likelyEthnicity === "ASIAN AND PACIFIC ISLANDER") {
              // can't get this working with the escape character, so just going to fake it for now.
              // this is working when I type the query string into the address bar, but not here for some reason.
              // likelyEthnicity = "ASIAN%20%26%20PACIFIC%20ISLANDER";

              likelyEthnicity = "NON-HISPANIC WHITE";
            }
            // console.log("likelyEthnicity: ", likelyEthnicity);
          }
      },
      error: function(jqXHR, status, error){
        console.log(jqXHR);
        console.log(status);
        console.log(error);
      }
    });
    promise.done(function(responseData){
      // console.log("promise finished, here's responseData: ", responseData);

      // beginning second ajax call.
      var promise2 = $.ajax({
        url: 'https://data.cityofnewyork.us/resource/uvxr-2jwn.json',
        method: "GET",
        data: {
          sex: gender.toUpperCase(),
          ethnicity: likelyEthnicity,
          year: 2008
        },
        success: function(data2){
          // console.log("here's data2: ", data2);
          if(data2.length === 0) {
            $('#result').append('<h3>No cause of death data found. This really doesn\'t bode well for you, ' + name + '! Let\'s just assume that you\'re going to die of loneliness... mwahahaha!</h3>');
          } else {
            $('#result').append('<h2>Here\'s a list of horrible demons that will hunt you down and whisk you away to the underworld, and the respective likelihood of each:</h2>');
            $('#result').append('<div class="demons"></div>');
            var noDupes = [];
            for (var j = 0; j < data2.length; j++) {
              if (noDupes.indexOf(data2[j].cause_of_death) < 0) {
                if (data2[j].percent == "0") {
                  $('.demons').append('<p>' + data2[j].cause_of_death.toLowerCase() + ': < 1% chance</p>');
                } else {
                  $('.demons').append('<p>' + data2[j].cause_of_death.toLowerCase() + ': ' + data2[j].percent + '% chance</p>');
                }

                // to append tombstone image and overlay text..
                // $('#result').append(
                //   '<div class="image"><img src="/Users/kevinwalter/src/unit_04_projects/rip_nyc/public/tombstone.png" /><p>' + data2[j].cause_of_death + '<br />' + data2[j].percent + '% chance</p></div>');

                noDupes.push(data2[j].cause_of_death);
              }
            }
            $('#result').append('<h1>How incredibly spooky!</h1>');
          }
          $(':header').addClass('shadow');
          $(':header').addClass('spookify');
        },
        error: function(jqXHR, status, error){
          console.log(jqXHR);
          console.log(status);
          console.log(error);
        }
      });

      promise2.done(function(responseData2){
        // console.log("promise2 finished, here's responseData2: ", responseData2);

        // have to generate string for today's date. Found this here: http://stackoverflow.com/questions/1531093/how-to-get-current-date-in-javascript
        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth() + 1; //J anuary is 0!
        var yyyy = today.getFullYear();

        if(dd < 10) {
          dd = '0' + dd;
        }

        if(mm < 10) {
          mm = '0' + mm;
        }

        today = yyyy + '-' + mm + '-' + dd;

        // need to modify the age so that it matches the right format..
        var newAge;
        if (age < 10) {
          newAge = '0' + age.toString() + 'y00m00d';
          // console.log("new age is: ", newAge);
        } else {
          newAge = age.toString() + 'y00m00d';
          // console.log("new age is: ", newAge);
        }

        // and now time for the third and final ajax call!
        var promise3 = $.ajax({
          url: 'http://api.population.io/1.0/life-expectancy/remaining/' + gender + '/United%20States/' + today + '/' + newAge + '/?format=json',
          method: "GET",
          success: function(data3){
            // console.log("here's data3: ", data3);

            if (data3.statusText === "BAD REQUEST") {
              $('#result').append('<h2>And we can\'t even say for sure how much longer you have! How terrible!</h2>');
            } else {
              $('#result').append('<h2>BE WARNED: you only have ' + data3.remaining_life_expectancy.toFixed(2) + ' years left!</h2>');
              $('#result').append('<h2>But hey, that gives you ' + data3.remaining_life_expectancy.toFixed(2) * 104 + ' more chances to go to weekend brunch! Get out there and have some French toast&mdash;and make sure to ask for extra butter...</h2>');
            }
            $(':header').addClass('shadow');
            $(':header').addClass('spookify');
          },
          error: function(jqXHR, status, error){
            console.log(jqXHR);
            console.log(status);
            console.log(error);
          }
        });

        promise3.done(function(responseData3){
          // console.log("promise3 finished, here's responseData3: ", responseData3);

          // just clearing out the form values so the user can start again..
          $('#name').val('');
          $('#age').val('');
        });

    // handling of all the potential errors from ajax calls..

        promise3.error(function(responseError3){
          console.log("promise3 failed, here's responseError3: ", responseError3);
        });
      });

      promise2.error(function(responseError2){
        console.log("promise2 failed, here's responseError2: ", responseError2);
      });
    });

    promise.error(function(responseError){
      console.log("promise failed, here's responseError: ", responseError);
    });
  });
});
