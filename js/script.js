
let tileTypes = document.querySelectorAll('#walltile-types li');
tileTypes.forEach(function(tileType) {
  tileType.addEventListener('click', function() {
    let type = this.getAttribute('data-type');

    tileTypes.forEach(function(tileType) {
      tileType.classList.remove('selected');
    });

    this.classList.add('selected');

    let tiles = document.querySelectorAll('.tiles');
    tiles.forEach(function(tile) {
      tile.classList.remove('selected');
    });

    let selectedTiles = document.querySelector(`.tiles.${type}`);
    selectedTiles.classList.add('selected');
  });
});

document.querySelector('.tiles.bathroom').classList.add('selected');
