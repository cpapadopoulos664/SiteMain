class GameOfLife {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.cellSize = 10;  // Smaller cells
        this.cells = new Map();
        this.isRunning = false;
        this.generation = 0;

        // Set canvas size to window size
        this.resize();
        window.addEventListener('resize', () => this.resize());

        // Add click event listener to the entire document instead of just the canvas
        document.addEventListener('click', (e) => this.handleClick(e));

        // Generate some random cells to start
        this.generateRandomCells(100);

        // Start animation loop
        this.animate();
        
        console.log('Game of Life initialized with canvas:', canvas);
    }

    resize() {
        const dpr = window.devicePixelRatio || 1;
        const displayWidth = this.canvas.clientWidth;
        const displayHeight = this.canvas.clientHeight;
        
        // Set actual size in memory
        this.canvas.width = displayWidth * dpr;
        this.canvas.height = displayHeight * dpr;
        
        // Scale context to ensure correct drawing operations
        this.ctx.scale(dpr, dpr);
        
        this.cols = Math.floor(displayWidth / this.cellSize);
        this.rows = Math.floor(displayHeight / this.cellSize);
        
        console.log('Canvas resized:', {
            displayWidth,
            displayHeight,
            actualWidth: this.canvas.width,
            actualHeight: this.canvas.height,
            cols: this.cols,
            rows: this.rows
        });
    }

    handleClick(e) {
        // Don't spawn cells when clicking on interactive elements
        if (e.target.closest('a, button, .nav-item, .lang-btn')) {
            console.log('Clicked on interactive element, ignoring');
            return;
        }

        // Use document coordinates instead of canvas-relative coordinates
        const x = e.clientX;
        const y = e.clientY;
        
        console.log('Click detected at:', x, y);
        
        // Create a 3x3 block of cells around click
        for(let dx = -1; dx <= 1; dx++) {
            for(let dy = -1; dy <= 1; dy++) {
                const cellX = Math.floor((x + dx * this.cellSize) / this.cellSize);
                const cellY = Math.floor((y + dy * this.cellSize) / this.cellSize);
                const key = `${cellX},${cellY}`;
                this.cells.set(key, true);
                console.log('Created cell at:', cellX, cellY);
            }
        }

        if (!this.isRunning) {
            console.log('Starting animation');
            this.isRunning = true;
        }
    }

    getNeighbors(x, y) {
        let count = 0;
        for(let dx = -1; dx <= 1; dx++) {
            for(let dy = -1; dy <= 1; dy++) {
                if (dx === 0 && dy === 0) continue;
                const key = `${x + dx},${y + dy}`;
                if (this.cells.has(key)) count++;
            }
        }
        return count;
    }

    update() {
        if (!this.isRunning) return;
        
        const newCells = new Map();
        const checked = new Set();

        // Check all existing cells and their neighbors
        for (const [key] of this.cells) {
            const [x, y] = key.split(',').map(Number);
            
            // Check 3x3 grid around each live cell
            for(let dx = -1; dx <= 1; dx++) {
                for(let dy = -1; dy <= 1; dy++) {
                    const newX = x + dx;
                    const newY = y + dy;
                    const newKey = `${newX},${newY}`;
                    
                    if (checked.has(newKey)) continue;
                    checked.add(newKey);

                    const neighbors = this.getNeighbors(newX, newY);
                    const isAlive = this.cells.has(newKey);

                    if (isAlive) {
                        if (neighbors === 2 || neighbors === 3) {
                            newCells.set(newKey, true);
                        }
                    } else {
                        if (neighbors === 3) {
                            newCells.set(newKey, true);
                        }
                    }
                }
            }
        }

        this.cells = newCells;
        this.generation++;

        // Stop if no cells remain
        if (this.cells.size === 0) {
            this.isRunning = false;
        }
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Set style for cells
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';  // More opaque white
        
        // Draw all live cells
        for (const [key] of this.cells) {
            const [x, y] = key.split(',').map(Number);
            this.ctx.fillRect(
                x * this.cellSize,
                y * this.cellSize,
                this.cellSize - 1,
                this.cellSize - 1
            );
        }
        
        // Draw debug info
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
        this.ctx.font = '12px monospace';
        this.ctx.fillText(`Cells: ${this.cells.size} Gen: ${this.generation}`, 10, 20);
    }

    animate() {
        this.update();
        this.draw();
        requestAnimationFrame(() => this.animate());
    }

    generateRandomCells(count) {
        for (let i = 0; i < count; i++) {
            const x = Math.floor(Math.random() * this.cols);
            const y = Math.floor(Math.random() * this.rows);
            const key = `${x},${y}`;
            this.cells.set(key, true);
        }
        this.isRunning = true;
    }
}

// Initialize when the document is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('Initializing Game of Life');  // Debug log
    
    const canvas = document.createElement('canvas');
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.zIndex = '-1';  // Set to -1 so it's behind all content
    canvas.style.background = 'rgba(0, 0, 0, 0.9)';  // Made slightly transparent
    canvas.style.pointerEvents = 'none';  // Disable pointer events on canvas so clicks go through to document
    
    // Insert canvas as the first child of body
    document.body.insertBefore(canvas, document.body.firstChild);
    
    // Get popup element
    const popup = document.getElementById('popup');
    
    // Reset popup state
    if (popup) {
        popup.style.display = 'block';
        window.popupClicked = false;
    }
    
    // Create a reusable popup click handler
    const handlePopupClick = (e) => {
        // Don't hide popup when clicking language buttons
        if (e.target.closest('.lang-btn')) {
            return;
        }
        if (popup) {
            popup.style.display = 'none';
            window.popupClicked = true;
        }
    };
    
    // Initial popup click handler
    document.addEventListener('click', handlePopupClick);
    
    // Make the handler available globally for language switching
    window.handlePopupClick = handlePopupClick;
    
    // Create and initialize new game instance
    const gameOfLife = new GameOfLife(canvas);
    
    // Store reference to game instance
    window.gameOfLife = gameOfLife;
    
    // Log canvas dimensions
    console.log('Canvas dimensions:', {
        width: canvas.width,
        height: canvas.height,
        styleWidth: canvas.style.width,
        styleHeight: canvas.style.height,
        clientWidth: canvas.clientWidth,
        clientHeight: canvas.clientHeight
    });
}); 