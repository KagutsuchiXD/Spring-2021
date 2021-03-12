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
    while(i<maxIters && z.r*z.r + z.i*z.i < 2){
        z = z*z + c;
        i++;
    }
    return i;

}

int main(int argc, char** argv){
    int rank, size;
    
    MPI_Status mystatus;
    MPI_Init(&argc, &argv);
    MPI_Comm_rank(MCW, &rank);
    MPI_Comm_size(MCW, &size);

    Complex c1,c2,c;
    c1.r = -1;
    c1.i = -1;
    c2.r = 1;
    c2.i = 1;

    int rgb[3];

    int iters;

    if (rank == 0){
        //do stuff
        int dest = 1;
        std::chrono::high_resolution_clock::time_point t1 = std::chrono::high_resolution_clock::now();
        ofstream fout;
        fout.open("testing3.ppm");

        int DIM = 512;
        fout << "P3"<<endl;
        fout << DIM << " " << DIM << endl;
        fout << "255" << endl;

        for(int j=0;j<DIM;++j){
            for(int i=0;i<DIM;++i){
                // calculate one pixel of the DIM x DIM image
                c.r = (i*(c1.r-c2.r)/DIM)+c2.r;
                c.i = (j*(c1.i-c2.i)/DIM)+c2.i;
                iters = mbrot(c,255);
                if(dest == size){
                    dest = 1;
                }
                MPI_Send(&iters, 1, MPI_INT, dest, 0, MCW);
                dest++;
                MPI_Recv(rgb, 3, MPI_INT, MPI_ANY_SOURCE, 1, MCW, &mystatus);
                fout << rgb[0] <<" ";
                fout << rgb[1] <<" ";
                fout << rgb[2] <<" ";
            }
            fout << endl;
        }
        fout.close();
        iters = 512;
        for (int i = 1; i < size; ++i) {
            MPI_Send(&iters, 1, MPI_INT, i, 0, MCW);
        }
        std::chrono::high_resolution_clock::time_point t2 = std::chrono::high_resolution_clock::now();
        std::chrono::duration<double> time_span = std::chrono::duration_cast<std::chrono::duration<double>>(t2 - t1);

        cout << "Processing Mandelbrot took " << time_span.count() << "seconds." << endl;


    }
    else{
        while(1){
            MPI_Recv(&iters, 1, MPI_INT, 0, 0, MCW, &mystatus);
            if(iters == 512){
                break;
            }
            else{
                rgb[0] = rcolor(iters);
                rgb[1] = gcolor(iters);
                rgb[2] = bcolor(iters);
                MPI_Send(rgb, 3, MPI_INT, 0, 1, MCW);
            }
        }
    }

    MPI_Finalize();
    return 0;
}