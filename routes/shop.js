// npm으로 설치했던 express 라이프버리의 Router() 라는 함수를 쓰겠습니다.
var router = require('express').Router();

router.get('/shirts',function(요청,응답){
    응답.send('셔츠 파는 페이지입니다.');
});

router.get('/pants', function(요청,응답){
    응답.send('바지 파는 페이지입니다.');
});

// module.exports = 내보낼 변수명
// require('파일경로')
module.exports = router;
