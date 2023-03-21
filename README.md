## Need Hosting Services?
Check out [Scorch Hosting](https://scorch.host). Ensuring your services are fast, secure & online when you need them most, committed to bringing you affordable hosting, with excellent performance and reliability. 

# WebQuiz

A quiz I made for school, a simple web server that picks 10 random questions from the provided questions.json file (or all of them if there are less than 10), and asks the user to provide the answer.

The score is totalled and displayed at the end of all the questions. 

Requires:
- Node.JS (tested on v16) & NPM 

To run, simply run `npm run start`

Head to localhost:8080 and the questions will display.

Sessions are used to allow multiple people to complete the quiz separately at the same time, without sharing the score.
