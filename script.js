// DOM要素を取得
const createButton = document.getElementById('create-button');
const canvasContainer = document.getElementById('canvas-container');
const canvas = document.getElementById('shape-canvas');
const regenerateButton = document.getElementById('regenerate-button');
const ideaButton = document.getElementById('idea-button');
const saveButton = document.getElementById('save-button');
const ctx = canvas.getContext('2d');

// 図形の種類リスト
const shapeTypes = ['circle', 'rectangle', 'triangle'];

// 三角構図のランダムな座標を生成
function getRandomTrianglePositions(canvasWidth, canvasHeight) {
    const margin = 50;
    let points;

    while (true) {
        points = [];

        for (let i = 0; i < 3; i++) {
            const x = Math.random() * (canvasWidth - margin * 2) + margin;
            const y = Math.random() * (canvasHeight - margin * 2) + margin;
            points.push({ x, y });
        }

        const d1 = Math.hypot(points[0].x - points[1].x, points[0].y - points[1].y);
        const d2 = Math.hypot(points[1].x - points[2].x, points[1].y - points[2].y);
        const d3 = Math.hypot(points[2].x - points[0].x, points[2].y - points[0].y);

        const maxSide = Math.max(d1, d2, d3);
        const minSide = Math.min(d1, d2, d3);

        if (minSide / maxSide > 0.5) {
            break;
        }
    }

    return points;
}

// 図形を描画する
function drawShape(type, x, y, size, color) {
    ctx.fillStyle = color;
    ctx.strokeStyle = color;
    ctx.lineWidth = 3;

    switch (type) {
        case 'circle':
            ctx.beginPath();
            ctx.arc(x, y, size, 0, Math.PI * 2);
            ctx.fill();
            break;
        case 'rectangle':
            ctx.fillRect(x - size / 2, y - size / 2, size, size);
            break;
        case 'triangle':
            ctx.beginPath();
            ctx.moveTo(x, y - size / 2);
            ctx.lineTo(x + size / 2, y + size / 2);
            ctx.lineTo(x - size / 2, y + size / 2);
            ctx.closePath();
            ctx.fill();
            break;
    }
}

// 三角構図で図形を生成
function generateTriangleCompositionShapes() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const positions = getRandomTrianglePositions(canvas.width, canvas.height);
    const types = ['circle', 'rectangle', 'triangle'];
    const colors = ['#f66', '#6f6', '#66f'];
    const sizes = [
        Math.random() * 20 + 20,
        Math.random() * 20 + 80,
        Math.random() * 20 + 50
    ];
    const shuffled = [0, 1, 2].sort(() => Math.random() - 0.5);

    for (let i = 0; i < 3; i++) {
        drawShape(types[i], positions[i].x, positions[i].y, sizes[shuffled[i]], colors[i]);
    }
}

// 日の丸構図の座標を取得
function getSunCompositionPositions(canvasWidth, canvasHeight) {
    return [
        { x: canvasWidth / 2, y: canvasHeight / 2 }
    ];
}

// 日の丸構図で図形を生成
function generateSunCompositionShapes() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const positions = getSunCompositionPositions(canvas.width, canvas.height);
    const type = shapeTypes[Math.floor(Math.random() * shapeTypes.length)];
    const color = '#f90';
    const size = Math.random() * 50 + 70;

    drawShape(type, positions[0].x, positions[0].y, size, color);
}

// 構図パターンリスト
const compositionMethods = [
    generateTriangleCompositionShapes,
    generateSunCompositionShapes
];

// ランダムに構図を生成
function generateRandomComposition() {
    const randomIndex = Math.floor(Math.random() * compositionMethods.length);
    const method = compositionMethods[randomIndex];
    method();
}

// イベントリスナー
createButton.addEventListener('click', () => {
    canvasContainer.style.display = 'flex';
    generateRandomComposition();
    regenerateButton.style.display = 'block';
    ideaButton.style.display = 'block';
    canvasContainer.scrollIntoView({ behavior: 'smooth' });
});

//再生成時に新しい構図がランダムで描かれる
regenerateButton.addEventListener('click', () => {
    generateRandomComposition();
});

//アイデア提案ボタン
ideaButton.addEventListener('click', () => {
    generateTriangleCompositionShapes();
    alert('この機能は開発中です。図形をもとにしたラフイラストが提案される予定です。');
});

// PNG保存機能（SweetAlert2バージョン）
saveButton.addEventListener('click', () => {
    Swal.fire({
        title: 'PNG（透過済）で保存しますか？',
        icon: 'question',  // アイコンを「？マーク」にする
        showCancelButton: true,  // キャンセルボタンを表示
        confirmButtonText: '保存する',  // OKボタンのラベル
        cancelButtonText: 'やめる',   // キャンセルボタンのラベル
        customClass: {
            popup: 'my-popup',       // ← ポップアップ全体にカスタムを適用
            title: 'my-popup-title'  // ← タイトルにもカスタムを適用
        }
    }).then((result) => {
        if (result.isConfirmed) { // 「保存する」ボタンを押したら
            const imageURL = canvas.toDataURL('image/png');
            const link = document.createElement('a');
            link.href = imageURL;
            link.download = 'shapes.png';
            link.click();
        }
    });
});
