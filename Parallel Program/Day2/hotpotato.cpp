#include <iostream>
#include <mpi.h>
#include <unistd.h>
#include <stdlib.h>

#define MCW MPI_COMM_WORLD

using namespace std;

int main(int argc, char** argv) {

    int rank, size;
    int data;
    int potato;

    MPI_Init(&argc, &argv);
    MPI_Comm_rank(MCW, &rank);
    MPI_Comm_size(MCW, &size);

    srand(rank);
    bool going = true;

    if (rank == 0) {
        potato = rand() % 10 + 5;
        MPI_Send(&potato, 1, MPI_INT, rand() % size, 0, MCW);
    }

    while (going) {
        MPI_Recv(&potato, 1, MPI_INT, MPI_ANY_SOURCE, 0, MCW, MPI_STATUS_IGNORE);

        if (potato == -1) {
            cout << rank << " : oooooh!" << endl;
            break;
        }

        cout << rank << " : received the potato with value " << potato << endl;

        potato--;
        if (potato == 0) {
            cout << rank << " : spudow!" << endl;
            for (int i = 0; i < size; ++i) {
                potato = -1;
                MPI_Send(&potato, 1, MPI_INT, i, 0, MCW);
            }
        }
        else {
            MPI_Send(&potato, 1, MPI_INT, rand() % size, 0, MCW);
        }
    }
    
    MPI_Finalize();

    return 0;
}
