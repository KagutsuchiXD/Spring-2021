#include <iostream>
#include <fstream>

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
    return 32*(iters%8);
}

int bcolor(int iters){
    if(iters == 255) return 0;
    return 32*(iters%8);
}

int mbrot(Complex c, int maxIters){

    int i=0;
    Complex z;
    z=c;
    while(i<maxIters && z.r*z.r + z.i*z.i < 4){
        z = z*z + c;
        i++;
    }
    return i;

}


int main(){
    ofstream fout;
    fout.open("mb1.ppm");

    Complex c1,c2,c;
    c1.r = -1;
    c1.i = -1;
    c2.r = 1;
    c2.i = 1;

    int DIM = 2000;
    fout << "P3"<<endl;
    fout << DIM << " " << DIM << endl;
    fout << "255" << endl;

    for(int j=0;j<DIM;++j){
        for(int i=0;i<DIM;++i){
            // calculate one pixel of the DIM x DIM image
            c.r = (i*(c1.r-c2.r)/DIM)+c2.r;
            c.i = (j*(c1.i-c2.i)/DIM)+c2.i;
            int iters = mbrot(c,255);
            fout << rcolor(iters)<<" ";
            fout << gcolor(iters)<<" ";
            fout << bcolor(iters)<<" ";
        }
        fout << endl;
    }


    fout.close();

    return 0;

}
