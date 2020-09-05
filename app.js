const colors = require("colors/safe");
const sql = require("mysql");
const prompt = require("prompt");
const fs = require("fs");

let config = JSON.parse(fs.readFileSync("./config.json"));

prompt.start();

if (config.fisttimelaunch === true) {
  prompt.get(["host", "port", "user", "password", "database"], function (
    err,
    result
  ) {
    let config = {
      fisttimelaunch: false,
      sql: {
        host: result.host,
        port: result.port,
        user: result.user,
        password: result.password,
        database: result.database,
      },
    };
    fs.writeFileSync("./config.json", JSON.stringify(config));

    if (err) {
      throw err;
    } else {
      if (
        result.host !== "" &&
        result.port !== "" &&
        result.user !== "" &&
        result.database !== ""
      ) {
        var server = sql.createConnection({
          host: result.host,
          port: result.port,
          user: result.user,
          password: result.password,
          database: result.database,
        });

        server.connect((err) => {
          if (err) {
            console.log(`Error! "${err.sqlMessage}"`);
          } else {
            console.log(colors.green(`Successfully connected !`));
            console.log("Please give a SQL command to execute.");
            prompt.get(["query"], (err, result) => {
              if (err) {
                throw err;
              } else {
                server.query(`${result.query}`, (err, result) => {
                  if (err) {
                    console.log(`Error! "${err.sqlMessage}"`);
                  } else {
                    console.log(colors.cyan(`Command result :`));
                    console.log(result);
                  }
                });
              }
            });
          }
        });
      } else {
        console.log(
          colors.red(
            `Error! All fields aren't completed. SQL-Prompter will now exit.`
          )
        );
        process.exit(1);
      }
    }
  });
} else {
  prompt.get(["database"], (err, result) => {
    if (err) {
      throw err;
    } else {
      var server = sql.createConnection({
        host: config.sql.host,
        port: config.sql.port,
        user: config.sql.user,
        user: config.sql.password,
        database: result.database,
      });

      server.connect((err) => {
        if (err) {
          console.log(`Error! "${err.sqlMessage}"`);
        } else {
          console.log(colors.green(`Successfully connected !`));
          console.log("Please give a SQL command to execute.");
          prompt.get(["query"], (err, result) => {
            if (err) {
              throw err;
            } else {
              server.query(`${result.query}`, (err, result) => {
                if (err) {
                  console.log(`Error! "${err.sqlMessage}"`);
                } else {
                  console.log(colors.cyan(`Command result :`));
                  console.log(result);
                  server.end((err) => {
                    if (err) {
                      throw err;
                    } else {
                      console.log(
                        colors.green(
                          `Thanks for using SQL-Prompter! See you later. :-)`
                        )
                      );
                    }
                  });
                }
              });
            }
          });
        }
      });
    }
  });
}
