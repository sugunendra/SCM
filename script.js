document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('data-form');
    const locationInput = document.getElementById('location');
    const locationList = document.getElementById('location-list');

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        // Get the entered location name
        const locationName = locationInput.value.trim();
        if (locationName === '') return;

        // Create a new list item
        const listItem = document.createElement('li');
        listItem.textContent = locationName;

        // Add the list item to the location list
        locationList.appendChild(listItem);

        // Clear the input field
        locationInput.value = '';
    });
});
