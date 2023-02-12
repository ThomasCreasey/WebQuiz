import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import bodyParser from 'body-parser';
import fs from 'fs';
import session from 'express-session';

dotenv.config();

const app: Express = express();
app.use(
  session({
    secret: 'hfhdsf7y48783uhn%$£%$£%£',
    resave: false,
    saveUninitialized: false,
  }),
);

app.use(bodyParser.urlencoded({ extended: true }));
const port = 8080;

app.set('view engine', 'ejs');

app.use('/css', express.static('public/assets/css'));
app.use('/js', express.static('public/assets/js'));
app.use('/img', express.static('public/assets/img'));
app.set('views', path.join(__dirname, '../public/templates'));

type Answer = {
  text: string;
  correct: boolean;
};

declare module 'express-session' {
  interface SessionData {
    questions: string[];
    correct: number;
    totalQuestions: number;
  }
}

app.get('/', (req: Request, res: Response) => {
  req.session.questions = Object.keys(
    JSON.parse(fs.readFileSync('questions.json', 'utf8')),
  )
    .slice(0, 10)
    .sort(() => 0.5 - Math.random());
  req.session.correct = 0;
  req.session.totalQuestions = 0;

  const questions = req.session.questions;

  const question = questions.splice(0, 1);
  const questionData = JSON.parse(fs.readFileSync('questions.json', 'utf8'))[
    question[0]
  ];

  res.render('index.ejs', { question, questionData });
});

app.post('/answer-input', (req: Request, res: Response) => {
  const answers = JSON.parse(fs.readFileSync('questions.json', 'utf8'))[
    req.body.question
  ].answers;
  const isCorrect = answers.includes(req.body.answer.toLowerCase());
  if (!req.session.questions) return;
  req.session.totalQuestions = req.session.totalQuestions
    ? req.session.totalQuestions + 1
    : 1;

  const question = req.session.questions.splice(0, 1);
  const questionData = JSON.parse(fs.readFileSync('questions.json', 'utf8'))[
    question[0]
  ];

  if (isCorrect)
    req.session.correct = req.session.correct ? req.session.correct + 1 : 1;

  res.send({
    correct: isCorrect,
    question,
    correctAnswer: answers.join(', '),
    questionData,
    totalQuestions: req.session.totalQuestions,
    totalCorrect: req.session.correct,
  });
});

app.post('/answer', (req: Request, res: Response) => {
  if (!req.session.questions) return;
  const answers = JSON.parse(fs.readFileSync('questions.json', 'utf8'))[
    req.body.question
  ].answers;

  const answer = answers.filter((q: Answer) => {
    return q.text === req.body.answer;
  })[0];

  const isCorrect = answer ? answer.correct : false;

  req.session.totalQuestions = req.session.totalQuestions
    ? req.session.totalQuestions + 1
    : 1;
  const question = req.session.questions.splice(0, 1);
  const questionData = JSON.parse(fs.readFileSync('questions.json', 'utf8'))[
    question[0]
  ];

  if (isCorrect)
    req.session.correct = req.session.correct ? req.session.correct + 1 : 1;

  res.send({
    correct: isCorrect,
    correctAnswer: answers.filter((q: Answer) => q.correct)[0].text,
    question,
    questionData,
    totalQuestions: req.session.totalQuestions,
    totalCorrect: req.session.correct,
  });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
