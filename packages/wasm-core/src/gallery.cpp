#include <cmath>

extern "C" {
float damp_rotation(float current, float target, float dt) {
  const float lambda = 12.0f;
  const float k = 1.0f - std::exp(-lambda * dt);
  return current + (target - current) * k;
}

float clampf(float x, float min_v, float max_v) {
  if (x < min_v) return min_v;
  if (x > max_v) return max_v;
  return x;
}
}
