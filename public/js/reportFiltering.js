document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('dateRangeForm');
  const reportContent = document.getElementById('reportContent');

  form.addEventListener('submit', function(e) {
    e.preventDefault();
    const closeDate = document.getElementById('closeDate').value;

    fetch(`/reports?closeDate=${closeDate}`)
      .then(response => response.text())
      .then(html => {
        reportContent.innerHTML = html;
      })
      .catch(error => {
        console.error('Error fetching filtered report:', error);
        reportContent.innerHTML = '<div class="alert alert-danger">Error loading report. Please try again.</div>';
      });
  });
});