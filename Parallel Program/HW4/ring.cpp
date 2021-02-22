
#include <iostream>
#include <mpi.h>
#include <unistd.h>
#include <stdlib.h>

#define MCW MPI_COMM_WORLD

using namespace std;

void cube(int *data, int m){
    int rank, size;
    int dest;
    unsigned int mask=1;
    MPI_Comm_rank(MCW, &rank); 
    MPI_Comm_size(MCW, &size); 

    dest = rank^(mask<<m);

    MPI_Send(data,1,MPI_INT,dest,0,MCW);
    MPI_Recv(data,1,MPI_INT,MPI_ANY_SOURCE,0,MCW,MPI_STATUS_IGNORE);

    return;
}

void ring(int *data, int plusMinus){
    int rank, size;
    int dest;
    MPI_Comm_rank(MCW, &rank); 
    MPI_Comm_size(MCW, &size); 
    if(plusMinus==1){
        dest = (rank+1)%size;
    }else{
        dest = ((rank-1)+size)%size;
    }

    MPI_Send(data,1,MPI_INT,dest,0,MCW);
    MPI_Recv(data,1,MPI_INT,MPI_ANY_SOURCE,0,MCW,MPI_STATUS_IGNORE);

    return;
}

int main(int argc, char **argv){

    int rank, size;
    int data;
    MPI_Init(&argc, &argv);
    MPI_Comm_rank(MCW, &rank); 
    MPI_Comm_size(MCW, &size); 

    data = rank;
    cube(&data,0);
    MPI_Barrier(MCW);
    cube(&data,2);
    MPI_Barrier(MCW);
    cube(&data,1);
    MPI_Barrier(MCW);
    cube(&data,2);
    MPI_Barrier(MCW);
    cube(&data,0);
    MPI_Barrier(MCW);
    cube(&data,2);
    MPI_Barrier(MCW);
    cube(&data,1);
    MPI_Barrier(MCW);
    cube(&data,2);
    MPI_Barrier(MCW);

    cout<<"I am "<<rank<<" of "<<size<<"; got a message from "<<data<<endl;


    MPI_Finalize();

    return 0;
}

