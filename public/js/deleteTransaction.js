document.addEventListener('DOMContentLoaded', function() {
  document.querySelectorAll('.delete-transaction').forEach(button => {
    button.addEventListener('click', function() {
      const id = this.getAttribute('data-id');
      if (confirm('Are you sure you want to delete this transaction?')) {
        deleteTransaction(id);
      }
    });
  });

  function deleteTransaction(id) {
    fetch(`/transactions/delete/${id}`, {
      method: 'DELETE',
    })
    .then(response => response.json())
    .then(data => {
      if (data.message === 'Transaction deleted successfully') {
        const row = document.querySelector(`tr[data-id="${id}"]`);
        if (row) {
          const closeDate = row.closest('.card').getAttribute('data-close-date');
          const amount = parseFloat(row.querySelector('td:nth-child(5)').textContent.replace('$', ''));
          row.remove();
          updateGroupTotals(closeDate, amount);
        }
      } else {
        console.error('Error deleting transaction:', data.message);
      }
    })
    .catch(error => {
      console.error('Error:', error);
      console.error(error.stack);
    });
  }

  function updateGroupTotals(closeDate, amount) {
    const group = document.querySelector(`.card[data-close-date="${closeDate}"]`);
    if (group) {
      const countElement = group.querySelector('.transaction-count');
      const totalElement = group.querySelector('.transaction-total');

      let count = parseInt(countElement.textContent.split(': ')[1]);
      let total = parseFloat(totalElement.textContent.split('$')[1]);

      count -= 1;
      total -= amount;

      countElement.textContent = `Number of Transactions: ${count}`;
      totalElement.textContent = `Total Amount: $${total.toFixed(2)}`;

      if (count === 0) {
        group.remove();
      }
    }
  }
});