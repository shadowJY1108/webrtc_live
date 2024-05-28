<template>
    <header>
        <div id="log">
            <img src="../assets/livelogo.png" alt="" id="imglog">
        </div>

        <div class="title">
            <router-link to="/live" class="title-item">首页</router-link>
            <router-link to="/all" class="title-item">直播</router-link>
            <a href="#" class="title-item">分类</a>
            <a href="#" class="title-item">聊吧</a>
            <router-link to="/join" class="title-item">连麦</router-link>
        </div>

        <div id="set">
            <div id="avatar">
                <img :src="avatar" alt="" @mouseenter="showPopup = true">
                <!-- <span v-if="userId">{{ userId }}</span> -->

                <!-- 弹出层 -->
                <div v-if="showPopup" class="popup" @mouseleave="showPopup = false">
                    <!-- 登陆状态 -->
                    <div v-if="isLoggedIn" class="isLoggedIn">
                        <div class="quitIcon">
                            <img src="../assets/icons/退出登录.svg" alt="" @click="logout">
                            <span @click="logout">登出</span>
                        </div>
                        <div class="avatarIcon" @click="toSet">
                            <img :src="avatar" alt="">
                            <span>{{ userId }}</span>
                        </div>

                    </div>
                    <!-- 未登陆状态 -->
                    <div v-else class="notLoggedIn">
                        <div class="title">
                            <span>登陆后和主播互动</span>
                        </div>
                        <div class="btnBox">
                            <div class="loginBtn">
                                <a href="/login">登录</a>
                            </div>
                            <div class="regBtn">
                                <a href="/register">注册</a>
                            </div>
                        </div>

                    </div>

                </div>

            </div>

            <div id="broadcastIcon">
                <i>
                    <img src="../assets/icons/开播white.svg" alt="">
                    <span>开播</span>
                </i>
            </div>

        </div>
    </header>

    <div class="main">
        <router-view></router-view>
    </div>

    <!-- <div class="RightNavigate">

        <i id="broadcastIcon">
            <img src="../assets/broadcast.png" alt="">
            <span>开播</span>
        </i>
    </div> -->
</template>

<script>
export default {
    name: 'home',

    data() {
        return {
            showPopup: false,

        };
    },

    // mounted(){
    //     this.avatar = this.$store.getters.userInfo.avatar
    // },

    computed: {
        userId() {
            const userInfo = this.$store.getters.userInfo;
            return userInfo && userInfo.userId ? userInfo.userId : null
        },
        avatar() {
            const userInfo = this.$store.getters.userInfo;
            return userInfo && userInfo.avatar ? userInfo.avatar : '/src/assets/default.jpeg';
        },
        isLoggedIn() {
            return this.$store.state.token;
        }
    },

    methods: {
        logout() {
            this.$store.commit('clearToken');
            this.$store.commit('clearUserInfo');
            this.$router.push('/')
        },

        toSet() {
            this.$router.push('/account')
        }
    }

}

</script>

