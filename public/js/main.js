document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM fully loaded and parsed');
  const updateTransaction = async (id, field, value) => {
    if (!value.trim()) {
      console.log(`Update cancelled: empty value for ${field}`);
      return;
    }
    console.log(`Attempting to update transaction ${id}, field: ${field}, value: ${value}`);
    try {
      const response = await fetch(`/transactions/update/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ [field]: value }),
      });
      console.log('Fetch response:', response);

      if (!response.ok) {
        throw new Error('Failed to update transaction');
      }

      const data = await response.json();
      console.log(`Server response:`, data);
    } catch (error) {
      console.error('Error updating transaction:', error);
    }
  };

  document.querySelectorAll('.close-date, .category').forEach(input => {
    input.addEventListener('change', function() {
      console.log('Input changed:', this.value);
      const id = this.dataset.id;
      const field = this.classList.contains('close-date') ? 'closeDate' : 'category';
      console.log(`Calling updateTransaction with id: ${id}, field: ${field}, value: ${this.value}`);
      updateTransaction(id, field, this.value);
    });
  });
});