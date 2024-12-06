document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('data-form');
    const locationInput = document.getElementById('location');
    const networkArea = document.getElementById('network');
    const svg = document.getElementById('network-svg');

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        // Get the entered location name
        const locationName = locationInput.value.trim();
        if (!locationName) return;

        // Create a draggable node
        const node = document.createElement('div');
        node.classList.add('draggable-node');
        node.textContent = locationName;

        // Add node to the network area
        networkArea.appendChild(node);

        // Make the node draggable
        makeDraggable(node);

        // Clear the input field
        locationInput.value = '';
    });

    function makeDraggable(node) {
        interact(node).draggable({
            listeners: {
                move(event) {
                    const target = event.target;

                    // Update position based on drag
                    const x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
                    const y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

                    // Apply the translation
                    target.style.transform = `translate(${x}px, ${y}px)`;
                    target.setAttribute('data-x', x);
                    target.setAttribute('data-y', y);

                    // Update connections
                    updateConnections();
                }
            }
        });
    }

    function updateConnections() {
        svg.innerHTML = ''; // Clear previous connections

        const nodes = Array.from(document.querySelectorAll('.draggable-node'));
        const positions = nodes.map(node => {
            const rect = node.getBoundingClientRect();
            return {
                x: rect.left + rect.width / 2,
                y: rect.top + rect.height / 2
            };
        });

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
