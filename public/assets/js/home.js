function show(el) {
  document.getElementById(el).style.display = 'flex';
}
function hide(el) {
  document.getElementById(el).style.display = 'none';
}

$(document).on('submit', '#input-form', function (e) {
  const title = document.getElementById('questionTitle').innerText;
  document.getElementById('single-input-answer').disabled = true;
  document.getElementById('single-input-submit').disabled = true;
  e.preventDefault();

  const answer = document.getElementById('single-input-answer').value;
  $.ajax({
    url: '/answer-input',
    type: 'POST',
    data: { question: title, answer },
    success: function (data) {
      if (data.correct) {
        document
          .getElementById('single-input-answer')
          .classList.add('input-valid');
        document
          .getElementById('single-input-submit')
          .classList.remove('btn-outline-primary');
        document
          .getElementById('single-input-submit')
          .classList.add('btn-outline-success');
      } else {
        show('correct-answer');
        document.getElementById('correct-answer').innerText =
          data.correctAnswer;
        document
          .getElementById('single-input-answer')
          .classList.add('input-invalid');
        document
          .getElementById('single-input-submit')
          .classList.remove('btn-outline-primary');
        document
          .getElementById('single-input-submit')
          .classList.add('btn-outline-danger');
      }

      setTimeout(() => {
        hide('correct-answer');
        if (data.question[0]) {
          renderQuestion(data.question, JSON.stringify(data.questionData));
        } else {
          document.getElementById(
            'score',
          ).innerText = `${data.totalCorrect}/${data.totalQuestions}`;
          show('game-over');
          hide('game-display');
        }
      }, 2000);
    },
    fail: function (data) {
      console.log(data);
    },
  });
});

$(document).on('click', 'button', function () {
  if (this.innerText === 'Submit') return;
  var buttons = document.getElementsByClassName('btn-outline-info');
  for (var i = 0; i < buttons.length; i++) {
    buttons[i].disabled = true;
  }
  const title = document.getElementById('questionTitle').innerText;
  const buttonElement = this;

  $.ajax({
    url: '/answer',
    type: 'POST',
    data: { question: title, answer: this.innerText },
    success: function (data) {
      if (data.correct) {
        buttonElement.classList.remove('btn-outline-info');
        buttonElement.classList.add('btn-outline-success');
      } else {
        buttonElement.classList.remove('btn-outline-info');
        buttonElement.classList.add('btn-outline-danger');
        console.log(data.correctAnswer);
        console.log($(`[data-answer="${data.correctAnswer}"]`));
        $(`[data-answer="${data.correctAnswer}"]`).each(function () {
          this.classList.remove('btn-outline-info');
          this.classList.add('btn-outline-success');
        });
      }
      setTimeout(() => {
        hide('correct-answer');
        if (data.question[0]) {
          renderQuestion(data.question, JSON.stringify(data.questionData));
        } else {
          document.getElementById(
            'score',
          ).innerText = `${data.totalCorrect}/${data.totalQuestions}`;
          show('game-over');
          hide('game-display');
        }
      }, 2000);
    },
    fail: function (data) {
      console.log(data);
    },
  });
});

function renderQuestion(question, questionData) {
  if (!question || !questionData) return;
  const data = JSON.parse(questionData);
  document.getElementById('questionTitle').innerHTML = `<h1>${question}</h1>`;
  document.getElementById('questionImage').src = data.image;

  if (data.type == 'multi') {
    show('multi-input');
    hide('single-input');
    document.getElementById('multi-input').innerHTML = '';

    data.answers.forEach((answer) => {
      var template = document.createElement('template');
      var html = ` <div class="col-lg mb-2 text-center">
        <button
          class="btn btn-outline-info p-3 m-auto"
          style="width: 90%"
          data-answer="${answer.text}"
        >
          ${answer.text}
        </button>
      </div>`;
      template.innerHTML = html.trim();
      document
        .getElementById('multi-input')
        .appendChild(template.content.firstChild);
    });
  } else {
    hide('multi-input');
    show('single-input');
    document.getElementById('single-input-answer').disabled = false;
    document.getElementById('single-input-answer').value = '';
    document
      .getElementById('single-input-answer')
      .classList.remove('input-valid', 'input-invalid');
    document.getElementById('single-input-submit').disabled = false;
    document.getElementById('single-button-holder').innerHTML = `<button
    class="btn btn-outline-primary"
    type="submit"
    id="single-input-submit"
    style="width: 95%"
  >
    Submit
  </button>`;
  }
}

$(document).ready(function () {
  $('#code-input').keyup(function (a) {
    var e = document.getElementById('start-button');
    if (!this.value || this.value == '') {
      e.innerText = 'Create Game';
    } else {
      e.innerText = 'Join Game';
    }
  });
  renderQuestion(question, questionData);
});
