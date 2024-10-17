document.addEventListener('DOMContentLoaded', function() {
  console.log('Transaction edit script loaded');

  const editModal = new bootstrap.Modal(document.getElementById('editTransactionModal'));
  const editForm = document.getElementById('editTransactionForm');

  // Use event delegation for edit buttons
  document.body.addEventListener('click', function(event) {
    if (event.target.classList.contains('edit-transaction')) {
      const transactionId = event.target.getAttribute('data-id');
      console.log('Edit button clicked for transaction:', transactionId);
      fetchTransactionDetails(transactionId);
    }
  });

  // Use event delegation for save button
  document.body.addEventListener('click', function(event) {
    if (event.target.id === 'saveTransactionButton') {
      event.preventDefault();
      console.log('Save button clicked');
      const transactionId = document.getElementById('transactionId').value;
      console.log('Transaction ID:', transactionId);
      saveTransactionDetails(transactionId);
    }
  });

  function fetchTransactionDetails(id) {
    console.log('Fetching transaction details for ID:', id);
    fetch(`/transactions/${id}`)
      .then(response => response.json())
      .then(data => {
        console.log('Transaction details fetched:', data);
        populateForm(data);
        editModal.show();
      })
      .catch(error => {
        console.error('Error fetching transaction details:', error);
        alert('Error fetching transaction details. Please check the console for more information.');
      });
  }

  function populateForm(transaction) {
    console.log('Populating form with transaction data:', transaction);
    document.getElementById('transactionId').value = transaction._id;
    document.getElementById('postDate').value = transaction.postDate.split('T')[0];
    document.getElementById('transactionDate').value = transaction.transactionDate.split('T')[0];
    document.getElementById('referenceNumber').value = transaction.referenceNumber;
    document.getElementById('merchantData').value = transaction.merchantData;
    document.getElementById('amount').value = transaction.amount;
    document.getElementById('closeDate').value = transaction.closeDate;
    document.getElementById('category').value = transaction.category;
  }

  function saveTransactionDetails(id) {
    console.log('Saving transaction details for ID:', id);

    // Collect form data manually
    const data = {
      postDate: document.getElementById('postDate').value,
      transactionDate: document.getElementById('transactionDate').value,
      referenceNumber: document.getElementById('referenceNumber').value,
      merchantData: document.getElementById('merchantData').value,
      amount: document.getElementById('amount').value,
      closeDate: document.getElementById('closeDate').value,
      category: document.getElementById('category').value
    };

    console.log('Form data being sent:', data);

    fetch(`/transactions/update/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    .then(response => response.json())
    .then(data => {
      console.log('Transaction update success:', data);
      editModal.hide();
      updateTransactionRow(data.transaction);
    })
    .catch((error) => {
      console.error('Error updating transaction:', error);
      alert('Error updating transaction. Please check the console for more information.');
    });
  }

  function updateTransactionRow(transaction) {
    console.log('Updating transaction row with data:', transaction);
    const row = document.querySelector(`tr[data-id="${transaction._id}"]`);
    if (!row) {
      console.error(`Row not found for transaction ID: ${transaction._id}`);
      return;
    }

    try {
      row.querySelector('td:nth-child(1)').textContent = new Date(transaction.postDate).toLocaleDateString();
      row.querySelector('td:nth-child(2)').textContent = new Date(transaction.transactionDate).toLocaleDateString();
      row.querySelector('td:nth-child(3)').textContent = transaction.referenceNumber;
      row.querySelector('td:nth-child(4)').textContent = transaction.merchantData;
      row.querySelector('td:nth-child(5)').textContent = `$${parseFloat(transaction.amount).toFixed(2)}`;
      row.querySelector('td:nth-child(6) input').value = transaction.category;
    } catch (error) {
      console.error('Error updating row:', error);
    }
  }
});