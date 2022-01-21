// 서버를 띄우기 위한 기본 셋팅 (express 라이브러리)
const express = require('express');
const app = express();

    // listen(서버띄울 포트번호, 띄운 후 실행할 코드)
app.listen(8080, function(){
        // 8080 port에 서버 띄워주세요~
    console.log('listening on 8080');
});

/**
 * /pet/home 으로 (GET 요청)방문하면 펫 상품을 보여줌
 * 
 * 누군가가 /pet 으로 방문을 하면...
 * pet 관련된 안내문을 띄워주자 (이해하지말고 그냥 외워야편함)
 **/ 

app.get('/pet',function(요청, 응답){
    응답.send('펫용품 쇼핑할 수 있는 페이지 입니다.');
});

app.get('/beauty', function(요청, 응답){
    응답.send('뷰티용품 쇼핑 페이지임');
});

// HTML 보내주는 방법
app.get('/', function(요청, 응답){  // 슬러시(/) 하나만 쓰면 홈입니다.
    응답.sendFile(__dirname+ '/index.html');   // .sendFile(보낼파일경로)
});