import { createRouter, createWebHistory } from 'vue-router'
import { CheckRoomId } from '@/api/api';
import store from '@/store/store'

import main from '../views/main.vue'
import live from '../views/live/live.vue'
import All from '../views/alllive/alllive.vue'
import liveRoom from '../views/liveRoom/liveRoom.vue'
import join from '../views/webrtc/webrtc.vue'
import account from '../views/account/account.vue'
import login from '../views/login.vue'

const routes = [
    {
        path: '/',
        component: main,
        redirect: '/live',
        children: [
            { path: 'live', component: live },
            { path: 'all', component: All },
            {
                path: 'liveRoom/:roomId',
                name: 'liveRoom',
                component: liveRoom,
                props: true,
                // 特定路由守卫
                // beforeEnter: async (to, from, next) => {
                //     // 检查用户是否已登录
                //     if (!store.state.token) {
                //         next('/login');
                //     } else {
                //         // 如果存在 roomId，则继续检查 roomId 的存在性
                //         if (to.params.roomId) {
                //             const roomId = to.params.roomId;
                //             console.log('to.params.roomId', roomId);
                //             await CheckRoomId(roomId)
                //                 .then(async data => {
                //                     if (data.exists) {
                //                         await getFollowStatus(roomId)
                //                             .then(res => {
                //                                 store.commit('updateFollowStatus', res.data);
                //                                 next();
                //                             })
                //                             .catch(err => {
                //                                 console.error('Error getting follow status:', err);
                //                                 next('/login');
                //                             })

                //                     } else {
                //                         alert('直播间不存在，即将为您跳转到首页')
                //                         next('/live')
                //                     }
                //                 })
                //                 .catch(err => {
                //                     console.error('Error checking roomId existence:', err);
                //                     next('/login');
                //                 });
                //         } else {
                //             // 如果不存在 roomId，则直接放行
                //             next();
                //         }
                //     }
                // },
                beforeEnter: async (to, from, next) => {
                    try {
                        // 检查用户是否已登录
                        if (!store.state.token) {
                            return next('/login');
                        }

                        // 如果存在 roomId，则继续检查 roomId 的存在性
                        const roomId = to.params.roomId;
                        if (roomId) {
                            console.log('to.params.roomId', roomId);

                            // 检查房间 ID 的存在性
                            const res = await CheckRoomId(roomId);
                            if (!res.exists) {
                                alert('直播间不存在，即将为您跳转到首页');
                                return next('/live');
                            }

                            // 获取关注状态并更新到 Vuex 中
                            await store.dispatch('getFollowStatusAction', roomId);
                        }

                        // 如果不存在 roomId 或者检查通过，则直接放行
                        next();
                    } catch (error) {
                        console.error('Error:', error);
                        next('/login');
                    }
                }
            },
            {
                path: '/account',
                component: account,
                children: [
                    { path: 'account', component: account },
                ],
                beforeEnter: async (to, from, next) => {
                    try {
                        // 检查用户是否已登录
                        if (!store.state.token) {
                            return next('/login');
                        }
                        next();
                    } catch (error) {
                        console.error('Error:', error);
                        next('/login');
                    }
                }

            },
            {
                path: 'join',component: join
            }
        ],
    },
    {
        path: '/login',
        component: login,
        children: [
            { path: 'login', component: login },
        ]
    },

]

const router = createRouter({
    history: createWebHistory(),
    routes
})


//全局路由守卫beforeEach，判断roomId是否存在进行跳转
// router.beforeEach(async (to, from, next) => {
//     // if (to.matched.some(record => record.path === '/liveRoom/:roomId')) {
//     if (to.params.roomId) {
//         const roomId = to.params.roomId
//         console.log('to.params.roomId', roomId);
//         await CheckRoomId(roomId)
//             .then(data => {
//                 if (data.exists) {
//                     next();
//                 } else {
//                     next('/login');
//                 }
//             })
//             .catch(err => {
//                 console.error('Error checking roomId existence:', err);
//                 next('/login');
//             });
//     } else {
//         next()
//     }

// })


export default router