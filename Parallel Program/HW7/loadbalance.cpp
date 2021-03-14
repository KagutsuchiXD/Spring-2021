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
    int tasksMade = 0;
    int tasksCompleted = 0;
    int rank, size;

    bool processBlack = false;
    bool tokenBlack = false;
    bool hasToken = false;
    bool terminate = false;
    vector<int> taskQueue;

    MPI_Status mystatus;
    MPI_Init(&argc, &argv);
    MPI_Comm_rank(MCW, &rank);
    MPI_Comm_size(MCW, &size);

    srand(time(NULL) + rank);

    std::chrono::high_resolution_clock::time_point t1 = std::chrono::high_resolution_clock::now();

    if(rank == 0){
        hasToken = true;
    }

    int task;

    if(rank%2 == 0){
        totalTasks = rand()%(2048 - 1024) + 1024;
        cout << rank << " will produce " << totalTasks << " tasks." << endl;
        while(1){
            //Check to see if the token was sent to the process
            int tokenFlag;
            MPI_Iprobe(MPI_ANY_SOURCE, 2, MCW, &tokenFlag, &mystatus);
            if(tokenFlag){
                MPI_Recv(&tokenBlack, 1, MPI_C_BOOL, MPI_ANY_SOURCE, 2, MCW, &mystatus);
                hasToken = true;
                if (rank == 0 && tokenBlack == false){
                    terminate = true;
                    for (int i = 1; i < size; ++i){
                        MPI_Send(&terminate, 1, MPI_C_BOOL, i, 3, MCW);
                    }
                }
                else if(rank == 0 && tokenBlack == true){
                    tokenBlack = false;
                }
            }

            //Check to see if the program is ending
            if(rank != 0){
                int terminateFlag;
                MPI_Iprobe(0, 3, MCW, &terminateFlag, &mystatus);
                if(terminateFlag){
                    MPI_Recv(&terminate, 1, MPI_C_BOOL, 0, 3, MCW, &mystatus);
                }
            }
            if(terminate){
                cout << rank << " completed " << tasksCompleted << " tasks." << endl;
                if (rank == 0){
                    std::chrono::high_resolution_clock::time_point t2 = std::chrono::high_resolution_clock::now();
                    std::chrono::duration<double> time_span = std::chrono::duration_cast<std::chrono::duration<double>>(t2 - t1);
                    sleep(1);
                    cout << "Program Completed in " << time_span.count() << "seconds." << endl;
                }
                break;
            }

            //Check to see if tasks have been sent to the process and add them to the queue
            int flag;
            MPI_Iprobe(MPI_ANY_SOURCE, 0, MCW, &flag, &mystatus);
            while(flag){
                MPI_Recv(&task, 1, MPI_INT, MPI_ANY_SOURCE, 0, MCW, &mystatus);
                taskQueue.push_back(task);
                MPI_Iprobe(MPI_ANY_SOURCE, 0, MCW, &flag, &mystatus);
            }

            // Check to see if the process' queue has too many tasks, if so send 2 tasks to random processes.
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

            // Complete a task and remove it from queue
            if(taskQueue.size() > 0){
                int workingTask = taskQueue[0];
                doTask(workingTask);
                tasksCompleted += 1;
                vector<int>::iterator deleteTask = taskQueue.begin();
                taskQueue.erase(deleteTask);
            }

            // If the quota of tasks is not fulfilled then make more tasks and update the number of tasks that have been made.
            for(int i = 0; i < 3; ++i){
                if(tasksMade < totalTasks){
                    int newTask = rand() % 1025 + 1;
                    tasksMade += 1;
                    taskQueue.push_back(newTask);
                }
            }

            //Check to see if queue is empty, if it is and the process has the token make necessary changes and send token to next process.
            if(taskQueue.size() == 0){
                if(hasToken == true){
                    // cout << rank << " has gone idle and will send the token to " << rank+1 << endl;
                    if(processBlack == true && tokenBlack == false){
                        processBlack = false;
                        tokenBlack = true;
                    }
                    int dest;
                    if (rank == size -1){
                        dest = 0;
                    }
                    else{
                        dest = rank + 1;
                    }
                    MPI_Send(&tokenBlack, 1, MPI_C_BOOL, dest, 2, MCW);
                    hasToken = false;
                }
            }
        }
    }
    else{
        while(1){
            //Check to see if the token was sent to the process
            int tokenFlag;
            MPI_Iprobe(MPI_ANY_SOURCE, 2, MCW, &tokenFlag, &mystatus);
            if(tokenFlag){
                MPI_Recv(&tokenBlack, 1, MPI_C_BOOL, MPI_ANY_SOURCE, 2, MCW, &mystatus);
                hasToken = true;
                if (rank == 0 && tokenBlack == false){
                    terminate = true;
                    for (int i = 1; i < size; ++i){
                        MPI_Send(&terminate, 1, MPI_C_BOOL, i, 3, MCW);
                    }
                }
            }

            //Check to see if program is ending
            if(rank != 0){
                int terminateFlag;
                MPI_Iprobe(0, 3, MCW, &terminateFlag, &mystatus);
                if(terminateFlag){
                    MPI_Recv(&terminate, 1, MPI_C_BOOL, 0, 3, MCW, &mystatus);
                }
            }
            if(terminate){
                cout << rank << "Completed " << tasksCompleted << " tasks." << endl;
                break;
            }

            // Check to see if tasks have been sent to this process and then add the tasks to queue.
            int flag;
            MPI_Iprobe(MPI_ANY_SOURCE, 0, MCW, &flag, &mystatus);
            while(flag){
                MPI_Recv(&task, 1, MPI_INT, MPI_ANY_SOURCE, 0, MCW, &mystatus);
                taskQueue.push_back(task);
                MPI_Iprobe(MPI_ANY_SOURCE, 0, MCW, &flag, &mystatus);
            }

            // Check to see if the process' queue has too many tasks, if so send 2 tasks to random processes.
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

            // Complete a task and remove it from queue
            if(taskQueue.size() > 0){
                int workingTask = taskQueue[0];
                doTask(workingTask);
                tasksCompleted += 1;
                vector<int>::iterator deleteTask = taskQueue.begin();
                taskQueue.erase(deleteTask);
            }

            //Check to see if queue is empty, if it is and the process has the token make necessary changes and send token to next process.
            if(taskQueue.size() == 0){
                if(hasToken == true){
                    // cout << rank << " has gone idle and will send the token to " << rank+1 << endl;
                    if(processBlack == true && tokenBlack == false){
                        processBlack = false;
                        tokenBlack = true;
                    }
                    int dest;
                    if (rank == size -1){
                        dest = 0;
                    }
                    else{
                        dest = rank + 1;
                    }
                    MPI_Send(&tokenBlack, 1, MPI_C_BOOL, dest, 2, MCW);
                    hasToken = false;
                }
            }
        }
    }

    MPI_Finalize();
    return 0;
}