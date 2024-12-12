document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('data-form');
    const locationInput = document.getElementById('location');
    const networkArea = document.getElementById('network');
    const svg = document.getElementById('network-svg');
    const toggleConnectModeButton = document.getElementById('toggle-connect-mode');

    let connectMode = false;
    let selectedNode = null;

    // Toggle connection mode
    toggleConnectModeButton.addEventListener('click', () => {
        connectMode = !connectMode;
        if (connectMode) {
            toggleConnectModeButton.textContent = "Connection Mode: ON";
        } else {
            toggleConnectModeButton.textContent = "Connection Mode: OFF";
            clearNodeSelection();
        }
    });

    // Add nodes to the network
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const locationName = locationInput.value.trim();
        if (!locationName) return;

        const node = document.createElement('div');
        node.classList.add('draggable-node');
        node.textContent = locationName;

        networkArea.appendChild(node);
        makeDraggable(node);

        // Add click listener for connection mode
        node.addEventListener('click', () => handleNodeClick(node));

        locationInput.value = '';
    });

    function makeDraggable(element) {
        interact(element).draggable({
            listeners: {
                move(event) {
                    const target = event.target;
                    const x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
                    const y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

                    target.style.transform = `translate(${x}px, ${y}px)`;
                    target.setAttribute('data-x', x);
                    target.setAttribute('data-y', y);

                    updateConnections();
                }
            }
        });
    }

    function handleNodeClick(node) {
        if (!connectMode) return;

        if (!selectedNode) {
            // First node selected
            selectedNode = node;
            node.classList.add('connecting');
        } else if (selectedNode !== node) {
            // Second node selected
            createConnection(selectedNode, node);
            selectedNode.classList.remove('connecting');
            selectedNode = null; // Reset
        } else {
            // Clicking the same node deselects it
            selectedNode.classList.remove('connecting');
            selectedNode = null;
        }
    }

    function createConnection(node1, node2) {
        const rect1 = node1.getBoundingClientRect();
        const rect2 = node2.getBoundingClientRect();

        const x1 = rect1.left + rect1.width / 2;
        const y1 = rect1.top + rect1.height / 2;
        const x2 = rect2.left + rect2.width / 2;
        const y2 = rect2.top + rect2.height / 2;

        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', x1);
        line.setAttribute('y1', y1);
        line.setAttribute('x2', x2);
        line.setAttribute('y2', y2);
        line.classList.add('connection-line');

        svg.appendChild(line);
    }

    function updateConnections() {
        // Recalculate connection lines during drag
        const lines = svg.querySelectorAll('.connection-line');
        lines.forEach((line) => {
            const node1 = findNodeByPosition(line.getAttribute('x1'), line.getAttribute('y1'));
            const node2 = findNodeByPosition(line.getAttribute('x2'), line.getAttribute('y2'));

            if (node1 && node2) {
                const rect1 = node1.getBoundingClientRect();
                const rect2 = node2.getBoundingClientRect();

                line.setAttribute('x1', rect1.left + rect1.width / 2);
                line.setAttribute('y1', rect1.top + rect1.height / 2);
                line.setAttribute('x2', rect2.left + rect2.width / 2);
                line.setAttribute('y2', rect2.top + rect2.height / 2);
            }
        });
    }

    function findNodeByPosition(x, y) {
        const nodes = Array.from(document.querySelectorAll('.draggable-node'));
        return nodes.find((node) => {
            const rect = node.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;

            return Math.abs(centerX - x) < 5 && Math.abs(centerY - y) < 5;
        });
    }

    function clearNodeSelection() {
        const nodes = document.querySelectorAll('.connecting');
        nodes.forEach((node) => node.classList.remove('connecting'));
        selectedNode = null;
    }
});
