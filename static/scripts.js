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
            console.log(data); // Log the data
            displayHtmlTable(data.html_table); // Display the HTML table
        })
        .catch(error => {
            console.error('Error:', error);
        });
    };
});

// Function to display the HTML table
function displayHtmlTable(htmlTable) {
    const tableContainer = document.getElementById('table-container');
    // Check if the htmlTable is not null or undefined
    if (htmlTable) {
        tableContainer.innerHTML = htmlTable; // Insert the HTML table
        // Find the table within the container and add Bootstrap classes for styling
        const table = tableContainer.querySelector('table');
        if (table) {
            table.classList.add('table', 'table-bordered'); // Apply Bootstrap table styles
        }
    } else {
        // If htmlTable is null or undefined, show an error message or a default state
        tableContainer.innerHTML = '<p>No table data available.</p>';
    }
}