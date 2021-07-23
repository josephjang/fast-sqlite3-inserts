/*
 * busy loop
 * This code does not really do anything, just runs two for loops. It has no SQL code. The idea was to measure how
much time python spending just to run a for loop, generating data.
 */

function get_random_area_code() {
  return (Math.floor(Math.random() * (1000000 - 100000)) + 100000).toString();
}

function get_random_age() {
  return [5, 10, 15][Math.floor(Math.random() * 3)];
}

function get_random_active() {
  return Math.random() < 0.5 ? 1 : 0;
}

function get_random_bool() {
  return Math.random() < 0.5;
}

function faker(count) {
  const min_batch_size = 100_000_000;
  for (let i = 0; i < count / min_batch_size; i++) {
    const with_area = get_random_bool();
    const current_batch = [];
    for (let j = 0; j < min_batch_size; j++) {
      const age = get_random_age();
      const active = get_random_active();
      if (with_area) {
        const area = get_random_area_code();
        current_batch.push([area, age, active]);
      } else {
        current_batch.push([age, active]);
      }
    }
  }
}

faker(100_000_000);
