const AWS = require('aws-sdk');
const dynamoDB = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
    const requestBody = JSON.parse(event.body);

    console.log(requestBody.id);
    console.log(requestBody.password);

    const params = {
        TableName: 'pjLastTable',
        Key: {
            'id': requestBody.id
        }
    };

    try {
        const data = await dynamoDB.get(params).promise();

        let statusCode, responseBody;

        if (data.Item) {
            if (data.Item.password === requestBody.password) {
                console.log("로그인 성공");
                statusCode = 200;
                responseBody = '로그인 성공';
            } else {
                console.log("비밀번호 불일치");
                statusCode = 301;
                responseBody = '비밀번호 불일치';
            }
        } else {
            console.log('데이터가 존재하지 않습니다.');
            statusCode = 302;
            responseBody = '존재하지 않는 회원';
        }

        return {
            statusCode,
            body: JSON.stringify(responseBody),
        };
        
    } catch (error) {
        console.error('조회 중 오류 발생:', error);
        return {
            statusCode: 500,
            body: JSON.stringify('조회 중 오류가 발생했습니다.'),
        };
    }
};