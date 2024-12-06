document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('data-form');
    const locationInput = document.getElementById('location');
    const locationList = document.getElementById('location-list');
    const networkArea = document.getElementById('network');

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        // Get the entered location name
        const locationName = locationInput.value.trim();
        if (locationName === '') return;

        // Create a draggable node
        const node = document.createElement('div');
        node.textContent = locationName;
        node.classList.add('draggable-node');
        node.setAttribute('data-location', locationName);

        // Add the node to the network area
        networkArea.appendChild(node);

        // Clear the input field
        locationInput.value = '';
    });

    // Make nodes draggable using Interact.js
    interact('.draggable-node').draggable({
        listeners: {
            move(event) {
                const target = event.target;

                // Keep the dragged position in the data attributes
                const x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
                const y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

                // Translate the element
                target.style.transform = `translate(${x}px, ${y}px)`;

                // Update the position attributes
                target.setAttribute('data-x', x);
                target.setAttribute('data-y', y);
            }
        }
    });
});
