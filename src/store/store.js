import { createStore } from 'vuex';
import VuexPersist from 'vuex-persist';
import { getUserInfo, getHostInfo, getFollowStatus } from '@/api/api'


const vuexLocalStorage = new VuexPersist({
    key: 'myLiveApp', // 存储的键名
    // storage: window.localStorage // 存储方式，可以是 localStorage 或 sessionStorage
});

const store = createStore({
    state: {
        token: '',
        userInfo: {},
        hostInfo: {},
        followStatus: '',
    },
    mutations: {
        updateToken(state, token) {
            state.token = token
        },
        clearToken(state) {
            state.token = null;
        },
        clearUserInfo(state){
            state.userInfo = null;
        },
        updateUserInfo(state, userInfo) {
            state.userInfo = userInfo; // 更新用户信息
        },
        updateHostInfo(state, hostInfo) {
            state.hostInfo = hostInfo; // 更新房间信息
        },
        updateFollowStatus(state, status) {
            state.followStatus = status === 1 ? true : false
        },
        updateNumOfFans(state, newNumOfFans) {
            state.hostInfo.numOfFans = newNumOfFans;
        },
        updateAvatar(state, avatar) {
            state.userInfo.avatar = avatar
        }


    },
    actions: {
        updateToken({ commit }, newToken) {
            // 在这里提交更新 token 的 mutation,commit是vuex的内置函数
            commit('updateToken', newToken);
        },

        async getUserInfoAction({ commit }) {
            const res = await getUserInfo()
            console.log('userinfo:', res.data);
            commit('updateUserInfo', res.data.data)
        },
        async getHostInfoAction({ commit, state }, roomId) {
            if (!state.token) {
                return Promise.reject('User is not logged in, please log in first');
            } else {
                return getHostInfo(roomId)
                    .then(res => {
                        console.log('HostInfo:', res.data);
                        commit('updateHostInfo', res.data.data)
                    })
                    .catch(error => {
                        console.error('Error getting host info:', error);
                        throw error;
                    });

            }
        },
        async getFollowStatusAction({ commit }, roomId) {
            const res = await getFollowStatus(roomId)
            console.log('res.followStatus', res.data);
            commit('updateFollowStatus', res.data.status);
        },

    },
    getters: {
        userInfo: state => state.userInfo,
        hostInfo: state => state.hostInfo,
        followStatus: state => state.followStatus,
    },
    plugins: [vuexLocalStorage.plugin]
});

export default store;