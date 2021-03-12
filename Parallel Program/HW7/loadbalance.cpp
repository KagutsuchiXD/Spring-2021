#include <iostream>
#include <chrono>
#include <mpi.h>
#include <unistd.h>
#include <stdlib.h>
#include <vector>
#include <random>

#define MCW MPI_COMM_WORLD

using namespace std;

void doTask(int num){
    int incrementor = 0;
    for (int i = 0; i < (num * num); ++i){
        incrementor++;
    }
}

int main(int argc, char** argv){
    int totalTasks;
    int tasksMade;
    int numNewTasks;
    int rank, size;
    bool processBlack = false;
    bool tokenBlack = false;
    vector<int> taskQueue;

    MPI_Status mystatus;
    MPI_Init(&argc, &argv);
    MPI_Comm_rank(MCW, &rank);
    MPI_Comm_size(MCW, &size);

    srand(rank);

    if(rank == 0){
        totalTasks = rand()%(2048 - 1024) + 1024;
    }
    MPI_Bcast(&totalTasks, 1, MPI_INT, 0, MCW);

    int task;

    if(rank%2 = 0){
        while(1){
            if(rank == 0){
                int newTasksFlag;
                MPI_Iprobe(MPI_ANY_SOURCE, 1, MCW, &newTasksFlag, &mystatus);
                while(newTasksFlag){
                MPI_Recv(&numNewTasks, 1, MPI_INT, MPI_ANY_SOURCE, 0, MCW, &mystatus);
                tasksMade += numNewTasks;
                MPI_Iprobe(MPI_ANY_SOURCE, 1, MCW, &newTasksFlag, &mystatus);
                }
            }
            MPI_Bcast(&tasksMade, 1, MPI_INT, 0, MCW);

            int flag;
            MPI_Iprobe(MPI_ANY_SOURCE, 0, MCW, &flag, &mystatus);
            while(flag){
                MPI_Recv(&task, 1, MPI_INT, MPI_ANY_SOURCE, 0, MCW, &mystatus);
                taskQueue.push_back(task);
                MPI_Iprobe(MPI_ANY_SOURCE, 0, MCW, &myFlag, &mystatus);
            }

            if(taskQueue.size() > 16){
                int sendTo1;
                int sendTo2;
                do{
                    sendTo1 = rand() % size;
                    sendTo2 = rand() % size;
                }while(sendTo1 != rank && sendTo2 != rank);

                if(rank > 0){
                    if(sendTo1 < rank || sendTo2 < rank){
                        processBlack = true;
                    }
                }

                int sendingTask1 = taskQueue[(taskQueue.size()-1)];
                taskQueue.pop_back();
                MPI_Send(&sendingTask1, 1, MPI_INT, sendTo1, 0, MCW);

                int sendingTask2 = taskQueue[(taskQueue.size()-1)];
                taskQueue.pop_back();
                MPI_Send(&sendingTask2, 1, MPI_INT, sendTo2, 0, MCW);
            }

            if(taskQueue.size()>0){
                int workingTask = taskQueue[0];
                doTask(workingTask);
                vector<int>::iterator deleteTask = taskQueue.begin();
                taskQueue.erase(deleteTask);
            }

            numNewTasks = 0;
            for(int i = 0; i < 3; ++i){
                if(tasksMade < totalTasks){
                    int newTask = rand() % 1025 + 1;
                    numNewTasks += 1;
                    taskQueue.push_back(newTask);
                }
            }

            if(rank != 0){
                MPI_Send(&numNewTasks, 1, MPI_INT, 0, 1, );
            }
            else{
                tasksMade += numNewTasks;
            }

            int terminateFlag;
            

        }
    }
    else{
        while(1){
            int flag;
            MPI_Iprobe(MPI_ANY_SOURCE, 0, MCW, &myFlag, &mystatus);
            while(flag){
                MPI_Recv(&task, 1, MPI_INT, MPI_ANY_SOURCE, 0, MCW, &mystatus);
                taskQueue.push_back(task);
                MPI_Iprobe(MPI_ANY_SOURCE, 0, MCW, &myFlag, &mystatus);
            }

            if(taskQueue.size() > 16){
                int sendTo1;
                int sendTo2;
                do{
                    sendTo1 = rand() % 1025 + 1;
                    sendTo2 = rand() % 1025 + 1;
                }while(sendTo1 != rank && sendTo2 != rank);

                int sendingTask1 = taskQueue[(taskQueue.size()-1)];
                taskQueue.pop_back();
                MPI_Send(&sendingTask1, 1, MPI_INT, sendTo1, 0, MCW);

                int sendingTask2 = taskQueue[(taskQueue.size()-1)];
                taskQueue.pop_back();
                MPI_Send(&sendingTask2, 1, MPI_INT, sendTo2, 0, MCW);
            }

            if(taskQueue.size()>0){
                int workingTask = taskQueue[0];
                doTask(workingTask);
                vector<int>::iterator deleteTask = taskQueue.begin();
                taskQueue.erase(deleteTask);
            }
        }
    }

    MPI_Finalize();
    return 0;
}