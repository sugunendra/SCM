document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('data-form');
    const locationInput = document.getElementById('location');
    const networkArea = document.getElementById('network');
    const svg = document.getElementById('network-svg');

    let draggingFrom = null;

    // Add nodes to the network
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const locationName = locationInput.value.trim();
        if (!locationName) return;

        const node = createNode(locationName);
        networkArea.appendChild(node);

        locationInput.value = '';
    });

    function createNode(locationName) {
        const nodeContainer = document.createElement('div');
        nodeContainer.classList.add('node-container');

        const node = document.createElement('div');
        node.classList.add('node');
        node.textContent = locationName;

        const connectors = ['top', 'bottom', 'left', 'right'];
        connectors.forEach((position) => {
            const connector = document.createElement('div');
            connector.classList.add('connector', position);
            nodeContainer.appendChild(connector);

            interact(connector).draggable({
                listeners: {
                    start(event) {
                        draggingFrom = event.target;
                    },
                    end(event) {
                        if (draggingFrom) {
                            const target = document.elementFromPoint(event.clientX, event.clientY);
                            if (target && target.classList.contains('connector')) {
                                createConnection(draggingFrom, target);
                            }
                        }
                        draggingFrom = null;
                    }
                }
            });
        });

        nodeContainer.appendChild(node);
        makeDraggable(nodeContainer);
        return nodeContainer;
    }

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

    function createConnection(fromConnector, toConnector) {
        const fromRect = fromConnector.getBoundingClientRect();
        const toRect = toConnector.getBoundingClientRect();

        const x1 = fromRect.left + fromRect.width / 2;
        const y1 = fromRect.top + fromRect.height / 2;
        const x2 = toRect.left + toRect.width / 2;
        const y2 = toRect.top + toRect.height / 2;

        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', x1);
        line.setAttribute('y1', y1);
        line.setAttribute('x2', x2);
        line.setAttribute('y2', y2);
        line.setAttribute('marker-end', 'url(#arrow)'); // Add arrowhead
        line.classList.add('connection-line');

        svg.appendChild(line);
    }

    function updateConnections() {
        const lines = svg.querySelectorAll('.connection-line');
        lines.forEach((line) => {
            const fromConnector = findConnectorByPosition(line.getAttribute('x1'), line.getAttribute('y1'));
            const toConnector = findConnectorByPosition(line.getAttribute('x2'), line.getAttribute('y2'));

            if (fromConnector && toConnector) {
                const fromRect = fromConnector.getBoundingClientRect();
                const toRect = toConnector.getBoundingClientRect();

                line.setAttribute('x1', fromRect.left + fromRect.width / 2);
                line.setAttribute('y1', fromRect.top + fromRect.height / 2);
                line.setAttribute('x2', toRect.left + toRect.width / 2);
                line.setAttribute('y2', toRect.top + toRect.height / 2);
            }
        });
    }

    function findConnectorByPosition(x, y) {
        const connectors = Array.from(document.querySelectorAll('.connector'));
        return connectors.find((connector) => {
            const rect = connector.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;

            return Math.abs(centerX - x) < 5 && Math.abs(centerY - y) < 5;
        });
    }
});
