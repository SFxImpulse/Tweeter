/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

// Removes unwanted code from being posted as tweets.

const escape = function (str) {
  let div = document.createElement("div");
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
}

// Creates a tweet HTML and appends it to the body

const createTweetElement = function(tweetObj) {
  const safeHTML = `<p>${escape(tweetObj.content.text)}`;
  let $tweet = `
  <article class="tweet">
    <header>
      <span><img src="${tweetObj.user.avatars}">${tweetObj.user.name}</span>
      <section>${tweetObj.user.handle}</section>
    </header>
      ${safeHTML}
      <footer>
      <span>${timeago.format(tweetObj.created_at)}</span>
      <div>
        <i class="fa-solid fa-flag"></i>
        <i class="fa-solid fa-arrow-rotate-left"></i>
        <i class="fa-solid fa-heart"></i>
      </div>
    </footer>
  </article>
  `;
  return $tweet;
};

// Renders the created HTML tweet markup to the /tweets/ URL. 

const renderTweets = function(tweetsArr) {
  $('.tweets').empty();
  for (let tweet = tweetsArr.length - 1; tweet >= 0; tweet--) {
    $('.tweets').append(createTweetElement(tweetsArr[tweet]));
  }
};

// Displays these elements after the website has finished loading.

$(document).ready(function () {

  // Loads tweets from /tweets/ and renders them as tweets on the website.

  const loadTweets = function() {
    $.get("/tweets/", function(data) {
      renderTweets(data);
    });
  };

  const $newTweet = $('#tweet-form');

  $newTweet.submit(function(event) {
    event.preventDefault();

    // My attempt at scroll button code.

    // $('.scrollButton').click(function () {
    //   window.scrollTo(0, 1);
    // });

    const newTweetValue = $('#tweet-text').val();

    const newTweet = $newTweet.serialize();

    // Resets the text area after a tweet has been posted.

    $('#tweet-form')[0].reset();

    // Hides the error html until needed.
    
    $('.error').hide();

    // Conditionals to check for empty text area and a text area with over 140 characters.

    if (newTweetValue === '') {
      $('.error').text("Your tweet is empty, please add some text before tweeting.");
      $('.error').slideDown();
    } else if (newTweetValue.length > 140) {
      $('.error').text("Your tweet is too long, please respect the totally nonsensical character limit.");
      $('.error').slideDown();
    } else {

      // Loads tweets after checking for errors.

      $.post('/tweets/', newTweet)
        .then(loadTweets())
    }
  });

  // Loads tweets without needing to submit.

  loadTweets();

});