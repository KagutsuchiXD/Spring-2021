#include <algorithm>
#include <iostream>
#include <random>
#include <chrono>
#include <mpi.h>
#include <unistd.h>
#include <stdlib.h>
#include <vector>
#include <math.h>
#include <algorithm>

using namespace std;

int main() {
  int arr[4][3] = {{0, 0, 3}, {2, 0, 1}, {4, 1, 0}, {5, 1, 1}};
  int copy1[4][3];
  int copy2[4][3];
  for (int i = 0; i < 4; ++i){
    for(int j = 0; j < 3; ++j){
      copy1[i][j] = arr[i][j];
      copy2[i][j] = arr[i][j];
    }
  }

  std::random_shuffle(std::begin(copy1), std::end(copy1));
  std::random_shuffle(std::begin(copy2), std::end(copy2));

  for(int i = 0; i < 4; ++i){
    std::cout << i << std::endl;
    std::cout << arr[i][0] << ',' << arr[i][1] << ',' << arr[i][2]<< '\n';
    std::cout << copy1[i][0] << ',' << copy1[i][1] << ',' << copy1[i][2]<< '\n';
    std::cout << copy2[i][0] << ',' << copy2[i][1] << ',' << copy2[i][2]<< '\n';
  }

  std::swap(arr[1], arr[3]);
  for(int i = 0; i < 4; ++i){
    std::cout << i << std::endl;
    std::cout << arr[i][0] << ',' << arr[i][1] << ',' << arr[i][2]<< '\n';
    }

  
  return 0;
}