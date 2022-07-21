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
  const safeHTML = `<p>${escape(tweetObj.content.text)}`
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

const renderTweets = function(tweetsArr) {
  $('.tweets').empty();
  for (let tweet = tweetsArr.length - 1; tweet >= 0; tweet--) {
    $('.tweets').append(createTweetElement(tweetsArr[tweet]));
  }
};

// const errorCheck = function (string) {
//   if (string === '') {
//     $('.error').text("Your tweet is empty, please add some text before tweeting.");
//     $('.error').slideDown();
//   } else if (string.length > 140) {
//     $('.error').text("Your tweet is too long, please respect the totally nonsensical character limit.");
//     $('.error').slideDown();
//   }
// }

$(document).ready(function () {

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
    // })

    let newTweetValue = $('#tweet-text').val();

    const newTweet = $newTweet.serialize();

    $('#tweet-form')[0].reset();
    
    $('.error').hide();

    if (newTweetValue === '') {
      $('.error').text("Your tweet is empty, please add some text before tweeting.");
      $('.error').slideDown();
    } else if (newTweetValue.length > 140) {
      $('.error').text("Your tweet is too long, please respect the totally nonsensical character limit.");
      $('.error').slideDown();
    } else {
      $.post('/tweets/', newTweet)
        .then(loadTweets())
    }
  });

  loadTweets();

});