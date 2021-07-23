const sqlite3 = require('sqlite3').verbose();

const dbName = 'basic_batched_node.db';

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

function create_table(db) {
  db.run(`
        create table IF NOT EXISTS user
        (
            id INTEGER not null primary key,
            area CHAR(6),
            age INTEGER not null,
            active INTEGER not null
        )
    `, (err) => {
    if (err) {
      console.log(err);
    }
  });
}

function faker(db, count) {
  const min_batch_size = 1_000_000;
  for (let i = 0; i < count / min_batch_size; i++) {
    console.log(`batch #${i}`);
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
    console.log(`batch #${i}: serializing`);
    db.run('BEGIN');
    const insert3 = db.prepare('INSERT INTO user VALUES (NULL,?,?,?)');
    const insert2 = db.prepare('INSERT INTO user VALUES (NULL,NULL,?,?)');
    for (let j = 0; j < min_batch_size; j++) {
      if (with_area) {
        insert3.run(current_batch[j]);
      } else {
        insert2.run(current_batch[j]);
      }
    }
    insert3.finalize();
    insert2.finalize();
    db.run('COMMIT');
  }
}

const db = new sqlite3.Database(dbName);
console.log('opened database');
/*
db.run('PRAGMA journal_mode = OFF;');
db.run('PRAGMA synchronous = 0;');
db.run('PRAGMA cache_size = 1000000;');
db.run('PRAGMA locking_mode = EXCLUSIVE;');
db.run('PRAGMA temp_store = MEMORY;');
*/
db.serialize(() => {
  create_table(db);
  faker(db, 100_000_000);
});
console.log('closing database');
db.close();
