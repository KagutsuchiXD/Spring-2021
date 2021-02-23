#include <iostream>
#include <mpi.h>
#include <unistd.h>
#include <stdlib.h>
#include <random>

#define MCW MPI_COMM_WORLD

using namespace std;

int ithbit(int r,int i){
    return (r & (1<<i));
}

int main(int argc, char **argv){
    int rank, size;

    MPI_Status mystatus;
    int data;
    MPI_Init(&argc, &argv);
    MPI_Comm_rank(MCW, &rank); 
    MPI_Comm_size(MCW, &size);
    srand(time(NULL) + rank);

    int toSort[size];
    for(int i = 0; i < size; ++i){
        toSort[i] = rand() % (size * 3) + 1;
    }
    int recvData[size];

    if(rank==0){
        cout << "Original List: " << endl;
        for(int i=0;i<size;++i){
            cout<<toSort[i]<<endl;
        }
    }
    
    MPI_Scatter(toSort,1,MPI_INT,&data,1,MPI_INT,0,MCW);

    int pwr = 0;
    int numProcesses = size;
    while(numProcesses > 1){
        numProcesses /= 2;
        pwr += 1;
    }

    int currentData = data;
    
    MPI_Barrier(MCW);
    for(int i = 0; i < pwr; ++i){
        for(int j = i; j >= 0; j--){
            MPI_Barrier(MCW);
            unsigned int map = 1;
            int dest = rank^(map<<j);
            MPI_Send(&currentData,1,MPI_INT,dest,0,MCW);
            MPI_Recv(&data,1,MPI_INT,MPI_ANY_SOURCE,0,MCW,&mystatus);
            if(!ithbit(rank,i+1)){
                if(ithbit(rank,j)){
                    if (data >= currentData){
                        currentData = data;
                    }
                }
                else{
                    if (data <= currentData){
                    currentData = data;
                    }
                }
            }
            else{
                if(ithbit(rank,j)){
                    if (data <= currentData){
                        currentData = data;
                    }
                }
                else{
                    if (data >= currentData){
                    currentData = data;
                    }
                }
            }

            
        }
    }
    MPI_Barrier(MCW);
    
    MPI_Allgather(&currentData,1,MPI_INT,recvData,1,MPI_INT,MCW);
    sleep(1);
    if(rank==0){
        cout << "Sorted List: " << endl;
        for(int i=0;i<size;++i){
            cout<<recvData[i]<<endl;
        }
    }
    
    MPI_Finalize();

    return 0;
}