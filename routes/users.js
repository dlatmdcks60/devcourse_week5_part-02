const express = require('express');
const router = express.Router();
router.use(express.json());

let db = new Map();
let dbIndex = 1;

// 로그인
router.post('/login', (req, res) => {
    const { userId, password } = req.body;
    let loginUser = {};

    db.forEach((user, id) => {
        if (user.userId === userId) {
            loginUser = user;
        }
    });

    if (isExist(loginUser)) {
        if (loginUser.password === password) {
            res.status(200).json({
                message: `로그인되었습니다.`,
            });
        } else {
            res.status(400).json({
                message: '비밀번호가 올바르지 않습니다.',
            });
        }
    } else {
        res.status(404).json({
            message: '계정이 존재하지 않습니다.',
        });
    }
});

function isExist(obj) {
    if (Object.keys(obj).length) {
        return true;
    } else {
        return false;
    }
}

// 회원 가입
router.post('/join', (req, res) => {
    if (req.body != {}) {
        const { userId } = req.body;
        db.set(userId, req.body);

        res.status(201).json({
            message: `${req.body.name}님 환영합니다.`,
        });
    } else {
        res.status(400).json({
            message: '올바르지 않은 요청입니다.',
        });
    }
});

// 회원 개별 조회, 회원 개별 탈퇴
router
    .route('/users')
    .get((req, res) => {
        let { userId } = req.body;
        const userData = db.get(userId);

        if (userData) {
            res.status(200).json({
                userId: userData.userId,
                name: userData.name,
            });
        } else {
            res.status(404).json({
                message: '회원 정보가 없습니다.',
            });
        }
    })
    .delete((req, res) => {
        let { userId } = req.body;
        const userData = db.get(userId);

        if (userData) {
            db.delete(userId);

            res.status(201).json({
                message: `${userData.name}님 다음에 또 뵙겠습니다.`,
            });
        } else {
            res.status(404).json({
                message: '회원 정보가 없습니다.',
            });
        }
    });

module.exports = router;
