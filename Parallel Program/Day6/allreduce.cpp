

#include <iostream>
#include <mpi.h>
#include <unistd.h>
#include <stdlib.h>

#define MCW MPI_COMM_WORLD

using namespace std;

int main(int argc, char **argv){

    int rank, size;
    int data[2];
    int answer[2];
    float t1, t2;
    MPI_Init(&argc, &argv);
    MPI_Comm_rank(MCW, &rank); 
    MPI_Comm_size(MCW, &size); 
    srand(rank);

    int recvdata[8];

    data[0]=rank;
    data[1]=rank;
    answer[0]=-1;
    answer[1]=-1;
    MPI_Allreduce(data,answer,2,MPI_INT,MPI_MAX,MCW);
    cout<<rank<<": "<<answer[0]<<" "<<answer[1]<<endl;


    MPI_Finalize();

    return 0;
}

