// JavaScript for interactive features
console.log("Happy 6 months, Cẩm Loan!");

const questions = [
    { question: 'Ai là người yêu Cẩm Loan?', answers: ['Anh Trung', 'Bồ nhí', 'Lê Ân'], correctAnswer: 'Anh Trung' },
    { question: 'Người yêu làm mất cái lắc tay ngiu tặng anh rồi đúng không?', answers: ['Yupp', 'Yes', 'No'], correctAnswer: 'Yes' },
    { question: 'Anh có bao dung với người yêu không?', answers: ['Có', 'Có nhiều', 'Không'], correctAnswer: 'Có nhiều' },
    { question: 'Sở thích lớn nhất của Cẩm Loan là gì?', answers: ['Đọc sách', 'Xem phim', 'Nghe nhạc'], correctAnswer: 'Đọc sách' },
    { question: 'Người yêu có hay bắt nạt anh không?', answers: ['Có', 'Có nhiều', 'Không'], correctAnswer: 'Có nhiều' },
    { question: 'Anh có đối xử tệ bạc với người yêu không?', answers: ['Có', 'Rất không', 'Không'], correctAnswer: 'Rất không' },
    { question: 'Khi anh bị dận người yêu suy nghĩ như nào?', answers: ['Ghét', 'Ghét yêu', 'Trức'], correctAnswer: 'Ghét yêu' },
    { question: 'Món quà đầu tiên anh tặng người yêu là gì?', answers: ['Vòng tay', 'Que kem', 'Kẹo'], correctAnswer: 'Kẹo' },
    { question: 'Anh có gì hấp dẫn?', answers: ['Dễ thương', 'Kem', 'Bồ câu'], correctAnswer: 'Dễ thương' },
    { question: 'Người yêu có yêu anh không?', answers: ['Tất nhiên rồi', 'Yêu nhiều ạ', 'Vô cùng vô cùng'], correctAnswer: 'Vô cùng vô cùng' }
];

let correctAnswers = 0;
let spinCount = 0;

// Generate question buttons dynamically
const questionsContainer = document.getElementById('questions-container');
questions.forEach((q, index) => {
    const questionDiv = document.createElement('div');
    questionDiv.classList.add('question-item');
    questionDiv.innerHTML = `
        <p>${q.question}</p>
        <div class="answer-buttons">
            ${q.answers.map((ans, ansIndex) => `<button class="answer-btn" data-question="${index}" data-answer="${ansIndex}">${ans}</button>`).join('')}
        </div>
    `;
    questionsContainer.appendChild(questionDiv);
});

// Puzzle functionality
const answerBtns = document.querySelectorAll('.answer-btn');
const checkAnswersBtn = document.getElementById('check-answers-btn');
const answerFeedback = document.getElementById('answer-feedback');
const spinWheelBtn = document.getElementById('spin-wheel-btn');
const spinResult = document.getElementById('spin-result');

answerBtns.forEach(btn => {
    btn.addEventListener('click', function() {
        const questionIndex = this.getAttribute('data-question');
        const userAnswerIndex = this.getAttribute('data-answer');
        const correctAnswerIndex = questions[questionIndex].answers.findIndex(ans => ans === questions[questionIndex].correctAnswer);
        if (userAnswerIndex === correctAnswerIndex.toString()) {
            this.disabled = true;
            this.classList.add('correct');
            correctAnswers++;
        } else {
            this.classList.add('incorrect');
        }
    });
});

checkAnswersBtn.addEventListener('click', function() {
    if (correctAnswers >= 7) {
        spinWheelBtn.disabled = false;
        answerFeedback.textContent = `Chính xác ${correctAnswers}/10 câu hỏi! Bây giờ người yêu có thể quay thưởng 3 lần.`;
    } else {
        answerFeedback.textContent = `Người yêu đã trả lời đúng ${correctAnswers}/10 câu hỏi. Phải hoàn thành 7/10 câu hỏi để có thể quay thưởng ạ.`;
    }
});

// Prize spin functionality
const canvas = document.getElementById('wheel');
const ctx = canvas.getContext('2d');
const prizes = ['Trăm nụ hôn', 'Món ăn do anh nấu', 'Kem', 'Cháo bồ câu', '3 nháy', 'Đi homestay', 'Phần quà ngẫu nhiên', 'Shoping quần áo', 'Mukbang anh', '1 thùng mì tôm'];
const colors = ['#FF6347', '#FFD700', '#ADFF2F', '#4B0082', '#00BFFF', '#20B2AA', '#FFA500', '#800000', '#2E8B57', '#8A2BE2'];
const wheelRadius = canvas.width / 2;
let startAngle = 0;
let spinAngle = 0;
let spinTimeout = null;

function drawWheel() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const arc = Math.PI / (prizes.length / 2);
    for (let i = 0; i < prizes.length; i++) {
        const angle = startAngle + i * arc;
        ctx.fillStyle = colors[i % colors.length];
        ctx.beginPath();
        ctx.arc(wheelRadius, wheelRadius, wheelRadius - 20, angle, angle + arc, false);
        ctx.lineTo(wheelRadius, wheelRadius);
        ctx.fill();
        ctx.save();
        ctx.fillStyle = 'white';
        ctx.font = 'bold 14px Arial';
        const text = prizes[i];
        ctx.translate(wheelRadius + Math.cos(angle + arc / 2) * (wheelRadius - 40), wheelRadius + Math.sin(angle + arc / 2) * (wheelRadius - 40));
        ctx.rotate(angle + arc / 2 + Math.PI / prizes.length);
        ctx.fillText(text, -ctx.measureText(text).width / 2, 0);
        ctx.restore();
    }
}

function rotateWheel() {
    spinAngle += Math.random() * 10 + 5;
    spinAngle = spinAngle % 360;
    startAngle += (spinAngle * Math.PI) / 180;
    drawWheel();
    spinTimeout = requestAnimationFrame(rotateWheel);
}

function stopRotateWheel() {
    cancelAnimationFrame(spinTimeout);
    const degrees = (spinAngle % 360) * Math.PI / 180;
    const prizeIndex = Math.floor((degrees + Math.PI / prizes.length) / (2 * Math.PI / prizes.length)) % prizes.length;
    spinResult.textContent = `Chúc mừng! Người yêu đã may mắn trúng ${prizes[prizeIndex]}!`;
}

spinWheelBtn.addEventListener('click', function() {
    if (spinCount < 3) {
        spinAngle = Math.random() * 360 + 360 * 5; // Spin for at least 5 rotations
        rotateWheel();
        setTimeout(stopRotateWheel, 5000);
        spinCount++;
    } else {
        spinWheelBtn.disabled = true;
        answerFeedback.textContent = `Bạn đã quay thưởng 3 lần rồi. Chúc mừng bạn đã hoàn thành phần quà cho Cẩm Loan!`;
    }
});

// Initial draw
drawWheel();
