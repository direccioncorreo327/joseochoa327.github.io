const board = document.getElementById('board');
const squares = [];
let selectedPiece = null;
let currentPlayer = 'player1';

const initializeBoard = () => {
    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            const square = document.createElement('div');
            square.classList.add('square');
            square.classList.add((row + col) % 2 === 0 ? 'light' : 'dark');
            square.dataset.row = row;
            square.dataset.col = col;
            board.appendChild(square);
            squares.push(square);

            if (row < 3 && (row + col) % 2 !== 0) {
                const piece = createPiece('player1');
                square.appendChild(piece);
            } else if (row > 4 && (row + col) % 2 !== 0) {
                const piece = createPiece('player2');
                square.appendChild(piece);
            }
        }
    }

    document.querySelectorAll('.piece').forEach(piece => {
        piece.addEventListener('click', handlePieceClick);
    });

    squares.forEach(square => {
        square.addEventListener('click', handleSquareClick);
    });
};

const createPiece = (player) => {
    const piece = document.createElement('div');
    piece.classList.add('piece', player);
    return piece;
};

const handlePieceClick = (event) => {
    const piece = event.currentTarget;
    if (piece.classList.contains(currentPlayer)) {
        selectedPiece = piece;
        highlightMoves(piece);
    }
};

const handleSquareClick = (event) => {
    if (selectedPiece) {
        const square = event.currentTarget;
        if (isValidMove(selectedPiece, square)) {
            movePiece(selectedPiece, square);
            selectedPiece = null;
            switchPlayer();
        }
    }
};

const highlightMoves = (piece) => {
    // Clear previous highlights
    squares.forEach(square => {
        square.classList.remove('highlight');
    });

    const row = parseInt(piece.parentElement.dataset.row);
    const col = parseInt(piece.parentElement.dataset.col);

    const directions = currentPlayer === 'player1' ? [[1, -1], [1, 1]] : [[-1, -1], [-1, 1]];

    directions.forEach(direction => {
        const newRow = row + direction[0];
        const newCol = col + direction[1];
        const targetSquare = squares.find(sq => sq.dataset.row == newRow && sq.dataset.col == newCol);
        if (targetSquare && !targetSquare.firstChild) {
            targetSquare.classList.add('highlight');
        }
    });
};

const isValidMove = (piece, square) => {
    return square.classList.contains('highlight');
};

const movePiece = (piece, targetSquare) => {
    const originSquare = piece.parentElement;
    targetSquare.appendChild(piece);
    checkForKing(piece, parseInt(targetSquare.dataset.row));
    clearHighlights();
};

const checkForKing = (piece, row) => {
    if ((currentPlayer === 'player1' && row === 7) || (currentPlayer === 'player2' && row === 0)) {
        piece.classList.add('king');
    }
};

const switchPlayer = () => {
    currentPlayer = currentPlayer === 'player1' ? 'player2' : 'player1';
};

const clearHighlights = () => {
    squares.forEach(square => {
        square.classList.remove('highlight');
    });
};

initializeBoard();
