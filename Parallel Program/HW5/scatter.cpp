
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

    int senddata[8];
    if(rank==0){
        for(int i=0;i<8;++i)senddata[i]=i;
    }
    MPI_Scatter(senddata,2,MPI_INT,data,2,MPI_INT,0,MCW);
    cout<<rank<<": data is equal to "<<data[0]<<" "<<data[1]<<endl;


    MPI_Finalize();

    return 0;
}

