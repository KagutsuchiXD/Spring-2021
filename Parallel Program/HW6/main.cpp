#include <iostream>
#include <fstream>
#include <chrono>
#include <mpi.h>
#include <vector>
#include <string>

#define MCW MPI_COMM_WORLD

using namespace std;

struct Complex {
    double r;
    double i;
};

Complex operator + (Complex s, Complex t){
    Complex v;

    v.r = s.r + t.r;
    v.i = s.i + t.i;

    return v;
}

Complex operator * (Complex s, Complex t){
    Complex v;

    v.r = s.r * t.r - s.i * t.i;
    v.i = s.r * t.i + s.i * t.r;

    return v;
}

int rcolor(int iters){
    if(iters == 255) return 0;
    return 32 * (iters % 8);
}

int gcolor(int iters){
    if(iters == 255) return 0;
    return 32 * (iters % 8);
}

int bcolor(int iters){
    if(iters == 255) return 0;
    return 32 * (iters % 8);
}

int mbrot(Complex c, int maxIters){
    int i = 0;
    Complex z;
    z = c;

    while(i < maxIters && z.r * z.r + z.i * z.i < 4){
        z = z * z + c;
        i++;
    }

    return i;
}


int main(int argc, char **argv){
    int counter = 0;
    int rank, size;
    int DIM = 100;
    vector<vector<string>> data;
    int pixelArray[5] = {0, 0, 0, 0, 0};
//    int data;
    MPI_Status myStatus;
    MPI_Request request;
    MPI_Init(&argc, &argv);
    MPI_Comm_rank(MCW, &rank);
    MPI_Comm_size(MCW, &size);

    Complex c1, c2, c;

    c1.r = -1;
    c1.i = -1;
    c2.r = 1;
    c2.i = 1;


//    std::chrono::high_resolution_clock::time_point t1 = std::chrono::high_resolution_clock::now();

    if(rank == 0){
        for(int j = 0; j < DIM; ++j){
            vector<string> temp;
            for(int i = 0; i < DIM; ++i){
                // initialize the array
                temp.emplace_back("");
            }
            data.push_back(temp);
        }

        cout << "sending pixels" << endl;
        for(int i = 0; i < DIM; i++){
            for(int j = 0; j < DIM; j++) {
                pixelArray[0] = i;
                pixelArray[1] = j;
                MPI_Send(pixelArray, 5, MPI_INT, j%size, 0, MCW);
            }
        }

        cout << "receiving pixels" << endl;
        int myFlag;
        MPI_Iprobe(MPI_ANY_SOURCE, MPI_ANY_TAG, MCW, &myFlag, &myStatus);
        while(myFlag){
            MPI_Recv(pixelArray, 5, MPI_INT, MPI_ANY_SOURCE, 1, MCW, MPI_STATUS_IGNORE);
            data[pixelArray[0]][pixelArray[1]] = to_string(pixelArray[2]) + " "
                    + to_string(pixelArray[3]) + " "
                    + to_string(pixelArray[4]) + " ";
        }

        cout << "opening file" << endl;
        ofstream fout;
        fout.open("red.ppm");

        if(fout.is_open()) {
            cout << "printing header" << endl;
            fout << "P3" << endl;
            fout << DIM << " " << DIM << endl;
            fout << "255" << endl;

            cout << "putting pixels in file" << endl;
            for (int i = 0; i < DIM; i++) {
                for (int j = 0; j < DIM; j++) {
                    fout << data[i][j];
                }
            }
        }
        fout.close();

        pixelArray[0] = -1;

        cout << "sending kill signal" << endl;
        for(int i = 1; i < size; i++){
            MPI_Send(pixelArray, 5, MPI_INT, i, 0, MCW);
        }
    }else{
        while(1) {
            MPI_Recv(pixelArray, 5, MPI_INT, MPI_ANY_SOURCE, 0, MCW, MPI_STATUS_IGNORE);
            if (pixelArray[0] == -1) {
                cout << "exiting" << endl;
                break;
            }
            c.r = (pixelArray[0] * (c1.r - c2.r) / DIM) + c2.r;
            c.i = (pixelArray[0] * (c1.i - c2.i) / DIM) + c2.i;

            int iters = mbrot(c, 255);

            pixelArray[2] = rcolor(iters);
            pixelArray[3] = gcolor(iters);
            pixelArray[4] = bcolor(iters);
            MPI_Isend(pixelArray, 5, MPI_INT, 0, 1, MCW, &request);
        }
    }

    MPI_Finalize();

    return 0;
}
