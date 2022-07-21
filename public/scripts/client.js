/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

const escape = function (str) {
  let div = document.createElement("div");
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
}

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

const loadTweets = function() {
  $.get("/tweets/", function(data) {
    renderTweets(data);
  });
};

$(document).ready(function () {

  const $newTweet = $('#tweet-form');

  $newTweet.submit(function(event) {
    event.preventDefault();

    const newTweetValue = $('#tweet-text').val();

    const newTweet = $newTweet.serialize();
    
    $('.error').hide();

    if (newTweetValue === '') {
      $('.error').text("Your tweet is empty, please add some text before tweeting.")
      $('.error').slideDown();
    } else if (newTweetValue.length > 140) {
      $('.error').text("Your tweet is too long, please respect the totally nonsensical character limit.")
      $('.error').slideDown();
    } else {
    $.post('/tweets/', newTweet)
      .then(loadTweets());
    }
  });

  loadTweets();

});