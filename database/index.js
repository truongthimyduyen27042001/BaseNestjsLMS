// const mysql = require("mysql");

// const connection = mysql.createConnection({
//   host: "localhost",
//   user: "root",
//   password: "",
//   database: "TestNodejs",
//   port: 3306,
// });

// // connection.query(`Insert into Item(name, quantity, category) values("Chan vay ngan", 2, 1)`, (error, result) => {
// //   console.log('error: ', error)
// //   console.log('data: ', result)
// // })

// //using `${item} to pass params to data`
// //using (?, ?, ?) to pass params to data
// //connect sql without injection
// //mysql parameterized query

// connection.query("select * from Item", (error, result) => {
//   console.log('error: ', error)
//   console.log("data: ", result)
// })

// module.exports = connection

// //Tao thu muc database =>
// //1. connection
// //2. init => file nay tao db / table user
// // => dua tren bai tap buoi truoc

const connection = require("./connection");
connection.query(`drop table Student`);
connection.query(`CREATE TABLE Student (
  id int NOT NULL AUTO_INCREMENT,
  username varchar(255) NOT NULL,
  password varchar(255) NOT NULL,
  salt varchar(255),
  name varchar(255),
  gender boolean,
  age int,
  email varchar(255),
  PRIMARY KEY (id)
)`);

//create some student in table Student;
connection.query(
  `insert into Student(username, password, salt, name, gender, age, email) values(?,?,?,?,?,?,?)`,
  ["duyentruong", "password1", "salt1", "duyen", false, 20, 'duyen@gmail.com']
);
connection.query(
  `insert into Student(username, password, salt, name, gender, age, email) values(?,?,?,?,?,?,?)`,
  ["letuan", "password2", "salt2", "tuan", false, 20, 'duyen@gmail.com']
);
connection.query(
  `insert into Student(username, password, salt, name, gender, age, email) values(?,?,?,?,?,?,?)`,
  ["satran", "password3", "salt3", "sa", false, 20, 'sa@gmail.com']
);
connection.query(
  `insert into Student(username, password, salt, name, gender, age, email) values(?,?,?,?,?,?,?)`,
  ["tamtruong", "password4", "salt4", "tam", false, 20, 'tam@gmail.com']
);

console.log("done");
