document.addEventListener('DOMContentLoaded', function() {
  const paginationLinks = document.querySelectorAll('.pagination .page-link');

  paginationLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const page = this.getAttribute('href').split('=')[1];
      fetchTransactions(page);
    });
  });

  function fetchTransactions(page) {
    fetch(`/?page=${page}`, {
      headers: {
        'X-Requested-With': 'XMLHttpRequest'
      }
    })
    .then(response => response.text())
    .then(html => {
      document.querySelector('main').innerHTML = html;
    })
    .catch(error => {
      console.error('Error fetching transactions:', error);
      console.error(error.stack);
    });
  }
});