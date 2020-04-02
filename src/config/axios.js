import axios from 'axios';
import Vue from 'vue'
import api from "./api"

axios.defaults.baseURL = "http://127.0.0.1:8800";
// axios.defaults.baseURL = "https://api.wuguangnuo.cn";
// axios.defaults.headers.common['Authorization'] = '111';
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';
// 超时时间
axios.defaults.timeout = 10000;

// // 添加请求拦截器(axios请求前)
axios.interceptors.request.use(config => {
  let token = localStorage.getItem('token')
  if (token) {
    config.headers['token'] = token;
  }
  return config;
}, error => {
  // 对请求错误做些什么
  return Promise.reject(error);
});


// 添加响应拦截器(axios请求后)
axios.interceptors.response.use(response => {
  // 对响应数据做点什么
  // if(response.data.code == 500){

  // }
  //   console.log(response)
  return response.data;
}, error => {

  console.log(error)
  // 对响应错误做点什么
  return Promise.reject(error);
});


// axios.interceptors.request.use(
//   config => {
//     const token = utils.getLocalStorage('token');
//     console.log(token)
//     if (!config.headers) {
//       if (token) {
//         config.headers = { token };
//       }
//     } else {
//       if (token) {
//         console.log(config)
//         config.headers.token = token;
//       }
//     }

//     return config;
//   },
//   error => {
//     return Promise.resolve(error);
//   }
// );




const postData = (url, data, config = {}) => {
  // return axios.post(api[url], qs.stringify(data));
  return axios.post(api[url], data, config);
}
//  /movie/in_theaters
const getData = (url, params) => {
  return axios.get(api[url], {
    params
  });
}

Vue.prototype.$postData = postData;
Vue.prototype.$getData = getData;


// axios.post('/v2/movie/in_theaters', qs.stringify({
//   num: 1
// })).then(result => {
//   console.log(result)
// })

// axios.post('/v2/movie/in_theaters12313', qs.stringify({
//   num: 14564
// })).then(result => {
//   console.log(result)
// })



// 发送 POST 请求
// axios({
//     method: 'post',
//     url: '/v2/movie/in_theaters',
//     data: {s
//       num:1
//     }
//   });

//   axios({
//     method: 'get',
//     url: '/v2/movie/in_theaters',
//     params: {
//       num:1
//     }
//   });

export default {
  postData, getData
};
