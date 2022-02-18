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
// DB에 글 저장하는 코드
// app.post('/add',function(요청,응답){
//     응답.send('전송완료');
//     console.log(요청.body.title)
//     console.log(요청.body.date)
//     db.collection('post').insertOne({제목:요청.body.title, 날짜:요청.body.date},function(){
//        console.log('저장완료');
//     });
// });

/**
 * DB에 글 저장하는 코드에 글번호를 달아서 저장하자
 * (auto increment) DB에 항목 추가할 때마다 자동으로 1 증가시켜서 저장하는 그런거..
 * 현재 총게시물갯수 + 1 이렇게 _id 부여해주면 될까?
 * 저장되는 시점에 따라 혼선유발 가능 : 애초에 유니크한 id를 부여하자
 * _id : 2 라고 영구적으로 지정
 * 발행된 총 게시물 갯수를 기록하는 저장공간 (이 저장공간 DB 테이블을 새로 만들어야한다 = counter 테이블 새로 생성)
 *
 *
 * 해당 소스코드 결과물 해석
 * 사용자가 /add로 post 요청을하면 (폼전송하면)
 * 디비중에 counter라는 이름을가진 파일을 찾아서 DB의 총게시물갯수 데이터 가져오셈
 * 그게 완료되면 _id : 총게시물갯수 + 1 해서 새로운 데이터를 post 콜렉션에 저장해주세요
 *
 * */

/***
 * update함수 사용시 적용해야하는 operator
 * $set (변경)
 * $inc (증가)
 * $min (기존값보다 적을 때만 변경)
 * $rename (key값 이름변경)
 * ... 등 10가지 정도 있음. 필요할때마다 꺼내서 쓰면됨.
 *
 * { $set : { totalPost : 바꿀값 }}
 * { $inc : { totalPost : 기존값에 더해줄 값 }}
 *
 */


// 글번호 달아서 저장하는 코드
app.post('/add',function(요청,응답){
    응답.send('전송완료');
    // 총게시물갯수라는 데이터를 DB에서 꺼내와보자
    // 나는 디비컬렉션의 테이블중 counter라는 테이블을 찾고싶어여 .find(); 는 테이블안의 데이터를 "전부다" 찾으려면 쓰는것이고 특정한것의 하나만 찾으려면 .findOne(); 함수사용
                                    // 쿼리문: counter라는 collection에서 name : '게시물갯수' 인 데이터를 찾아주세요
    db.collection('counter').findOne({name : '게시물갯수'}, function(에러, 결과){
        console.log(결과.totalPost); // 여기서 결과란, findOne으로 가져온 데이터.. 실제로 데이터를 가져왔는지 확인해보자
        var 총게시물갯수 = 결과.totalPost;  // 변수 글자색이 흐릿한 이유 : 선언하고 안쓰면 흐릿해짐. var로 만드는 변수는 재선언 가능, 재할당 가능, 생존범위는 function

        // 데이터베이스에 이 사용자 게시물을 저장해주세요 이 세줄의 코드를 var 총게시물갯수 안으로 이동시켜야 작동
        db.collection('post').insertOne({ _id : 총게시물갯수 + 1, 제목:요청.body.title, 날짜:요청.body.date},function(에러,결과){
            console.log('저장완료');

        // counter라는 콜렉션에 있는 totalPost 라는 항목도 1 증가시켜야함 (수정);
        // 글을 발행해주는 코드 안에 작성하는게 좋음. 콜백함수는 순차적 실행을 위해 쓰기 때문에 문법적으로 맞음.
        db.collection('counter').updateOne({name:'게시물갯수'},{ $inc : {totalPost:1}},function(에러,결과){    // .updateOne(이데이터를, 이렇게 수정해주셈) : DB데이터를 수정해주세요~
                                                                // update류의 함수를 사용할때는 그냥쓰면 안됨. operator를 사용해야함.
            // 콜백함수 순자적으로 실행. 위에 updateOne 함수를 실행시켜주고요 그다음 나를 실행시켜주세요
            if(에러){return console.log(에러)}  // 에러검열 추천
        });

        });
    });
});

/**
 * 코드해석이 익숙하지않다면..
 * 한글로 한 줄씩 적어가면서 코드를 해석하는게 남의 코드 해석하는 가장 좋은방법!
 * */

//
// // 1. 누가 폼에서 /add 로 POST 요청하면 (요청.body에 게시물 데이터 담겨옴)
// app.post('/add',function(요청,응답){
//     응답.send('전송완료');
//     db.collection('counter').findOne({name : '게시물갯수'}, function(에러, 결과){    // 2. DB.counter 내의 총게시물갯수를 찾음
//         console.log(결과.totalPost);
//         var 총게시물갯수 = 결과.totalPost;  // 3. 게시물갯수가 가지고있던것중에 totalPost 값을 변수에 저장. 여기까지가 총게시물갯수를 가지고와주세요~ 의 코드
//
//         db.collection('post').insertOne({ _id : 총게시물갯수 + 1, 제목:요청.body.title, 날짜:요청.body.date},function(){  //4. 이제 DB.post에 새게시물 기록함
//             console.log('저장완료');
//             db.collection('counter').updateOne({name:'게시물갯수'},{ $inc : {totalPost:1}},function(에러,결과){  // 5. 완료되면 DB.counter 내의 총게시물 갯수 +1
//                 if(에러){return console.log(에러)}
//             });
//         });
//     });
// });
//


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

/**
 * 글 목록마다 삭제버튼 만들기
 * ajax로 DELETE 요청 하면, 서버는 /delete 경로로 DELETE 요청 처리하는 코드 작성해놓으면 되겠네
 *
 * db.collection('post').deleteOne({어떤항목을삭제할지넣는곳},function(){})
 *
 * */

// 첫줄해석 : /delete라는 경로로 DELETE요청이 왔을때 콜백함수를 실행시켜주세요
app.delete('/delete',function(요청,응답){
    console.log(요청.body); // 2. 요청시 함께 보낸 데이터를 찾으려면 요로케(게시물 번호)
    요청.body._id = parseInt(요청.body._id);  // 요청.body sodml _id를 숫자로 변환시키자. Object자료 다루기 스킬..

    //  3. 요청.body에 담긴 게시물 번호에 따라 DB에서 게시물 삭제
    db.collection('post').deleteOne(요청.body, function(에러,결과){
        console.log('삭제완료');
        응답.status(200).send({ message: '성공했습니다' }); // 응답코드 200을 보내주세요 그리고 메세지도 보내주셈
    })
});


/**
 * parameter로 요청가능한 URL 백개 만들기
 * /detail 로 접속하면 detail.ejs 보여줌
 *
 * 혼자서 해볼것들
 * 1. 없는 게시물은 어떻게 처리할까?
 * 2. 글목록 페이지에서 글제목 누르면 상세페이지로 이동시키기
 * - list.ejs 에 a태그 추가하여 처리
 * */

// 1. 어떤사람이 detail/i 로 접속하면
app.get('/detail/:id',function(요청,응답){
                                // (url 파라미터 중 :id 라는 뜻) 2. DB에서 {_id : i}인 게시물을 찾음
    db.collection('post').findOne({_id : parseInt(요청.params.id)}, function(에러,결과){
        console.log(결과);
        응답.render('detail.ejs', { data : 결과 });   // 3. 찾은 결과를 detail.ejs 로 보냄
    });
});

/**

 * */