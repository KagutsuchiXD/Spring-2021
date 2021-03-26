#include <iostream>
#include <fstream>
#include <chrono>
#include <mpi.h>
#include <unistd.h>
#include <stdlib.h>
#include <vector>
#include <random>
#include <math.h>
#include <algorithm>

#define MCW MPI_COMM_WORLD

using namespace std;

int calculateDistance(int pt1[], int pt2[]){
    int x1 = pt1[1];
    int x2 = pt2[1];
    int y1 = pt1[2];
    int y2 = pt2[2];

    return sqrt(pow(x2 - x1, 2) + 
                pow(y2 - y1, 2) * 1.0);
}

int calculatePathLength(int path[100][3]){
    int distance = 0;
    for (int i = 0; i < 100; i += 2){
        distance += calculateDistance(path[i], path[i+1]);
    }
    return distance;
}

int main(int argc, char** argv){
    int rank, size;
    bool terminate = false;
    int result;

    int cities[100][3] = 
        {{1,   179140,   750703}, {2,   78270,   737081},
        {3,   577860,   689926}, {4,   628150,   597095},
        {5,   954030,   510314}, {6,   837880,   811285},
        {7,   410640,   846947}, {8,   287850,   600161},
        {9,   270030,   494359}, {10,  559020,   199445},
        {11,  353930,   542989}, {12,  515920,   497472},
        {13,  648080,   470280}, {14,  594550,   968799},
        {15,  386690,   907669}, {16,   93070,   395385}, 
        {17,   93620,   313966}, {18,  426870,    39662}, 
        {19,  437000,   139949}, {20,  789810,   488001},
        {21,  749130,   575522}, {22,  481030,   286118},
        {23,  670720,   392925}, {24,  273890,   892877},
        {25,  138430,   562658}, {26,   85480,   465869},
        {27,  775340,   220065}, {28,  862980,   312238},
        {29,  155180,   263662}, {30,  274070,    74689},
        {31,  333340,   456245}, {32,  822150,   399803},
        {33,  158880,   612518}, {34,  815560,   707417},
        {35,  678240,   709341}, {36,  394470,   679221},
        {37,  631300,   846813}, {38,  528320,   824193},
        {39,  666940,   845130}, {40,  298650,   816352},
        {41,  243750,   745443}, {42,  220500,   654221},
        {43,  338920,   381007}, {44,  313110,   201386},
        {45,  856380,   564703}, {46,  549250,   565255},
        {47,  537400,   604425}, {48,  502110,   435463},
        {49,  498840,   590729}, {50,  482310,   571034},
        {51,  416930,   765126}, {52,  418400,   638700},
        {53,  374170,   695851}, {54,  412370,   570904},
        {55,  301090,   737412}, {56,  235690,   782470},
        {57,  475940,   439645}, {58,  268540,   609753},
        {59,  130500,   712663}, {60,   81660,   732470},
        {61,   64520,   711936}, {62,  264690,   529248},
        {63,   90230,   612484}, {64,   38370,   610277},
        {65,   15430,   579032}, {66,  138890,   482432},
        {67,  264580,   421188}, {68,   86690,   394738},
        {69,  209190,   347661}, {70,  425890,   376154},
        {71,  312480,   177450}, {72,  373360,   142350},
        {73,  442850,   106198}, {74,  505100,   189757},
        {75,  542610,   224170}, {76,  566730,   262940},
        {77,  615970,   237922}, {78,  612120,   303181},
        {79,  634410,   320152}, {80,  879480,   239867},
        {81,  868760,   286928}, {82,  807670,   334613},
        {83,  943060,   368070}, {84,  827280,   387076},
        {85,  896040,   413699}, {86,  920900,   454842},
        {87,  746380,   440559}, {88,  734300,   452247},
        {89,  730780,   471211}, {90,  870570,   549620},
        {91,  607060,   453077}, {92,  926580,   669624},
        {93,  812660,   614479}, {94,  701420,   559132},
        {95,  688600,   580646}, {96,  743800,   669521},
        {97,  819700,   857004}, {98,  683690,   682649},
        {99,  732680,   857362}, {100, 685760,   866857}};


    MPI_Status myStatus;
    MPI_Init(&argc, &argv);
    MPI_Comm_rank(MCW, &rank);
    MPI_Comm_size(MCW, &size);

    srand(time(NULL) + rank);

    if (rank == 0){
        std::chrono::high_resolution_clock::time_point t1 = std::chrono::high_resolution_clock::now();
        ofstream fout;
        fout.open("results.txt");
        int original = calculatePathLength(cities);
        double time;
        int bestResult = 2147483647;
        double bestTime;
        while(1){
            int terminateFlag;
            MPI_Iprobe(MPI_ANY_SOURCE, 0, MCW, &terminateFlag, &myStatus);
            if(terminateFlag){
                MPI_Recv(&terminate, 1, MPI_C_BOOL, MPI_ANY_SOURCE, 0, MCW, &myStatus);
            }
            if(terminate){
                fout.close();
                cout << "The original path length was " << original << endl;
                cout << "The shortest distance found was " << bestResult << " found in " << bestTime << " seconds." << endl; 
                break;
            }
            
            int resultFlag;
            MPI_Iprobe(MPI_ANY_SOURCE, 1, MCW, &resultFlag, &myStatus);
            while(resultFlag){
                MPI_Recv(&result, 1, MPI_INT, MPI_ANY_SOURCE, 1, MCW, MPI_STATUS_IGNORE);
                std::chrono::high_resolution_clock::time_point t2 = std::chrono::high_resolution_clock::now();
                std::chrono::duration<double> time_span = std::chrono::duration_cast<std::chrono::duration<double>>(t2 - t1);
                time = time_span.count();
                if(result < bestResult){
                    bestResult = result;
                    bestTime = time;
                }
                fout << result << " found in " << time << " seconds." << endl;
                MPI_Iprobe(MPI_ANY_SOURCE, 1, MCW, &resultFlag, &myStatus);
            }
        }
    }
    else{
        int iterations = 1000;
        int parents[2][100][3];
        int parent[100][3];
        for (int j = 0; j < 100; ++j){
            for (int k = 0; k < 3; ++k){
                parent[j][k] = cities[j][k];
                parents[0][j][k] = cities[j][k];
            }
        }
        random_shuffle(begin(parent), end(parent));
        for (int j = 0; j < 100; ++j){
            for (int k = 0; k < 3; ++k){
                parents[1][j][k] = parent[j][k];
            }
        }
        while(iterations > 0){
            int childA[100][3];
            int childB[100][3];
            for (int i = 0; i < 100; ++i){
                for(int j = 0; j < 3; ++j){
                    childA[i][j] = parents[0][i][j];
                    childB[i][j] = parents[1][i][j];
                }
            }
            int index = rand() % 50;
            for (int i = index; i < index + 50; ++i){
                int indexA = parents[0][i][0];
                int indexB = parents[1][i][0];
                swap(childA[indexA - 1], childA[indexB -1]);
                swap(childB[indexA - 1], childB[indexB -1]);
            }
            
            int parentADistance = calculatePathLength(parents[0]);
            int parentBDistance = calculatePathLength(parents[1]);
            int childADistance = calculatePathLength(childA);
            int childBDistance = calculatePathLength(childB);

            if (childADistance <= childBDistance){
                if(childADistance <= parentADistance || childADistance <= parentBDistance){
                    if(parentADistance <= parentBDistance && childADistance <= parentBDistance){
                        for (int i = 0; i < 100; ++i){
                            for(int j = 0; j < 3; ++j){
                                parents[1][i][j] = childA[i][j];
                            }
                        }
                        if(childADistance < parentADistance){
                            MPI_Send(&childADistance, 1, MPI_INT, 0, 1, MCW);
                        }
                        else{
                            MPI_Send(&parentADistance, 1, MPI_INT, 0, 1, MCW);
                        }
                    }
                    else if(parentBDistance <= parentADistance && childADistance <= parentADistance){
                        for (int i = 0; i < 100; ++i){
                            for(int j = 0; j < 3; ++j){
                                parents[0][i][j] = childA[i][j];
                            }
                        }
                        if(childADistance < parentBDistance){
                            MPI_Send(&childADistance, 1, MPI_INT, 0, 1, MCW);
                        }
                        else{
                            MPI_Send(&parentBDistance, 1, MPI_INT, 0, 1, MCW);
                        }
                    }
                }
                else{
                    if(parentADistance < parentBDistance){
                        MPI_Send(&parentADistance, 1, MPI_INT, 0, 1, MCW);
                    }
                    else{
                        MPI_Send(&parentBDistance, 1, MPI_INT, 0, 1, MCW);
                    }
                }
            }
            else{
                if(childBDistance <= parentADistance || childBDistance <= parentBDistance){
                    if(parentADistance <= parentBDistance && childBDistance <= parentBDistance){
                        for (int i = 0; i < 100; ++i){
                            for(int j = 0; j < 3; ++j){
                                parents[1][i][j] = childB[i][j];
                            }
                        }
                        if(childBDistance < parentADistance){
                            MPI_Send(&childBDistance, 1, MPI_INT, 0, 1, MCW);
                        }
                        else{
                            MPI_Send(&parentADistance, 1, MPI_INT, 0, 1, MCW);
                        }
                    }
                    else if(parentBDistance <= parentADistance && childBDistance <= parentADistance){
                        for (int i = 0; i < 100; ++i){
                            for(int j = 0; j < 3; ++j){
                                parents[0][i][j] = childB[i][j];
                            }
                        }
                        if(childBDistance < parentBDistance){
                            MPI_Send(&childBDistance, 1, MPI_INT, 0, 1, MCW);
                        }
                        else{
                            MPI_Send(&parentBDistance, 1, MPI_INT, 0, 1, MCW);
                        }
                    }
                }
                else{
                    if(parentADistance < parentBDistance){
                        MPI_Send(&parentADistance, 1, MPI_INT, 0, 1, MCW);
                    }
                    else{
                        MPI_Send(&parentBDistance, 1, MPI_INT, 0, 1, MCW);
                    }
                }
            }
            iterations -= 1;
                if(iterations <= 0){
                    terminate = true;
                    sleep(3);
                    if(rank == 1){
                        MPI_Send(&terminate, 1, MPI_C_BOOL, 0, 0, MCW);
                    }
                }
        }
    }

    MPI_Finalize();
    return 0;
}