// 서버를 띄우기 위한 기본 셋팅 (express 라이브러리)
const express = require('express');
const app = express();
app.use(express.urlencoded({extended: true}))

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

/**
 * 함수 안에 함수 (function(){}) = 콜백함수
 *
 * 구 문법
 * .get('경로',function(요청내용,응답할방법){})
 *
 * ES6신 문법
 * .get('경로',(요청내용,응답할방법)=>{})
 *
 * */

// write.html
app.get('/write', function(요청, 응답){  // 슬러시(/) 하나만 쓰면 홈입니다.
    응답.sendFile(__dirname+ '/write.html');   // .sendFile(보낼파일경로)
});


/**
 * 폼에 입력한 데이터를 서버에 전송하는 법 (POST 요청)
 *
 * 어떤 사람이 /add 경로로 POST 요청을 하면... ??를 해주세요~
 * POST 요청 처리 기계를 만들려면 app.post('경로',콜백함수)
 * app.post('경로',function(){
 *  응답.send('전송완료')
 * });
 *
 * input에 submit 한 정보들은 어디로갔지?
 * app.post('/add',function(요청,응답){
 *                          ^요기있지롱 (근데 쉽게 꺼내쓰려면 라이브러리 필요 body-parser)
 *
 * body-parser는 요청 데이터(body) 해석을 쉽게 도와줌
 * 
 * post 요청으로 서버에 데이터 전송하고 싶으면
 * 1. body-parser 필요
 * 2. form 데이터의 경우 input에 name 쓰기 (서버에서 input을 구분하기위해 name="이름" 쓰는 것)
 * 3. 요청.body 라고 하면 요청했던 form에 적힌 데이터 수신가능
 *
 * */

app.post('/add',function(요청,응답){
    응답.send('전송완료');
    console.log(요청.body.title)
    console.log(요청.body.date)
});