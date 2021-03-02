#include <iostream>
#include <fstream>

using namespace std;

int main(){
    ofstream fout;
    fout.open("redSquare.ppm");

    int DIM = 500;
    fout << "P3"<<endl;
    fout << DIM << " " << DIM << endl;
    fout << "255" << endl;

    for(int i=0;i<DIM;++i){
        for(int j=0;j<DIM;++j){
            fout<<"255 0 0 ";
        }
        fout << endl;
    }



    fout.close();

    return 0;

}
