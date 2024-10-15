document.addEventListener('DOMContentLoaded', function() {
  let changedTransactions = new Set();

  const debounce = (func, delay) => {
    let debounceTimer;
    return function() {
      const context = this;
      const args = arguments;
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => func.apply(context, args), delay);
    }
  };

  const updateTransaction = debounce((id, field, value) => {
    fetch(`/transactions/update/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ [field]: value }),
    })
    .then(response => response.json())
    .then(data => {
      console.log('Update successful:', data);
    })
    .catch(error => {
      console.error('Error updating transaction:', error);
    });
    changedTransactions.add(id);
  }, 500);

  document.querySelectorAll('.close-date, .category').forEach(input => {
    input.addEventListener('input', function() {
      const id = this.getAttribute('data-id');
      const field = this.classList.contains('close-date') ? 'closeDate' : 'category';
      updateTransaction(id, field, this.value);
    });
  });

  document.getElementById('saveChanges').addEventListener('click', function() {
    const updates = Array.from(changedTransactions).map(id => {
      const closeDateInput = document.querySelector(`.close-date[data-id="${id}"]`);
      const categoryInput = document.querySelector(`.category[data-id="${id}"]`);
      return {
        id,
        closeDate: closeDateInput.value,
        category: categoryInput.value
      };
    });

    fetch('/transactions/update-bulk', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ updates }),
    })
    .then(response => response.json())
    .then(data => {
      console.log('Bulk update successful:', data);
      changedTransactions.clear();
      alert('Changes saved successfully!');
    })
    .catch(error => {
      console.error('Error in bulk updating transactions:', error);
      console.error(error.stack);
      alert('Error saving changes. Please try again.');
    });
  });
});