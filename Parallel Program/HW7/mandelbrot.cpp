#include <iostream>
#include <fstream>
#include <chrono>
#include <mpi.h>
#include <unistd.h>
#include <stdlib.h>

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
    v.r = s.r*t.r - s.i*t.i;
    v.i = s.r*t.i + s.i*t.r;
    return v;
}

int rcolor(int iters){
    if(iters == 255) return 0;
    return 32*(iters%8);
}

int gcolor(int iters){
    if(iters == 255) return 0;
    return 32*(iters%4);
}

int bcolor(int iters){
    if(iters == 255) return 0;
    return 32*(iters%2);
}

int mbrot(Complex c, int maxIters){

    int i=0;
    Complex z;
    z=c;
    while(i<maxIters && z.r*z.r + z.i*z.i < 1){
        z = z*z + c;
        i++;
    }
    return i;

}

int main(int argc, char** argv){
    int rank, size;
    int DIM = 512;
    
    MPI_Status mystatus;
    MPI_Init(&argc, &argv);
    MPI_Comm_rank(MCW, &rank);
    MPI_Comm_size(MCW, &size);

    Complex c1,c2,c;
    c1.r = -1;
    c1.i = -1;
    c2.r = 1;
    c2.i = 1;

    int pixel[5];

    int iters;

    if (rank == 0){
        //do stuff
        int dest = 1;
        std::chrono::high_resolution_clock::time_point t1 = std::chrono::high_resolution_clock::now();
        ofstream fout;
        fout.open("testing.ppm");

        int picture[DIM][DIM][3];

        fout << "P3"<<endl;
        fout << DIM << " " << DIM << endl;
        fout << "255" << endl;

        for(int j=0;j<DIM;++j){
            for(int i=0;i<DIM;++i){
                // calculate one pixel of the DIM x DIM image
                pixel[0] = i;
                pixel[1] = j;
                pixel[2] = 0;
                pixel[3] = 0;
                pixel[4] = 0;
                if(dest == size){
                    int myFlag;
                    MPI_Iprobe(MPI_ANY_SOURCE, MPI_ANY_TAG, MCW, &myFlag, &mystatus);
                    while(myFlag){
                        MPI_Recv(pixel, 5, MPI_INT, MPI_ANY_SOURCE, 1, MCW, MPI_STATUS_IGNORE);
                        picture[pixel[1]][pixel[0]][0] = pixel[2];
                        picture[pixel[1]][pixel[0]][1] = pixel[3];
                        picture[pixel[1]][pixel[0]][2] = pixel[4];
                        MPI_Iprobe(MPI_ANY_SOURCE, MPI_ANY_TAG, MCW, &myFlag, &mystatus);
                    }
                    dest = 1;
                }
                MPI_Send(pixel, 5, MPI_INT, dest, 0, MCW);
                dest++;
            }
        }

        pixel[0] = 5000;
        for (int i = 1; i < size; ++i) {
            MPI_Send(pixel, 1, MPI_INT, i, 0, MCW);
        }

        for(int j=0;j<DIM;++j){
            for(int i=0;i<DIM;++i){
                
                fout << picture[j][i][0] <<" ";
                fout << picture[j][i][1] <<" ";
                fout << picture[j][i][2] <<" ";
            }
            fout << endl;
        }
        fout.close();

        std::chrono::high_resolution_clock::time_point t2 = std::chrono::high_resolution_clock::now();
        std::chrono::duration<double> time_span = std::chrono::duration_cast<std::chrono::duration<double>>(t2 - t1);

        cout << "Processing Mandelbrot took " << time_span.count() << "seconds." << endl;
    }
    else{
        while(1){
            MPI_Recv(pixel, 5, MPI_INT, 0, 0, MCW, &mystatus);
            if(pixel[0] == 5000){
                break;
            }
            else{
                c.r = (pixel[0]*(c1.r-c2.r)/DIM)+c2.r;
                c.i = (pixel[1]*(c1.i-c2.i)/DIM)+c2.i;
                iters = mbrot(c,255);
                pixel[2] = rcolor(iters);
                pixel[3] = gcolor(iters);
                pixel[4] = bcolor(iters);
                MPI_Send(pixel, 5, MPI_INT, 0, 1, MCW);
            }
        }
    }

    MPI_Finalize();
    return 0;
}