document.addEventListener('DOMContentLoaded', function() {
  console.log('Transaction delete script loaded');

  // Use event delegation for delete buttons
  document.body.addEventListener('click', function(event) {
    if (event.target.classList.contains('delete-transaction')) {
      const transactionId = event.target.getAttribute('data-id');
      console.log('Delete button clicked for transaction:', transactionId);
      if (confirm('Are you sure you want to delete this transaction?')) {
        deleteTransaction(transactionId);
      }
    }
  });

  function deleteTransaction(id) {
    console.log('Deleting transaction:', id);
    fetch(`/transactions/${id}`, {
      method: 'DELETE',
    })
    .then(response => response.json())
    .then(data => {
      console.log('Transaction delete success:', data);
      removeTransactionFromView(id);
    })
    .catch((error) => {
      console.error('Error deleting transaction:', error);
      alert('Error deleting transaction. Please check the console for more information.');
    });
  }

  function removeTransactionFromView(id) {
    console.log('Removing transaction from view:', id);
    const row = document.querySelector(`tr[data-id="${id}"]`);
    if (row) {
      let closeDate = 'Unknown';
      const table = row.closest('table');
      if (table) {
        const closeDateHeader = table.previousElementSibling;
        if (closeDateHeader && closeDateHeader.tagName === 'H2') {
          closeDate = closeDateHeader.textContent.trim();
        }
      }
      row.remove();
      updateGroupTotals(closeDate);
    } else {
      console.error(`Row not found for transaction ID: ${id}`);
    }
  }

  function updateGroupTotals(closeDate) {
    console.log('Updating group totals for close date:', closeDate);
    const headers = document.querySelectorAll('h2');
    let section = null;
    headers.forEach(header => {
      if (header.textContent.trim() === closeDate) {
        section = header.nextElementSibling;
      }
    });

    if (section) {
      const transactions = section.querySelectorAll('tbody tr');
      const totalElement = section.querySelector('.total');
      const countElement = section.querySelector('.transaction-count');

      if (transactions.length === 0) {
        // Remove the entire section if there are no transactions left
        section.previousElementSibling.remove(); // Remove the h2
        section.remove();
      } else {
        const total = Array.from(transactions).reduce((sum, tr) => {
          const amount = parseFloat(tr.querySelector('td:nth-child(5)').textContent.replace('$', ''));
          return sum + amount;
        }, 0);

        if (totalElement) totalElement.textContent = `Total: $${total.toFixed(2)}`;
        if (countElement) countElement.textContent = `Number of Transactions: ${transactions.length}`;
      }
    } else {
      console.error(`Section not found for close date: ${closeDate}`);
    }
  }
});