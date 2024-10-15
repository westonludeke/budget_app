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
        // Remove the transaction from the DOM
        const row = document.querySelector(`tr[data-id="${id}"]`);
        if (row) {
          row.remove();
          updateGroupTotals();
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

  function updateGroupTotals() {
    document.querySelectorAll('.card').forEach(card => {
      const transactions = card.querySelectorAll('tbody tr');
      const countElement = card.querySelector('p:nth-child(2)');
      const totalElement = card.querySelector('p:nth-child(3)');

      let count = transactions.length;
      let total = Array.from(transactions).reduce((sum, tr) => {
        return sum + parseFloat(tr.querySelector('td:nth-child(5)').textContent.replace('$', ''));
      }, 0);

      countElement.textContent = `Number of Transactions: ${count}`;
      totalElement.textContent = `Total Amount: $${total.toFixed(2)}`;

      if (count === 0) {
        card.remove();
      }
    });
  }
});