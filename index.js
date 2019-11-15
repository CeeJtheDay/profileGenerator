//const fs = require("fs");
const inquirer = require("inquirer");
const axios = require("axios");


inquirer
  .prompt([
    {
      type: "input",
      name: "userName",
      message: "What is your GitHub username?"
    },
    {
      type: "list",
      message: "What color would you like to use?",
      name: "colorChoice",
      choices: [
        "green",
        "blue",
        "pink",
        "red"
      ]
    }
])
.then(function(res) {
        console.log("------------\n");
        console.log(res.userName);
        console.log("------------\n");
        console.log(res.colorChoice);


    });
