import java.util.*;

public class SudokuTester{
    static int[][] board = {
        {1, 2, 3, 4, 5, 6, 7, 8, 0},
        {0, 0, 0, 0, 0, 0, 0, 0, 9},
        {0, 0, 0, 0, 0, 0, 0, 0, 0},
        {2, 3, 4, 5, 6, 7, 8, 9, 0},
        {0, 0, 0, 0, 0, 0, 0, 0, 1},
        {0, 0, 0, 0, 0, 0, 0, 0, 0},
        {3, 4, 5, 6, 7, 8, 9, 1, 0},
        {0, 0, 0, 0, 0, 0, 0, 0, 2},
        {0, 0, 0, 0, 0, 0, 0, 0, 0}
    };

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        while (true) {
            printBoard();

            if (isSolved()) {
                System.out.println("You solved the Sudoku.");
                break;
            }

            System.out.print("Enter row (1-9), column (1-9), number (1-9): ");
            int row = scanner.nextInt() - 1;
            int col = scanner.nextInt() - 1;
            int num = scanner.nextInt();

            if (isValidMove(row, col, num)) {
                board[row][col] = num;
            } else {
                System.out.println("Invalid Move");
            }
    }
}

    static void printBoard() {
        System.out.println("\nCurrent Board:");
        for (int i = 0; i < 9; i++) {
            if (i % 3 == 0 && i != 0) System.out.println("------+-------+------");
            for (int j = 0; j < 9; j++) {
                if (j % 3 == 0 && j != 0) System.out.print("| ");
                System.out.print(board[i][j] == 0 ? ". " : board[i][j] + " ");
            }
            System.out.println();
        }
    }

    static boolean isValidMove(int row, int col, int num) {
        if (board[row][col] != 0) return false;

        for (int i = 0; i < 9; i++) {
            if (board[row][i] == num) return false;
            if (board[i][col] == num) return false;
        }

        int boxRow = row / 3 * 3;
        int boxCol = col / 3 * 3;

        for (int i = 0; i < 3; i++){
            for (int j = 0; j < 3; j++){
                if (board[boxRow + i][boxCol + j] == num) return false;
            }  
        }

        return true;
    }

    static boolean isSolved() {
        for (int i = 0; i < 9; i++){
            for (int j = 0; j < 9; j++){
                if (board[i][j] == 0) return false;
            }
        }
        return true;
    }
}