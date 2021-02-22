


#include <iostream>
#include <mpi.h>
#include <unistd.h>
#include <stdlib.h>

#define MCW MPI_COMM_WORLD

using namespace std;

int main(int argc, char **argv){

    int rank, size;
    int data[2];
    float t1, t2;
    MPI_Init(&argc, &argv);
    MPI_Comm_rank(MCW, &rank); 
    MPI_Comm_size(MCW, &size); 
    srand(rank);

    int recvdata[8];
    if(1){
        for(int i=0;i<8;++i)recvdata[i]=-1;
    }
    data[0]=rank;
    data[1]=rank;
    MPI_Allgather(data,1,MPI_INT,recvdata,1,MPI_INT,MCW);
    if(rank==3){
        for(int i=0;i<8;++i)cout<<recvdata[i]<<endl;
    }


    MPI_Finalize();

    return 0;
}

