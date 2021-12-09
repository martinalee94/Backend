import axios from 'axios';

// const config = {
//     baseUrl: 'http://127.0.0.1:8000/'
// }

function getWebtoonList(){
    return axios.get('/webtoons')
}

export {
    getWebtoonList,
}