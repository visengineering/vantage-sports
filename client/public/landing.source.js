var reviews = [1, 2, 3, 4];
window.addEventListener('DOMContentLoaded', (event) => {
  var nav = document.getElementById('navbarNavAltMarkup');
  function menuExpand() {
    if (nav.classList.contains('show')) {
      nav.classList.remove('show');
    } else {
      nav.classList.add('show');
    }
  }
  document.querySelector('.menu').addEventListener('click', menuExpand);

  function showReviewQuote(nr) {
    return function () {
      for (var reviewNr = 1; reviewNr <= reviews.length; reviewNr++) {
        if (reviewNr === nr) {
          document
            .getElementById('carousel-item-' + reviewNr)
            .classList.add('active');
        } else {
          document
            .getElementById('carousel-item-' + reviewNr)
            .classList.remove('active');
        }
      }
    };
  }
  for (var i = 1; i <= reviews.length; i++) {
    document
      .getElementById('carousel-indicator-' + i)
      .addEventListener('click', showReviewQuote(i));
  }
});
