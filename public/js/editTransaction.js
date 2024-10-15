document.addEventListener('DOMContentLoaded', function() {
  const editButtons = document.querySelectorAll('.edit-transaction');
  const editModal = new bootstrap.Modal(document.getElementById('editModal'));
  const modalBody = document.querySelector('#editModal .modal-body');

  editButtons.forEach(button => {
    button.addEventListener('click', function() {
      const transactionId = this.getAttribute('data-id');
      fetch(`/transactions/edit/${transactionId}`)
        .then(response => response.text())
        .then(html => {
          modalBody.innerHTML = html;
          editModal.show();
          setupEditForm();
        })
        .catch(error => {
          console.error('Error fetching edit form:', error);
          console.error(error.stack);
        });
    });
  });

  function setupEditForm() {
    const form = document.getElementById('editTransactionForm');
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      const formData = new FormData(form);
      const transactionId = formData.get('id');
      const data = Object.fromEntries(formData.entries());

      fetch(`/transactions/edit/${transactionId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to update transaction');
        }
        return response.json();
      })
      .then(updatedTransaction => {
        editModal.hide();
        // Update the transaction in the table
        updateTransactionInTable(updatedTransaction);
      })
      .catch(error => {
        console.error('Error updating transaction:', error);
        console.error(error.stack);
      });
    });
  }

  function updateTransactionInTable(transaction) {
    const row = document.querySelector(`tr[data-id="${transaction._id}"]`);
    if (row) {
      row.querySelector('td:nth-child(1)').textContent = new Date(transaction.postDate).toLocaleDateString();
      row.querySelector('td:nth-child(2)').textContent = new Date(transaction.transactionDate).toLocaleDateString();
      row.querySelector('td:nth-child(3)').textContent = transaction.referenceNumber;
      row.querySelector('td:nth-child(4)').textContent = transaction.merchantData;
      row.querySelector('td:nth-child(5)').textContent = `$${transaction.amount.toFixed(2)}`;
      row.querySelector('td:nth-child(6) input').value = transaction.category;
      row.querySelector('td:nth-child(7) input').value = transaction.closeDate;
    }
  }
});