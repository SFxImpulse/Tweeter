$(document).ready(function() {
  $('#tweet-text').on('input', function() {
    let count = 140 - $(this).val().length;
    let counter = $(this).siblings(".form-submission").children('.counter');
    counter.val(count);
    if (count < 0) {
      counter.addClass("negative");
    }
    if (count > 0 && counter.hasClass("negative")) {
      counter.removeClass("negative");
    }
  });
});