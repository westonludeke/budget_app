document.addEventListener('DOMContentLoaded', function() {
  console.log('Transaction edit script loaded');

  const editModal = new bootstrap.Modal(document.getElementById('editTransactionModal'));
  const editForm = document.getElementById('editTransactionForm');

  // Use event delegation for edit buttons
  document.body.addEventListener('click', function(event) {
    if (event.target.classList.contains('edit-transaction')) {
      const transactionId = event.target.getAttribute('data-id');
      console.log('Edit button clicked for transaction:', transactionId);
      fetch(`/transactions/${transactionId}`)
        .then(response => {
          if (response.status === 401) {
            throw new Error('Unauthorized');
          }
          return response.json();
        })
        .then(data => {
          console.log('Transaction details fetched:', data);
          populateModal(data);
          editModal.show();
        })
        .catch(error => {
          if (error.message === 'Unauthorized') {
            alert('You are not authenticated. Please log in to edit transactions.');
          } else {
            console.error('Error fetching transaction details:', error);
          }
        });
    }
  });

  // Use event delegation for save button
  document.body.addEventListener('click', function(event) {
    if (event.target.id === 'saveTransactionButton') {
      event.preventDefault();
      console.log('Save button clicked');
      const transactionId = document.getElementById('transactionId').value;
      console.log('Transaction ID:', transactionId);

      const updatedData = {
        postDate: document.getElementById('postDate').value,
        transactionDate: document.getElementById('transactionDate').value,
        referenceNumber: document.getElementById('referenceNumber').value,
        merchantData: document.getElementById('merchantData').value,
        amount: parseFloat(document.getElementById('amount').value),
        closeDate: document.getElementById('closeDate').value,
        category: document.getElementById('category').value
      };

      // Create Date objects from the MM/DD input
      const currentYear = new Date().getFullYear();
      const postDateObj = new Date(`${currentYear}-${updatedData.postDate}`);
      const transactionDateObj = new Date(`${currentYear}-${updatedData.transactionDate}`);

      updatedData.postDate = postDateObj.toISOString();
      updatedData.transactionDate = transactionDateObj.toISOString();

      fetch(`/transactions/update/${transactionId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData)
      })
      .then(response => {
        if (response.status === 401) {
          throw new Error('Unauthorized');
        }
        return response.json();
      })
      .then(data => {
        console.log('Transaction update success:', data);
        editModal.hide();
        updateTransactionRow(data.transaction);
      })
      .catch(error => {
        if (error.message === 'Unauthorized') {
          alert('You are not authenticated. Please log in to save changes.');
        } else {
          console.error('Error updating transaction:', error);
        }
      });
    }
  });

  function populateModal(transaction) {
    console.log('Populating modal with transaction data:', transaction);
    document.getElementById('transactionId').value = transaction._id;
    document.getElementById('postDate').value = new Date(transaction.postDate).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit' });
    document.getElementById('transactionDate').value = new Date(transaction.transactionDate).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit' });
    document.getElementById('referenceNumber').value = transaction.referenceNumber;
    document.getElementById('merchantData').value = transaction.merchantData;
    document.getElementById('amount').value = transaction.amount.toFixed(2);
    document.getElementById('closeDate').value = transaction.closeDate || '';
    document.getElementById('category').value = transaction.category || '';
  }

  function updateTransactionRow(transaction) {
    console.log('Updating transaction row with data:', transaction);
    const row = document.querySelector(`tr[data-id="${transaction._id}"]`);
    if (!row) {
      console.error(`Row not found for transaction ID: ${transaction._id}`);
      return;
    }

    try {
      row.querySelector('td:nth-child(1)').textContent = new Date(transaction.postDate).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit' });
      row.querySelector('td:nth-child(2)').textContent = new Date(transaction.transactionDate).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit' });
      row.querySelector('td:nth-child(3)').textContent = transaction.referenceNumber;
      row.querySelector('td:nth-child(4)').textContent = transaction.merchantData;
      row.querySelector('td:nth-child(5)').textContent = `$${parseFloat(transaction.amount).toFixed(2)}`;
      row.querySelector('td:nth-child(6) input').value = transaction.category;
    } catch (error) {
      console.error('Error updating row:', error);
    }
  }
});