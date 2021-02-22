#include <iostream>
#include <mpi.h>
#include <unistd.h>
#include <stdlib.h>
#include <random>

#define MCW MPI_COMM_WORLD

using namespace std;

int main(int argc, char** argv) {
    int orders = 0;
    int todo = 0;
    int epithet;
    int rank, size;
    
    MPI_Status mystatus;
    MPI_Init(&argc, &argv);
    MPI_Comm_rank(MCW, &rank);
    MPI_Comm_size(MCW, &size);

    srand(rank);

    if (rank == 0) {// Cook
        while (1) {
            int myFlag;
            MPI_Iprobe(MPI_ANY_SOURCE, MPI_ANY_TAG, MCW, &myFlag, &mystatus);
            while(myFlag){
                MPI_Recv(&orders, 1, MPI_INT, MPI_ANY_SOURCE, 0, MCW, MPI_STATUS_IGNORE);
                todo += orders;
                MPI_Iprobe(MPI_ANY_SOURCE, MPI_ANY_TAG, MCW, &myFlag, &mystatus);
            }
            cout << "Cook: Looks like there are " << todo << " queued up." << endl;
            if (todo == 0) {
                cout << "Cook:  I'm taking a smoke break." << endl;
                sleep(1);
            }
            else if (todo > 0 && todo <= 20) {
                while (todo > 0) {
                    sleep(1);
                    todo -= 1;
                    cout << "Cook: Finished an order, there are " << todo << " to go." << endl;
                }
                
                cout << "Cook: I finished the order queue. Let's see if there's anything else." << endl;
            }
            else if (todo > 20) {
                //send quit message to all chefs
                cout << "Cook: That's it! I quit!!!\n*Proceeds to shout obescenities while leaving and knocking things over.*" << endl;
                epithet = rand() % size;
                for (int i = 1; i < size; ++i) { // send epithet to each chef before leaving
                    MPI_Send(&epithet, 1, MPI_INT, i, 1, MCW);
                }
                break;
            }
        }
    }
    else { // Chefs
        while (1) {
            int myFlag;
            MPI_Iprobe(0, MPI_ANY_TAG, MCW, &myFlag, &mystatus);
            if (myFlag) {
                if (mystatus.MPI_TAG == 1) {
                    MPI_Recv(&orders, 1, MPI_INT, 0, 1, MCW, MPI_STATUS_IGNORE);
                    cout << "Chef "<< rank <<": If he's quitting, then I'm leaving too. *Gets flustered and leaves.*" << endl;
                    break;
                }
            }
            else {
                int orderMaking = rand() % 5 + 1;
                sleep(orderMaking);
                orders = 1;
                MPI_Send(&orders, 1, MPI_INT, 0, 0, MCW);
                cout << "Chef: " << rank << ": puts in an order." << endl;
            }
        }
    }
    MPI_Finalize();
    return 0;
}