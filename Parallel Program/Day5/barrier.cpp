#include <iostream>
#include <mpi.h>
#include <unistd.h>
#include <stdlib.h>

#define MCW MPI_COMM_WORLD

using namespace std;

int main(int argc, char **argv){

    int rank, size;
    int data;
    float t1, t2;
    MPI_Init(&argc, &argv);
    MPI_Comm_rank(MCW, &rank); 
    MPI_Comm_size(MCW, &size); 
    srand(rank);

    cout<<rank<<": starting up.\n";
    sleep(rand()%10);
    cout<<rank<<": arrived at barrier.\n";
    MPI_Barrier(MCW);
    cout<<rank<<": I'm freeeeeee!.\n";

    MPI_Finalize();

    return 0;
}

