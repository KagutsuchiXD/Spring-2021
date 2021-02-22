#include <iostream>
#include <mpi.h>
#include <unistd.h>
#include <stdlib.h>
#include <vector>
#include <random>

#define MCW MPI_COMM_WORLD

using namespace std;

int main(int argc, char** argv) {
    int numBalls = 1000;
    int ball = 1; 
    int rank, size;
    
    MPI_Status mystatus;
    MPI_Init(&argc, &argv);
    MPI_Comm_rank(MCW, &rank);
    MPI_Comm_size(MCW, &size);
    
    srand(time(NULL));

    if (rank == 0) {
        // Hopper drops ball to random peg
        vector<int> results;
        for (int i = 0; i < size; ++i) {
            results.push_back(0);
        } 

        int peg = size / 2;

        MPI_Send(&ball, 1, MPI_INT, peg, 0, MCW);

        while (numBalls > 0) {
            MPI_Recv(&ball, 1, MPI_INT, MPI_ANY_SOURCE, 1, MCW, &mystatus);
            numBalls -= 1;
            results[mystatus.MPI_SOURCE] += 1;
            ball = 1;
            MPI_Send(&ball, 1, MPI_INT, peg, 0, MCW);
        }
        
        ball = -1;
        for (int i = 1; i < size; ++i) {
            MPI_Send(&ball, 1, MPI_INT, i, 0, MCW);
        }

        for (int i = 1; i < size; ++i) {
            cout << "Holder " << i << " has: " << results[i] << endl;
        }
    }
    else {
        //Columns
        while (1) {
            MPI_Recv(&ball, 1, MPI_INT, MPI_ANY_SOURCE, 0, MCW, &mystatus);

            if (ball == -1) {
                break;
            }
            else {
                if (ball == 5) {
                    MPI_Send(&ball, 1, MPI_INT, 0, 1, MCW);
                }
                else {
                    ball += 1;

                    if (rank == 1) { // far left column
                        MPI_Send(&ball, 1, MPI_INT, 2, 0, MCW);
                    }
                    else if (rank == size - 1) { // far right column
                        MPI_Send(&ball, 1, MPI_INT, rank-1, 0, MCW);
                    }
                    else { // determine whether the ball will move to different column then determine whether to pass to the left or right
                        int moveOrNot = rand()%2;
                        int move;

                        if (rand()%2 == 0){
                            move = 1;
                        }
                        else {
                            move = -1;
                        }
                        if (moveOrNot == 1) {
                            MPI_Send(&ball, 1, MPI_INT, rank+move, 0, MCW);
                        }
                        else {
                            MPI_Send(&ball, 1, MPI_INT, rank, 0, MCW);
                        }
                    }
                }
            }
        }
    }

    MPI_Finalize();
    return 0;
}