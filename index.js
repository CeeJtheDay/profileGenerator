const fs = require("fs");
const inquirer = require("inquirer");
const axios = require("axios");
const gPS = require("github-personal-stars");
const pdf = require('html-pdf');
const colors = require("./generateHTML.js");


 function makeProfile() {
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
        
        let answerObj = {
          userName: data.userName,
          color: data.color,
        };

        getGitHubInfo(answerObj)

      });
    }

    function getGitHubInfo(answerObj) {
      
      axios.get(`https://api.github.com/users/${answerObj.userName}`)
        .then(res => {
          console.log("------Bio Object======");
          console.log(res);

          const starCount = gPS(answerObj.userName, (err, total) => {
            console.log("------Total User Stars------");
            console.log(err || total);
            console.log(starCount);

            let profileInfo = {
              name: res.data.name,
              company: res.data.company,
              location: res.data.location,
              GitHub: res.data.HTML_url,
              blog: res.data.blog,
              bio: res.data.bio,
              publicRepos: res.data.public_repos,
              followers: res.data.followers,
              following: res.data.following,
              totalStars: total,
              color: answerObj.color,
            };

            writeHtml(profileInfo);

          });
        });


  }

  function writeHtml(profileInfo) {
    const HTML = generateHTML(profileInfo, colors.colors);

    fs.writeFileSync("index.html", HTML, "utf8", (err) => {
      if (err) {
        console.log(err);
      }
      console.log("index.html Written successfully!");
    });

      generatePDF("./resumePDF.pdf");
    
  }


  function generatePDF(htmlFilePath) {

    const html = fs.readFileSync('./index.html', 'utf8');
    const options = { format: 'Letter' };

    pdf.create(html, options).toFile(htmlFilePath, function (err, res) {
      if (err) return console.log(err);
      console.log("HTML successfully converted!");
      console.log("------converted file------");
      console.log(res);
    })
  };

  makeProfile();
  

  function generateHTML(profileInfo, colors) {
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
           background-color: ${colors[profileInfo.color].wrapperBackground};
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
           background-color: ${colors[profileInfo.color].headerBackground};
           color: ${colors[profileInfo.color].headerColor};
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
           border: 6px solid ${colors[profileInfo.color].photoBorderColor};
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
             background-color: ${colors[profileInfo.color].headerBackground};
             color: ${colors[profileInfo.color].headerColor};
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
                      <h2>My name is ${profileInfo.name}!</h2>
                      <h2>${profileInfo.company}</h2>
                      <div class="links-nav">
                          <a class="nav-link" href="https://www.google.com/maps/place/${profileInfo.location}/">
                              <h4>
                                  <i class="fas fa-location-arrow"></i>
                                  ${profileInfo.location}
                              </h4>
                          </a> 
                          <a class="nav-link" href="${profileInfo.GitHub}">
                              <h4>
                                  <i class="fab fa-github-alt"></i>
                                  GitHub
                              </h4>
                          </a> 
                          <a class="nav-link" href="${profileInfo.blog}">
                              <h4>
                                  <i class="fas fa-rss"></i>
                                  Blog
                              </h4>
                          </a>
                      </div>
  
                  </section>
              </div>
                  
                  <div class="col">
                      <h3 style="color:black">
                          ${profileInfo.bio}
                      </h3>
                  </div>
                 
              <section class="container"> 
                <div class="row">
                  <div class="col">
                      <div class="card">
                          <h3>Public Repositories</h3>
                          <h4>${profileInfo.publicRepos}</h4>
                      </div>
                  </div>
                  <div class="col">
                      <div class="card">
                          <h3>Followers</h3>
                          <h4>${profileInfo.followers}</h4>
                      </div>
                  </div>
                </div>
                <div class="row">
                  <div class="col">
                      <div class="card">
                          <h3>GitHub Stars</h3>
                          <h4>${profileInfo.totalStars}</h4>
                      </div>
                  </div>
                  <div class="col">
                      <div class="card">
                          <h3>Following</h3>
                          <h4>${profileInfo.following}</h4>
                      </div>
                  </div>
                </div>
              </section>
            </main>
        </body>`
  };
  

