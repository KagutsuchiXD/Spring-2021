
#include <iostream>
#include <mpi.h>
#include <unistd.h>
#include <stdlib.h>

#define MCW MPI_COMM_WORLD

using namespace std;

int main(int argc, char **argv){

    int rank, size;
    int data;
    MPI_Request myrequest;
    MPI_Status mystatus;
    int flag;

    MPI_Init(&argc, &argv);
    MPI_Comm_rank(MCW, &rank); 
    MPI_Comm_size(MCW, &size); 

    if(!rank){
        sleep(4);
        MPI_Send(&rank,1,MPI_INT,(rank+1)%size,0,MCW);
    }else{
        data=rank;
        MPI_Irecv(&data,1,MPI_INT,MPI_ANY_SOURCE,0,MCW,&myrequest);
        while(1){
            MPI_Test(&myrequest,&flag,&mystatus);
            if(flag){
                cout<<"oh!"<< data << endl;
                break;            
            }
            sleep(1);
            cout<<"I'm workin'..."<< data << endl;
        }
        cout<<"I'm done."<< data << endl;
        
    }

    MPI_Finalize();

    return 0;
}

