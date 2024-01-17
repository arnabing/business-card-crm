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
            // Assuming the server responds with JSON containing the HTML table
            populateTable(data);
        })
        .catch(error => {
            console.error('Error:', error);
        });
    };
});

// Function to populate the table with data
function populateTable(data) {
    // Extract the message content from the API response
    let content = data.choices[0].message.content;

    // Use a regular expression to extract the HTML table from the content
    let htmlTableMatch = content.match(/<table[\s\S]*<\/table>/);
    let htmlTable = htmlTableMatch ? htmlTableMatch[0] : '';

    // If an HTML table was found in the response, insert it into the web page
    if (htmlTable) {
        // Find the div container where the table should be displayed
        const tableContainer = document.getElementById('table-container'); // Ensure you have this div in your HTML
        // Set the innerHTML of the container to the HTML table
        tableContainer.innerHTML = htmlTable;
    } else {
        // If no table was found, handle the error appropriately
        console.error('No HTML table found in the API response');
    }
}
