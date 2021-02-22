#include <iostream>
#include <mpi.h>
#include <unistd.h>
#include <stdlib.h>

#define MCW MPI_COMM_WORLD

using namespace std;
// section a (all reduce)
void allreduce(){
    int rank, size;

    MPI_Comm_rank(MCW, &rank); 
    MPI_Comm_size(MCW, &size); 
    
    int aData = rank;
    int aTotal = -1;

    MPI_Allreduce(&aData,&aTotal,1,MPI_INT,MPI_SUM,MCW);
    MPI_Barrier(MCW);
    cout<<rank<<" calculated total using MPI_Allreduce: "<<aTotal<<endl;
    
}

// section b (using gather and bcast)
void gatherAndBcast(){
    int rank, size;

    MPI_Status mystatus;
    MPI_Comm_rank(MCW, &rank); 
    MPI_Comm_size(MCW, &size); 

    int bData = rank;
    int recvdata[size];
    int bTotal = 0;
    if(rank <= 0){
        for(int i=0;i<8;++i){
            recvdata[i]=-1;
        }
    }
    
    MPI_Gather(&bData,1,MPI_INT,recvdata,1,MPI_INT,0,MCW);
    if(rank<=0){
        for(int i=0;i<size;++i){
            bTotal += recvdata[i];
        }
    }
    MPI_Bcast(&bTotal, 1, MPI_INT, 0, MCW);
    MPI_Barrier(MCW);
    cout<<rank<<" calculated total using MPI_Gather and MPI_Bcast: "<<bTotal<<endl;
    
}

//section c (Using MPI_Send and MPI_Recv)
void sendAndReceive(){
    int rank, size;

    MPI_Status mystatus;
    MPI_Comm_rank(MCW, &rank); 
    MPI_Comm_size(MCW, &size); 

    int cData = rank;
    int cTotal = 0;
    int received = 1;

    if (rank == 0){
        while(received < size){
            MPI_Recv(&cData, 1, MPI_INT, MPI_ANY_SOURCE, 0, MCW, &mystatus);
            cTotal += cData;
            received += 1;
        }
        for(int i=1;i<size;++i){
            MPI_Send(&cTotal, 1, MPI_INT, i, 1, MCW);
        }

    }
    else{
        MPI_Send(&cData, 1, MPI_INT, 0, 0, MCW);
        MPI_Recv(&cTotal, 1, MPI_INT, 0, 1, MCW, &mystatus);
    }
    MPI_Barrier(MCW);
    cout<<rank<<" calculated total using MPI_Send and MPI_Recv: "<<cTotal<<endl;
    
}

//section d (using ring topology)
void ring(int *data){
    int rank, size;
    int dest;
    

    MPI_Status mystatus;
    MPI_Comm_rank(MCW, &rank); 
    MPI_Comm_size(MCW, &size); 

    dest = (rank+1)%size;
    MPI_Send(data,1,MPI_INT,dest,0,MCW);
    MPI_Recv(data,1,MPI_INT,MPI_ANY_SOURCE,0,MCW,&mystatus);

}

// section e (using hypercube topology)
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


int main(int argc, char **argv){
    int rank, size;

    MPI_Status mystatus;
    MPI_Init(&argc, &argv);
    MPI_Comm_rank(MCW, &rank); 
    MPI_Comm_size(MCW, &size);
    MPI_Barrier(MCW);


    // section a
    allreduce();
    MPI_Barrier(MCW);
    sleep(1);
    
    // section b
    gatherAndBcast();
    MPI_Barrier(MCW);
    sleep(1);
    
    // section c
    
    sendAndReceive();
    MPI_Barrier(MCW);
    sleep(1);
    
    
    // section d
    int dData = rank;
    int dTotal = 0;

    for (int i = 0; i < size; ++i){
        MPI_Barrier(MCW);
        ring(&dData);
        MPI_Barrier(MCW);
        dTotal += dData;
    }
    MPI_Barrier(MCW);
    cout<<rank<<" calculated total using a ring interconnection topology: "<<dTotal<<endl;
    sleep(1);

    // section e
    
    int pwr = 0;
    int numProcesses = size;
    while(numProcesses > 1){
        numProcesses /= 2;
        pwr += 1;
    }
    int eData;
    int eTotal = rank;

    for(int i = 0; i < pwr; ++i){
        eData = eTotal;
        MPI_Barrier(MCW);
        cube(&eData, i);
        MPI_Barrier(MCW);
        eTotal += eData;
    }
    MPI_Barrier(MCW);
    cout<<rank<<" calculated total using a hypercube topology: "<<eTotal<<endl;
    

    MPI_Finalize();

    return 0;
}

