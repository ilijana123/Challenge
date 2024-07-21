const constants: Array<string> = ['>', 's', '-', '|', ' ', '+'];

function isStart(character: string) {
  return character === constants[0];
}

function isTurn(character: string) {
  return character === constants[5];
}

function isEnd(character: string) {
  return character === constants[1];
}

function isSpace(character: string) {
  return character === constants[4];
}

function isAscii(character: string): boolean {
  const codePoint = character.charCodeAt(0);
  return codePoint > 0 && codePoint <= 127;
}

function isUpperLetter(character: string) {
  return /^[A-Z]$/.test(character);
}

function isLetter(character: string) {
  return character && character.match(/[a-zA-Z]/i);
}

export interface Position {
  x: number;
  y: number;
}

function isPath(grid: string[][]): { path: string; letters: string } {
  // Defining visited array to keep track of already visited indexes
  let visited = new Array(grid.length);
  for (let i = 0; i < grid.length; i++) {
    visited[i] = new Array(grid[0].length);
    for (let j = 0; j < grid[0].length; j++) {
      visited[i][j] = false;
    }
  }

  // Flag to indicate whether the path exists or not
  let flag = false;
  let path = '';
  let letters = '';

  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[0].length; j++) {
      // if grid[i][j] is source(>) and it is not visited
      if (isStart(grid[i][j]) && !visited[i][j]) {
        // Starting from i, j and then finding the path
        const result = checkPath(grid, i, j, visited);
        path = result.path;
        letters = result.letters;
        if (path) {
          flag = true;
          break;
        }
      }
    }
  }

  return { path: flag ? path : 'No Path Found', letters };
}

// Method for checking boundaries
function isSafe(i: number, j: number, grid: string[][]): boolean {
  return (
    i >= 0 &&
    i < grid.length &&
    j >= 0 &&
    j < grid[0].length
  );
}
 
// Returns true if there is a
    // path from a source (a
    // cell with value >) to a
    // destination (a cell with
    // value s)
    function checkPath(
        grid: string[][],
        i: number,
        j: number,
        visited: any[],
        currentPath: string = '',
        currentLetters: string = ''
      ): { path: string; letters: string } {
        // Checking the boundaries, empty cells(' ') and whether the cell is unvisited
        if (isSafe(i, j, grid) && grid[i][j] !== ' ' && !visited[i][j]) {
          visited[i][j] = true;
          currentPath += grid[i][j];
      
          // Collect letters if it's an upper case letter
          if (isUpperLetter(grid[i][j])) {
            currentLetters += grid[i][j];
          }
      
          // if the cell is the required destination then return true
          if (isEnd(grid[i][j])) {
            return { path: currentPath, letters: currentLetters };
          }
      
          // traverse up
          const up = checkPath(grid, i - 1, j, visited, currentPath, currentLetters);
      
          // if path is found in up direction return true
          if (up.path) {
            return up;
          }
      
          // traverse left
          const left = checkPath(grid, i, j - 1, visited, currentPath, currentLetters);
      
          // if path is found in left direction return true
          if (left.path) {
            return left;
          }
      
          // traverse down
          const down = checkPath(grid, i + 1, j, visited, currentPath, currentLetters);
      
          // if path is found in down direction return true
          if (down.path) {
            return down;
          }
      
          // traverse right
          const right = checkPath(grid, i, j + 1, visited, currentPath, currentLetters);
      
          // if path is found in right direction return true
          if (right.path) {
            return right;
          }
        }
      
        // Backtrack if no path is found in any direction
        return { path: '', letters: '' };
      }
export function PathFinder(grid: string[][]) {
    const { path, letters } = isPath(grid);

    return { path: [path].join(''), letters: [letters].join('') };
}