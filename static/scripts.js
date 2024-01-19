document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('form');
    const fileInput = document.querySelector('input[type="file"]');

    form.onsubmit = function(event) {
        event.preventDefault();

        let formData = new FormData();
        formData.append('file', fileInput.files[0]);

        fetch('/upload', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            console.log(data); // Log the data
            displayHtmlTable(data.html_table); // Display the HTML table
            resetForm(); // Reset the form after submission
        })
        .catch(error => {
            console.error('Error:', error);
        });
    };
});

function resetForm() {
    document.querySelector('form').reset();
}

function displayHtmlTable(htmlTable) {
    const tableContainer = document.getElementById('table-container');
    if (htmlTable) {
        tableContainer.innerHTML = htmlTable; 
        const table = tableContainer.querySelector('table');
        if (table) {
            table.classList.add('table', 'table-bordered'); 
        }
    } else {
        tableContainer.innerHTML = '<p>No table data available.</p>';
    }
}