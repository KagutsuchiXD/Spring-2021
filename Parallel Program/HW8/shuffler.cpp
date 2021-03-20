#include <algorithm>
#include <iostream>
#include <random>

int main() {
  int arr[][3] = {{0, 0, 3}, {2, 0, 1}, {4, 1, 0}, {5, 1, 1}};
  std::random_device rd;
  std::mt19937 g(rd());

  std::shuffle(std::begin(arr), std::end(arr), g);

  for(auto &row: arr)
    std::cout << row[0] << ',' << row[1] << '\n';

  return 0;
}