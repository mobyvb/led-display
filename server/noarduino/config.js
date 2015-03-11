var rows = 7;
var cols = 7;
var coords = [];
var coordMap = [];
for (var i = 0; i < cols; i++) {
    coordMap[i] = [];
    for (var j = 0; j < rows; j++) {
        coordMap[i][j] = 0;
    }
}

for (var i = 0; i < rows * cols; i++) {
    coords[i] = [0, 0, 0];
    var col = Math.floor(i / rows);
    var row = i % rows;
    if (col % 2 === 0) {
        row = rows - row - 1;
    }
    coordMap[col][row] = i;
}


module.exports = {
    rows: rows,
    cols: cols,
    coords: coords,
    coordMap: coordMap
};
