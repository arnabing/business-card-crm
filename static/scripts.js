document.addEventListener('DOMContentLoaded', function() {
    // Bind the form submission to a function
    document.querySelector('form').onsubmit = function(event) {
        // Prevent the default form submission
        event.preventDefault();

        // Get the file from the form input
        let fileInput = document.querySelector('input[type="file"]');
        let formData = new FormData();
        formData.append('file', fileInput.files[0]);

        // Make an AJAX call to the server with the file
        fetch('/upload', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            // Assuming the server responds with JSON data to insert into the table
            populateTable(data);
        })
        .catch(error => {
            console.error('Error:', error);
        });
    };
});

// Function to populate the table with data
function populateTable(data) {
    const tableBody = document.getElementById('contactInfo').querySelector('tbody');
    tableBody.innerHTML = ''; // Clear existing table data

    // Loop through each item in the data array
    data.forEach((item) => {
        // Create a new row and cells for each piece of data
        let row = tableBody.insertRow();
        Object.values(item).forEach(text => {
            let cell = row.insertCell();
            cell.textContent = text;
        });
    });
}
