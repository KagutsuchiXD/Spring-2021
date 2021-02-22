#include <iostream>
#include <mpi.h>
#include <unistd.h>
#include <stdlib.h>

#define MCW MPI_COMM_WORLD

using namespace std;

int main(int argc, char** argv) {

    int rank, size;
    int data;
    float t1, t2;
    int task;
    MPI_Status mystatus;
    MPI_Init(&argc, &argv);
    MPI_Comm_rank(MCW, &rank);
    MPI_Comm_size(MCW, &size);
    srand(rank);

    if (!rank) {
        while(1) { // Miyagi
            task = rand() % 3;
            if (task == 0) {
                cout << "Miyagi:  Daniel, do \"Wax the Car\"." << endl;
                MPI_Send(&task, 1, MPI_INT, 1, 0, MCW);
            }
            if (task == 1) {
                cout << "Miyagi:  Daniel, do \"Paint the Fence\"." << endl;
                MPI_Send(&task, 1, MPI_INT, 1, 1, MCW);
            }
            if (task == 2) {
                cout << "Miyagi:  Daniel, do \"Sand the Walk\"." << endl;
                MPI_Send(&task, 1, MPI_INT, 1, 2, MCW);
            }
            int sleeptime = rand() % 5 + 1;
            sleep(sleeptime);
        }
    }
    else { // Daniel Rand
        while (1) {
            int myFlag;
            MPI_Iprobe(0, MPI_ANY_TAG, MCW, &myFlag, &mystatus);
            if (myFlag) {
                if (mystatus.MPI_TAG == 0) {
                    MPI_Recv(&task, 1, MPI_INT, 0, 0, MCW, MPI_STATUS_IGNORE);
                    cout << "Daniel:  Okay, I will wax the car." << endl;
                    sleep(1);
                }

                if (mystatus.MPI_TAG == 1) {
                    MPI_Recv(&task, 1, MPI_INT, 0, 1, MCW, MPI_STATUS_IGNORE);
                    cout << "Daniel:  Okay, I will paint the fence." << endl;
                    sleep(1);
                }

                if (mystatus.MPI_TAG == 2) {
                    MPI_Recv(&task, 1, MPI_INT, 0, 2, MCW, MPI_STATUS_IGNORE);
                    cout << "Daniel:  Okay, I will sand the walk." << endl;
                    sleep(1);
                }
                
            }
            else {
                cout << "Daniel:  I'm gonna go hangout with Ali." << endl;
                sleep(1);
            }
        }
    }

    MPI_Finalize();

    return 0;
}