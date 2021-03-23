package Next;
import java.io.OutputStream;
        import java.io.IOException;
        import java.io.InputStream;
        import java.io.PrintWriter;
        import java.util.Scanner;

/**
 * Built using CHelper plug-in
 * Actual solution is at the top
 *
 * @author Alice
 */
public class Round {
    public static void main(String[] args) {
        InputStream inputStream = System.in;
        OutputStream outputStream = System.out;
        Scanner in = new Scanner(inputStream);
        PrintWriter out = new PrintWriter(outputStream);
        TaskA solver = new TaskA();
        solver.solve(1, in, out);
        out.close();
    }

    static class TaskA {
        public void solve(int testNumber, Scanner in, PrintWriter out) {
            int n = in.nextInt();
            int k = in.nextInt();
            int[] score = new int[n];
            int count = 0;

            for(int i=0; i<n; i++)
            {
                score[i] = in.nextInt();
            }
            if(score[k-1]==0)
            {
                for(int i=0; i<k;i++)
                {
                    if(score[i]==0)
                        count++;
                }
                out.println(k-count);
            }
           else {
                int score1 = score[k - 1];
                for (int m = 0; m < n; m++) {
                    if (score[m] < score1) {
                        out.println(m);
                        break;
                    } else if (score1 == score[n - 1]) {
                        out.println(n);
                        break;
                    }
                }
            }
        }
    }
}

