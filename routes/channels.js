const express = require('express');
const router = express.Router();
router.use(express.json());

let db = new Map();
let dbIndex = 1;

//채널 전체 조회, 개별 생성
router
    .route('/')
    .get((req, res) => {
        let { userId } = req.body;
        let channels = [];
        if (db.size && userId) {
            db.forEach((v, k) => {
                if (v.userId === userId) channels.push(v);
            });

            if (channels.length) {
                res.status(200).json(channels);
            } else {
                notFoundChannel(res);
            }

            // res.status(404).json({ message: '로그인이 필요한 페이지 입니다.' });
        } else {
            notFoundChannel(res);
        }
    })
    .post((req, res) => {
        if (req.body.channelTitle) {
            let channel = req.body;
            db.set(dbIndex++, channel);

            res.status(201).json({
                message: `${channel.channelTitle}채널을 응원합니다.`,
            });
        } else {
            res.status(400).json({
                message: '요청 값을 제대로 보내주세요',
            });
        }
    });

//채널 개별 조회, 개별 수정, 개별 삭제
router
    .route('/:id')
    .get((req, res) => {
        let { id } = req.params;
        id = parseInt(id);

        let channel = db.get(id);
        if (channel) {
            res.status(200).json(channel);
        } else {
            notFoundChannel(res);
        }
    })
    .put((req, res) => {
        let { id } = req.params;
        id = parseInt(id);

        let channel = db.get(id);
        let oldTitle = channel.channelTitle;
        if (channel) {
            let newTitle = req.body.channelTitle;

            channel.channelTitle = newTitle;
            db.set(id, channel);

            res.json({ message: `채널명이 정상적으로 수정되었습니다. 기존 ${oldTitle} -> 수정 ${newTitle}` });
        } else {
            notFoundChannel(res);
        }
    })
    .delete((req, res) => {
        let { id } = req.params;
        id = parseInt(id);

        let channel = db.get(id);
        if (channel) {
            db.delete(id);

            res.status(200).json({ message: `${channel.channelTitle}이 정상적으로 삭제되었습니다.` });
        } else {
            notFoundChannel(res);
        }
    });

function notFoundChannel(res) {
    res.status(404).json({ message: '채널 정보를 찾을 수 없습니다.' });
}

module.exports = router;
