document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('data-form');
    const locationInput = document.getElementById('location');
    const locationList = document.getElementById('location-list');
    const networkArea = document.getElementById('network');
    const svg = document.getElementById('network-svg');

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

        // Update Interact.js for new nodes
        makeDraggable(node);
    });

    function makeDraggable(node) {
        interact(node).draggable({
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

                    updateConnections();
                }
            }
        });
    }

    function updateConnections() {
        svg.innerHTML = ''; // Clear existing lines

        const nodes = document.querySelectorAll('.draggable-node');
        const positions = Array.from(nodes).map(node => {
            const x = parseFloat(node.getAttribute('data-x')) || 0;
            const y = parseFloat(node.getAttribute('data-y')) || 0;
            const rect = node.getBoundingClientRect();
            return {
                x: rect.left + rect.width / 2,
                y: rect.top + rect.height / 2
            };
        });

        // Connect each pair of nodes
        for (let i = 0; i < positions.length - 1; i++) {
            for (let j = i + 1; j < positions.length; j++) {
                const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                line.setAttribute('x1', positions[i].x);
                line.setAttribute('y1', positions[i].y);
                line.setAttribute('x2', positions[j].x);
                line.setAttribute('y2', positions[j].y);
                line.setAttribute('stroke', '#007BFF');
                line.setAttribute('stroke-width', '2');
                svg.appendChild(line);
            }
        }
    }
});
