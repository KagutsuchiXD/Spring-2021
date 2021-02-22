
#include <iostream>
#include <mpi.h>
#include <unistd.h>
#include <stdlib.h>

#define MCW MPI_COMM_WORLD

using namespace std;

int main(int argc, char **argv){

    int rank, size;
    int data=0;
    float t1, t2;
    MPI_Init(&argc, &argv);
    MPI_Comm_rank(MCW, &rank); 
    MPI_Comm_size(MCW, &size); 
    srand(rank);
    
    if(!rank) data = 42;
    cout<<rank<<": data is equal to "<<data<<endl;
    if(!rank)sleep(10);
    int root = 0;
    MPI_Bcast(&data,1,MPI_INT,root,MCW);
    cout<<rank<<": data is equal to "<<data<<endl;





    MPI_Finalize();

    return 0;
}

