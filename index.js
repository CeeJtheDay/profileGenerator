const fs = require("fs");
const inquirer = require("inquirer");
const axios = require("axios");
const gPS = require("github-personal-stars");
const pdf = require('html-pdf');


const colors = {
  green: {
    wrapperBackground: "#E6E1C3",
    headerBackground: "#C1C72C",
    headerColor: "black",
    photoBorderColor: "#black"
  },
  blue: {
    wrapperBackground: "#5F64D3",
    headerBackground: "#26175A",
    headerColor: "white",
    photoBorderColor: "#73448C"
  },
  pink: {
    wrapperBackground: "#879CDF",
    headerBackground: "#FF8374",
    headerColor: "white",
    photoBorderColor: "#FEE24C"
  },
  red: {
    wrapperBackground: "#DE9967",
    headerBackground: "#870603",
    headerColor: "white",
    photoBorderColor: "white"
  }
};


async function makeProfile() {
  try {
    const answers = await inquirer
      .prompt([
        {
          type: "input",
          name: "userName",
          message: "What is your GitHub username?"
        },
        {
          type: "list",
          message: "What color would you like to use?",
          name: "color",
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
        console.log(data.color);
        return data;
      });
      
    const bioObj = await axios
      .get(`https://api.github.com/users/CeeJtheDay`)
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

    fs.writeFile("index.html", generateHTML(answers, bioObj, starCount, colors), err => {
      if (err) {
        throw err;
      }
      console.log("index.html Written successfully!");
    });

    const html = await fs.readFileSync('./index.html', 'utf8');
    const options = { format: 'Letter' };

    pdf.create(html, options).toFile('./resumePDF', function (err, res) {
      if (err) return console.log(err);
      console.log("HTML successfully converted!");
      console.log("------converted file------");
      console.log(res);
      ret
    })

  } catch (err) {
    console.log(err);
  }
};

makeProfile();

function generateHTML(answers, bioObj, starCount, colors) {
  return `<!DOCTYPE html>
<html lang="en">
   <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta http-equiv="X-UA-Compatible" content="ie=edge" />
      <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.8.1/css/all.css"/>
      <link href="https://fonts.googleapis.com/css?family=BioRhyme|Cabin&display=swap" rel="stylesheet">
      <title>Document</title>
      <style>
          @page {
            margin: 0;
          }
         *,
         *::after,
         *::before {
         box-sizing: border-box;
         }
         html, body {
         padding: 0;
         margin: 0;
         }
         html, body, .wrapper {
         height: 100%;
         }
         .wrapper {
         background-color: ${colors[answers.color].wrapperBackground};
         padding-top: 100px;
         }
         body {
         background-color: white;
         -webkit-print-color-adjust: exact !important;
         font-family: 'Cabin', sans-serif;
         }
         main {
         background-color: #E9EDEE;
         height: auto;
         padding-top: 30px;
         }
         h1, h2, h3, h4, h5, h6 {
         font-family: 'BioRhyme', serif;
         margin: 0;
         }
         h1 {
         font-size: 3em;
         }
         h2 {
         font-size: 2.5em;
         }
         h3 {
         font-size: 2em;
         }
         h4 {
         font-size: 1.5em;
         }
         h5 {
         font-size: 1.3em;
         }
         h6 {
         font-size: 1.2em;
         }
         .photo-header {
         position: relative;
         margin: 0 auto;
         margin-bottom: -50px;
         display: flex;
         justify-content: center;
         flex-wrap: wrap;
         background-color: ${colors[answers.color].headerBackground};
         color: ${colors[answers.color].headerColor};
         padding: 10px;
         width: 95%;
         border-radius: 6px;
         }
         .photo-header img {
         width: 250px;
         height: 250px;
         border-radius: 50%;
         object-fit: cover;
         margin-top: -75px;
         border: 6px solid ${colors[answers.color].photoBorderColor};
         box-shadow: rgba(0, 0, 0, 0.3) 4px 1px 20px 4px;
         }
         .photo-header h1, .photo-header h2 {
         width: 100%;
         text-align: center;
         }
         .photo-header h1 {
         margin-top: 10px;
         }
         .links-nav {
         width: 100%;
         text-align: center;
         padding: 20px 0;
         font-size: 1.1em;
         }
         .nav-link {
         display: inline-block;
         margin: 5px 10px;
         }
         .workExp-date {
         font-style: italic;
         font-size: .7em;
         text-align: right;
         margin-top: 10px;
         }
         .container {
         padding: 50px;
         padding-left: 100px;
         padding-right: 100px;
         }

         .row {
           display: flex;
           flex-wrap: wrap;
           justify-content: space-between;
           margin-top: 20px;
           margin-bottom: 20px;
         }

         .card {
           padding: 20px;
           border-radius: 6px;
           background-color: ${colors[answers.color].headerBackground};
           color: ${colors[answers.color].headerColor};
           margin: 20px;
         }
         
         .col {
         flex: 1;
         text-align: center;
         }

         a, a:hover {
         text-decoration: none;
         color: inherit;
         font-weight: bold;
         }

         @media print { 
          body { 
            zoom: .75; 
          } 
         }
      </style>
      </head>
      <body>
          <main class="container">
            <div class="row photo-header">
                <section class="col">
                    <img alt="GitHub Avatar" src="https://avatars3.githubusercontent.com/u/54916590?v=4">
                    <h1>Hi!</h1>
                    <h2>My name is ${bioObj.name}!</h2>
                    <h2>${bioObj.company}</h2>
                    <div class="links-nav">
                        <a class="nav-link" href="https://www.google.com/maps/place/${bioObj.location}/">
                            <h4>
                                <i class="fas fa-location-arrow"></i>
                                ${bioObj.location}
                            </h4>
                        </a> 
                        <a class="nav-link" href="${bioObj.HTML_url}">
                            <h4>
                                <i class="fab fa-github-alt"></i>
                                GitHub
                            </h4>
                        </a> 
                        <a class="nav-link" href="${bioObj.blog}">
                            <h4>
                                <i class="fas fa-rss"></i>
                                Blog
                            </h4>
                        </a>
                    </div>

                </section>
            </div>
            <section class="container">
                
                <div class="col">
                    <h3 style="color:black">
                        ${bioObj.bio}
                    </h3>
                </div>
                
            </section>
               
            <section class="container"> 
                <div class="col">
                    <div class="card">
                        <h3>Public Repositories</h3>
                        <h4>${bioObj.public_repos}</h4>
                    </div>
                </div>
                <div class="col">
                    <div class="card">
                        <h3>Followers</h3>
                        <h4>${bioObj.followers}</h4>
                    </div>
                </div>
                <div class="col">
                    <div class="card">
                        <h3>GitHub Stars</h3>
                        <h4>${starCount}</h4>
                    </div>
                </div>
                <div class="col">
                    <div class="card">
                        <h3>Following</h3>
                        <h4>${bioObj.following}</h4>
                    </div>
                </div>
            </section>
          </main>
      </body>`
};