<style>
header {
    width: 100%;
    height: 60px;
    position: relative;
    top: 0;
    display: flex;
    justify-content: space-between;
    /* background-color: white; */
    z-index: 15;

    #log {
        width: 20%;
        text-align: right;
        position: relative;
        z-index: 20;

        /* background-color: yellow; */
        #imglog {
            /* width: 110px; */
            height: 40px;
            margin: 10px auto;
            border-radius: 0.2rem;
        }
    }

    .title {
        text-align: left;
        min-width: 360px;
        width: 40%;
        height: 40px;
        margin: auto 0;
        /* background-color: wheat; */
        z-index: 20;

        .title-item,
        router-link {
            font-size: 16px;
            /* font-weight: 500; */
            font-family: Microsoft Yahei, Segoe UI Emoji, sans-serif;
            min-width: 46px;
            line-height: 40px;
            margin-left: 40px;
            /* color: black; */
            color: white;
            text-decoration: none;
        }

        .title-item:hover {
            color: gold;
        }
    }

    #set {
        width: 40%;
        display: flex;
        justify-content: center;

        #avatar {
            height: 44px;
            width: 60px;
            margin: 8px;

            img {
                width: 44px;
                height: 44px;
                border-radius: 50%;
                vertical-align: middle;
                cursor: pointer;
                /* display: inline-block; */
            }

            span {
                color: whitesmoke;
                margin: 0 10px;
            }

            .popup {
                width: 320px;
                background-color: whitesmoke;
                font-size: 14px;
                /* text-align: center; */
                border-radius: 0.3rem;
                position: relative;
                top: 20px;
                outline: 2px solid gold;

                /* 登陆状态 */
                .isLoggedIn {
                    .quitIcon {
                        text-align: right;
                        /* background-color: beige; */
                        padding: 8px 0;

                        img {
                            width: 20px;
                            height: 20px;
                            cursor: pointer;
                        }

                        span {
                            margin: auto 10px auto 5px;
                            padding: 0;
                            color: black;
                            cursor: pointer;
                        }

                        span:hover {
                            color: gold;
                        }
                    }


                    .avatarIcon {
                        text-align: center;
                        padding: 8px;

                        img {
                            width: 60px;
                            height: 60px;
                            cursor: pointer;
                        }

                        span {
                            display: block;
                            margin: auto;
                            color: black;
                            padding: 8px;
                            font-size: 16px
                        }

                        span:hover {
                            color: gold;
                        }
                    }

                }

                /* 未登陆状态 */
                .notLoggedIn {
                    display: flex;
                    flex-direction: column;

                    .title {
                        padding: 10px;
                        font-size: 16px;
                        /* background-color: gray; */
                        span {
                            color: black;
                        }
                    }

                    .btnBox {
                        display: flex;
                        justify-content: center;
                        padding: 16px;
                    

                        .loginBtn {
                            width: 110px;
                            height: 28px;
                            background-color: red;
                            cursor: pointer;
                            border-radius: 0.3rem;
                            border: 1px solid red;
                            margin: 10px 5px;
                            text-align: center;
                            line-height: 28px;
                        }

                        .regBtn {
                            width: 110px;
                            height: 28px;
                            background-color: white;
                            cursor: pointer;
                            border-radius: 0.3rem;
                            border: 1px solid red;
                            margin: 10px 5px;
                            text-align: center;
                            line-height: 28px;
                        }

                        .regBtn:hover {
                            background-color: red;
                        }

                        .loginBtn .regBtn,
                        a {
                            text-decoration: none;
                        }

                        .regBtn:hover a {
                            color: white;
                        }

                        .loginBtn {
                            width: 100px;
                            height: 28px;
                            background-color: red;
                            cursor: pointer;
                            border-radius: 0.3rem;
                            border: 1px solid red;
                            margin: 10px 5px;
                            text-align: center;
                            line-height: 28px;
                        }

                        .regBtn {
                            width: 100px;
                            height: 28px;
                            background-color: white;
                            cursor: pointer;
                            border-radius: 0.3rem;
                            border: 1px solid red;
                            margin: 10px 5px;
                            text-align: center;
                            line-height: 28px;
                        }

                        .regBtn:hover {
                            background-color: red;
                        }

                        .loginBtn .regBtn,
                        a {
                            text-decoration: none;
                        }

                        .regBtn:hover a {
                            color: white;
                        }
                    }



                }


            }

            .popup::before {
                content: '';
                position: absolute;
                top: -10px;
                left: 7%;
                /* 控制箭头的位置 */
                width: 0;
                height: 0;
                border-left: 8px solid transparent;
                /* 左边框透明 */
                border-right: 8px solid transparent;
                /* 右边框透明 */
                border-bottom: 10px solid gold;
                /* 底边框为实心，控制箭头颜色 */
                transform: translateX(-50%);
                /* 居中箭头 */
            }

        }

        #broadcastIcon {
            text-align: center;
            background-color: rgba(249, 76, 2, 0.5);
            width: 80px;
            height: 36px;
            border-radius: 1.5rem;
            margin: 10px 0 10px 10px;

            i {
                img {
                    width: 24px;
                    height: 24px;
                    display: inline-flex;
                    vertical-align: middle;
                }

                span {
                    line-height: 36px;
                    margin-left: 3px;
                    font-size: 12px;
                    /* font-family: Microsoft YaHei; */
                    font-weight: 700;
                    color: white;
                }

            }
        }

        #broadcastIcon:hover {
            background-color: red;
        }

        #broadcastIcon:hover span {
            color: whitesmoke;
        }


    }
}

.main {
    height: calc(100% - 60px);
    width: 100%;
    position: relative;
}

.RightNavigate {
    width: 44px;
    height: 240px;
    position: fixed;
    top: 60%;
    right: 0;
    background-color: white;
    border-top-left-radius: 0.8rem;
    z-index: 30;

    #broadcastIcon {
        text-align: center;
        display: block;
        width: 50px;
        height: 250px;
        margin: 0 auto;

        img {
            width: 26px;
            height: 26px;
            display: block;
            margin: 5px auto 0 auto;
        }

        span {
            font-size: 12px;
            font-family: Microsoft YaHei, Microsoft YaHei-Bold;
            font-weight: 700;
            color: red;
            margin: 2 auto;
            display: block;
        }
    }
}
</style>