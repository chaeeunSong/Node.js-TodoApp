// 서버를 띄우기 위한 기본 셋팅 (express 라이브러리)
const express = require('express');
const app = express();
app.use(express.urlencoded({extended: true}))
const MongoClient = require('mongodb').MongoClient;
app.set('view engine', 'ejs');  // ejs 패키지 설치

var db;
// DB 연결

MongoClient.connect('mongodb+srv://admin:qwert12345@cluster0.ktms6.mongodb.net/todoapp?retryWrites=true&w=majority',function(에러,client){
    // 연결되면 할일
    if(에러){return console.log(에러)}  // 에러처리 : mongoDB 관련된 함수들 전부 콜백함수에서 에러처리가능

    db = client.db('todoapp');  // todoapp이라는 db로 연결
    // db.collection('post').insertOne({이름 : 'John', 나이 : 20},function(에러,결과){
    //             // post 라는 db 파일에 insertOne{자료}
    //     console.log('저장완료');
    // });

    // listen(서버띄울 포트번호, 띄운 후 실행할 코드)
    app.listen(8080, function(){
        // 8080 port에 서버 띄워주세요~
        console.log('listening on 8080');
    });
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

// app.post('/add',function(요청,응답){
//     응답.send('전송완료');
//
//     요청.on('end', function(){
//         console.log(요청.body.title)
//         console.log(요청.body.date)
//     })
// });

/***
 * 오늘의 숙제
 * 저번에 만든 폼을 전송하면 데이터 받아와서 DB 저장하기
 *
 * 어떤 사람이 /add 라는 경로로 post 요청을 하면,
 * 데이터 2개(날짜,제목)를 보내주는데,
 * 이 때, 'post'라는 이름을 가진 collection에 두개 데이터를 저장하기
 *
 */

app.post('/add',function(요청,응답){
    응답.send('전송완료');
    console.log(요청.body.title)
    console.log(요청.body.date)
    db.collection('post').insertOne({제목:요청.body.title, 날짜:요청.body.date},function(){
       console.log('저장완료');
    });
});

/**
 * /list로 GET요청으로 접속하면 실제 DB에 저장된 데이터들로 예쁘게 꾸며진 HTML을 보여줌
 * 서버에서 .html 말고 .ejs 파일 보내주는 법
 * */

// 주입식. 외워서쓰는거
app.get('/list',function(요청,응답){
    // 디비에 저장된 post라는 collection 안의 모든 데이터를 꺼내주세요
    db.collection('post').find().toArray(function(에러,결과){   // post 문서의 모든데이터 출력해주세요~ 문법. 외워라
        console.log(결과);
        응답.render('list.ejs',{posts : 결과});
        //꺼낸 데이터 EJS파일에 집어넣기
        // 1. DB에서 자료 찾아주세요
        // 2. 찾은걸 ejs 파일에 집어넣어주세요
    });

})
