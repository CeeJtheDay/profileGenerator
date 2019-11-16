//const fs = require("fs");
const inquirer = require("inquirer");
const axios = require("axios");
const generateHTML = require("./generateHTML.js");
const gPS = require("github-personal-stars");
const pdf = require('html-pdf');


async function makeProfile() {
  try {
    const answers = inquirer
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
      .then(function (data) {
        console.log("------Git Hub User Name------\n");
        console.log(data.userName);
        console.log("------Use Color Choice------\n");
        console.log(data.colorChoice);
        return data;
      });

      const bioObj = await axios
      .get(`https://api.github.com/users/${answers.username}`)
      .then(res => {
        console.log("------Bio Object======");
        console.log(res);
        return res;
      });

      const starCount = await gPS(answers.userName, (err, total) => {
        console.log("------Total User Stars------");
        console.log(err || total);
        return total;
      });

      fs.writeFile("index.html", generateHTML(answers, bioObj, starCount), err => {
        if (err) {
          throw err;
        } 
        console.log("index.html Written successfully!");
      });

      const html = await fs.readFileSync('./index.html', 'utf8');
      const options = { format: 'Letter' };

      pdf.create(html, options).toFile('./resumePDF', function(err, res) {
        if (err) return console.log(err);
        console.log{"HTML successfully converted!"};
        console.log("------converted file------");
        console.log(res);
        ret
      });

});
