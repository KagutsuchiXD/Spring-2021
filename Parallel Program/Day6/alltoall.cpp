

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
    data = rank;

    int recvdata[8];
    for(int i=0;i<8;++i)recvdata[i]=-1;
    MPI_Alltoall(&data,1,MPI_INT,recvdata,1,MPI_INT,MCW);

    if(rank == 2){
        for(int i=0;i<8;++i){
            cout<<recvdata[i]<<" ";
        }
        cout<< endl;
    }



    MPI_Finalize();

    return 0;
}

