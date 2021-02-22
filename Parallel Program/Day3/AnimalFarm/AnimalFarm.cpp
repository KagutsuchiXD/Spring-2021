#include <iostream>
#include <mpi.h>
#include <unistd.h>
#include <stdlib.h>

#define MCW MPI_COMM_WORLD

using namespace std;

int main(int argc, char** argv) {

    int rank, size;
    int work;
    int data;
    MPI_Status mystatus;
    MPI_Init(&argc, &argv);
    MPI_Comm_rank(MCW, &rank);
    MPI_Comm_size(MCW, &size);

    //MPI_Recv(&data,1,MPI_INT,MPI_ANY_SOURCE,0,MCW,MPI_STATUS_IGNORE);

    if (rank == 0) {

        // pig sends work to all horses
        for (int i = 1; i < size; ++i) {
            work = (rand() % 10) + 1;
            MPI_Send(&work, 1, MPI_INT, i, 0, MCW);
            cout << "pig sends " << work << " work to horse " << i << endl;
        }

        // pig waits to receive work done messages, reassigns work
        while (1) {
            MPI_Recv(&data, 1, MPI_INT, MPI_ANY_SOURCE, 1, MCW, &mystatus);
            cout << "pig receives word that horse " << mystatus.MPI_SOURCE << " Has completed task" << endl;
            work = (rand() % 10) + 1;
            MPI_Send(&work, 1, MPI_INT, mystatus.MPI_SOURCE, 0, MCW);
            cout << "pig sends " << work << " work to horse " << mystatus.MPI_SOURCE << endl;
        }
    }
    else {
        //horse
        while (1) {
            MPI_Recv(&work, 1, MPI_INT, MPI_ANY_SOURCE, 0, MCW, &mystatus);
            cout << "horse " << rank << " receives work from pig" << endl;
            sleep(work);
            cout << "horse " << rank << " has completed its work" << endl;
            MPI_Send(&work, 1, MPI_INT, 0, 1, MCW);
        }

    }



    MPI_Finalize();

    return 0;
}