// 基于axios封装网络请求函数
import router from '@/router/router'
import store from '@/store/store'
import axios from 'axios'
import qs from 'qs'


const axiosReq = axios.create({
    // baseURL: 'http://47.100.101.44:1985/api'
    baseURL: 'https://101.43.35.208:7001',
    headers: {
        'Content-Type': "application/x-www-form-urlencoded",
    },
})



// 请求拦截器,在请求被发送之前做些什么
axiosReq.interceptors.request.use(
    (config) => {
        // 从 localStorage 中获取 token
        // const token = localStorage.getItem('token')
        // 使用vuex store中的token
        const token = store.state.token;
        const url = config.url
        if (url.includes('/userAPI/') && url !== '/userAPI/login' && url !== '/userAPI/getHostInfo' && token) {
            config.headers.Authorization = token;
        }

        // 返回修改后的请求配置
        return config;
    },
    (error) => {
        // 返回一个 Promise 对象，以便后续处理错误
        return Promise.reject(error);
    }
);

// 响应拦截器
axiosReq.interceptors.response.use(
    (res) => {
        // 对响应数据做些什么，比如检查 token 是否过期等
        return res;
    },
    (error) => {
        // 对响应错误做些什么，比如处理 token 过期等情况
        if (error.res && error.res.status === 401) {
            // 如果响应状态为 401，表示 token 过期或无效
            // 在这里可以触发一个 action 来处理 token 过期的情况，比如重新登录等操作
            store.dispatch('updateToken');
        }
        // 返回一个 Promise 对象，以便后续处理错误
        return Promise.reject(error);
    }
);


// 2.1获取用户信息userAPI
export const postFormData = (endpointUrl, formData) => {
    return axiosReq.post(endpointUrl, qs.stringify(formData));
};

// 2.2获取用户信息userAPI
export const getUserInfo = () => {
    return axiosReq({
        url: '/userAPI/getUserInfo',
    })
}


// 3.1直播间roomId是否存在判断
export const CheckRoomId = (roomId) => {
    return axiosReq({
        url: `/hostAPI/liveRoom/${roomId}`,
    })
        .then(res => {
            return res.data
        })
        .catch(err => {
            throw err
        })
}

// 3.2获取主播房间信息hostAPI
export const getHostInfo = (roomId) => {
    return axiosReq({
        url: `/hostAPI/getHostInfo/${roomId}`,
    })
}

// 3.3获取推荐直播间信息，默认5个srs
export const getRoomInfo = () => {
    return axiosReq({
        url: '/hostAPI/getRoomInfo',
    })
}

// 3.4 获取关注status
export const getFollowStatus = (roomId) => {
    return axiosReq({
        url: '/userAPI/getFollowStatus',
        method: 'post',
        data: {
            roomId: roomId
        }
    })
}

// 3.5关注follow
export const follow = (roomId, action) => {
    return axiosReq({
        url: '/userAPI/follow',
        method: 'post',
        data: {
            roomId: roomId,
            action: action
        }
    })
}


// 4.1获取后端流信息srs
export const getLiveInfo = () => {
    return axiosReq({
        url: '/srs/getLiveInfo',
    })
}


// 5.1 更新用户头像
export const updateUserAvatar = (avatar) => {
    return axiosReq({
        url: '/userAPI/avatar',
        method: 'post',
        data: {
            avatar: avatar
        }
    })
}



// 6.1webrtc 推拉
// 第二个axios实例
// const axiosReq2 = axios.create({
//     baseURL: "https://47.100.101.44:1990/rtc/v1/publish",
//     headers: {
//         'Content-Type': 'application/json',
//     },
// })


export const publishStream = (url, data) => {
    return axios.post(url, data, {
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => response.data)
        .catch(error => {
            throw new Error('Error publishing stream: ' + error.message);
        });
} 

export const playStream = (url, data) => {
    return axios.post(url, data, {
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => response.data)
        .catch(error => {
            throw new Error('Error play stream: ' + error.message);
        });
} 