<template>
    <div id="container_liveRoom" :class="{ collapsed: isCollapsed }">

        <aside class="leftNavigation"></aside>

        <div class="room">
            <div class="liveRoom">

                <div class="liveContainer">

                    <div class="Header">
                        <div class="hostAvatar">
                            <img :src="hostInfo.avatar" alt="">
                        </div>
                        <div class="rowContent">
                            <div class="row1">
                                <div class="hostName">
                                    <span>{{ hostInfo.nickname }}</span>
                                </div>
                                <div class="hostTags">
                                    <span>{{ hostInfo.zone }}</span>
                                    <span v-if="hostInfo.tags">{{ hostInfo.tags }}</span>
                                </div>
                                <div class="hostFans">
                                    <div class="follow" v-if="!isFollowed" @click="followFn">
                                        <img src="../../assets/icons/follow.svg" alt="">
                                        <span>关注</span>
                                    </div>
                                    <div class="follow followed" v-if="isFollowed" @click="followFn">
                                        <span> 已关注</span>
                                    </div>
                                    <div class="count"> <span>{{ hostInfo.numOfFans }}</span> </div>
                                </div>
                            </div>

                            <div class="row2">
                                <div class="hostTitle">
                                    <span>{{ hostInfo.title }}</span>
                                </div>
                                <div class="hostIcon">
                                    <div class="icon">
                                        <img src="../../assets/icons/report.svg" alt="">
                                        <span>举报</span>
                                    </div>
                                    <div class="icon">
                                        <img src="../../assets/icons/screen2.svg" alt="">
                                        <span>投屏</span>
                                    </div>
                                    <div class="icon">
                                        <img src="../../assets/icons/share2.svg" alt="分享">
                                        <span>分享</span>
                                    </div>

                                </div>

                            </div>
                        </div>
                    </div>

                    <div class="playContainer">
                        <div class="player" id="player" ref="player"></div>
                    </div>

                    <div class="foot">
                        <span>打赏区,有缘再写</span>
                    </div>

                </div>


                <div class="chat_aside_main">
                    <div class="chatContainer">

                        <div class="chatTab">
                            <ul class="chatTabul">
                                <li :class="{ 'selected': selectedIndex === 0 }" @click="chooseTab(0)"
                                    @mouseover="hoverIndex = 0" @mouseleave="hoverIndex = null"> 铁粉(
                                    {{ hostInfo.numOfFans }} )
                                </li>
                                <li :class="{ 'selected': selectedIndex === 1 }" @click="chooseTab(1)"
                                    @mouseover="hoverIndex = 1" @mouseleave="hoverIndex = null"> 游客(
                                    {{ hostInfo.numOfFans }} )
                                </li>
                            </ul>


                        </div>

                        <div class="msgContent" ref="msgContent">

                        </div>

                        <div class="send">
                            <div class="tool">
                                <img src="../../assets/icons/face.svg" alt="">
                            </div>

                            <div class="sendMsg">
                                <div class="inputMsg">
                                    <!-- <input type="textarea" placeholder="这里输入聊天内容" v-model="msg"> -->
                                    <textarea v-model="sendmsg" autofocus placeholder="这里输入聊天内容"
                                        maxlength="24"></textarea>
                                </div>
                                <div class="sendbtn" @click="sendMsgFn">发送</div>
                            </div>
                        </div>





                    </div>
                </div>

            </div>

        </div>

        <button id="toggleButton" @click="toggleSidebar"></button>
    </div>
</template>

<script>
import Player from 'xgplayer';
import FlvPlayer from 'xgplayer-flv';
import "xgplayer/dist/index.min.css";
// import { Events } from 'xgplayer';

import { io } from "socket.io-client";

import { follow } from '@/api/api';

export default {
    name: 'liveRoom',

    data() {
        return {
            socket: io('https://101.43.35.208:7001'),

            isCollapsed: true,
            userInfo: this.$store.getters.userInfo,
            hostInfo: '',
            hostUrl: '',

            isFollowed: '',

            sendmsg: '',
            // receiveMsgs: [],

            selectedIndex: 0,
            hoverIndex: null

        };
    },

    mounted() {
        // this.socket = io('https://110.42.189.229:7001')
        this.hostInfo = this.$store.getters.hostInfo
        this.hostUrl = 'https://47.100.101.44:8088/' + this.hostInfo.userId + '/f1.flv'
        this.isFollowed = this.$store.getters.followStatus
        const msgContent = this.$refs.msgContent;

        this.initPlayer();

        // chat
        // 1.监听socket连接，请求加入房间
        this.socket.on('connect', () => {
            console.log('Socket connected:', this.userInfo.nickname);
            // 页面加载直接发一条加入房间的消息
            this.socket.emit('joinRoom', {
                nickname: this.userInfo.nickname,
                roomId: this.hostInfo.roomId
                // avatar: this.userInfo.avatar
            })
        });

        // 2.监听加入房间成功
        this.socket.on('joined', data => {
            const joinDiv = document.createElement('div');
            joinDiv.innerHTML = `<span class="userId">${data.nickname}</span>欢迎来到本直播间`
            joinDiv.classList.add("sysmessage");
            msgContent.appendChild(joinDiv);
        })


        // 3.监听退出房间
        this.socket.on('leaveRoom', data => {
            const leaveDiv = document.createElement('div');
            leaveDiv.innerHTML = `<span class="userId">${data.nickname}</span>离开了直播间`
            leaveDiv.classList.add("sysmessage");
            msgContent.appendChild(leaveDiv);
        })

        this.socket.on('loginError', data => {
            // console.log(data)
            alert(data.msg)
        })

        this.socket.on('remoteMessage', msg => {
            // this.receiveMsgs = data;
            const msgDiv = document.createElement('div');
            msgDiv.innerHTML = `<span class="userId">${msg.nickname}</span>: ${msg.msg}`;
            msgDiv.classList.add(msg.nickname === this.userInfo.nickname ? 'mymessage' : 'remotemessage')
            msgContent.appendChild(msgDiv);
        })

        this.socket.on('error', err => {
            console.error('套接字错误:', err);
            // 可选择销毁套接字以清理资源
            this.socket.destroy();
        });
    },

    beforeUnmount() {
        if (this.player) {
            this.player.destroy();
            this.player = null
            console.log('web player closed');
        }

        if (this.socket) {
            this.socket.disconnect();
        }
    },


    methods: {
        toggleSidebar() {
            this.isCollapsed = !this.isCollapsed;
        },

        initPlayer() {
            const config = {
                id: 'player',
                url: this.hostUrl,
                poster: "https://101.43.35.208:7001/cover/baozhi.png",
                fluid: true,
                volume: 0.15,
                plugins: [],
                isLive: true,
                playbackRate: false,
                videoInit: true,  //初始化首帧 
                autoplay: true,
                // autoplayMuted: true,
            };
            config.plugins.push(FlvPlayer)
            this.player = new Player(config);
            console.log(config.url);

            return new Promise((resolve, reject) => {
                if (this.hostUrl) {
                    // 设置正确的 URL 参数
                    this.player.config.url = this.hostUrl;
                    // 重新加载播放器以应用新的 URL 参数
                    this.player.reload();
                    // 调用resolve函数，表示初始化完成
                    resolve();
                } else {
                    // 如果hostInfo.url不存在或者无效，调用reject函数
                    reject('Error: Invalid hostInfo or URL');
                }
            });
        },

        async followFn() {
            const roomId = this.hostInfo.roomId
            console.log('this.isFollowed:', this.isFollowed);
            var action
            if (this.isFollowed) {
                action = 'unfollow'
            } else {
                action = 'follow'
            }
            const res = await follow(roomId, action)
            console.log('resFollow,', res.data.message.numOfFans);
            this.$store.commit('updateNumOfFans', res.data.message.numOfFans)
            this.isFollowed = !this.isFollowed;
        },

        chooseTab(index) {
            this.selectedIndex = index;
        },

        // 点击发送消息事件
        sendMsgFn() {
            if (this.sendmsg.length == 0) {
                alert('您不能发送空消息！')
            } else {
                this.socket.emit('message', {
                    msg: this.sendmsg,
                    nickname: this.userInfo.nickname,
                })
                this.sendmsg = ''
            }
        },
    }
}
</script>

<style>
#container_liveRoom {
    position: relative;
    display: flex;
    top: -60px;
    background-image: url('../../assets/background.webp');
    /* background-color: black; */
    height: calc(100% + 60px);
}

.collapsed .leftNavigation {
    width: 5px;
    /* 设置侧边栏收起时的宽度 */
}

.leftNavigation {
    position: relative;
    width: 10vw;
    height: calc(100% - 60px);
    top: 60px;
    /* 设置侧边栏的初始宽度 */
    transition: width 1s ease;
    /* 添加过渡效果，使收起/展开的动画更流畅 */
    background-color: gold;
}

.room {
    flex-grow: 1;
    /* 让房间占据剩余的空间 */
    position: relative;
    top: 60px;
    height: calc(100% - 60px);

    .liveRoom {
        width: 72%;
        display: flex;
        margin: auto;

        .liveContainer {
            width: 78%;
            min-width: 640px;
            display: flex;
            flex-direction: column;
            margin: 0 auto;

            .Header {
                height: 64px;
                padding: 13px;
                display: flex;
                background-image: url('../../assets/bHeader.jpg');
                background-repeat: no-repeat;
                border-top-right-radius: 0.3rem;
                border-top-left-radius: 0.3rem;

                .hostAvatar {
                    height: 64px;
                    width: 64px;
                    margin: auto 6px;
                    /* border-radius: 2rem; */

                    img {
                        width: 100%;
                        height: 100%;
                        object-fit: contain;
                        border-radius: 0.5rem;
                    }
                }

                .rowContent {
                    /* min-width: 600px; */
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    flex-grow: 1;

                    .row1 {
                        display: flex;
                        flex-direction: row;
                        justify-content: flex-start;
                        /* flex-basis: 5/8; */
                        height: 30px;
                        padding: 0 8px;
                        /* background-color: yellow; */

                        .hostName {
                            height: 100%;
                            min-width: 40px;
                            font-size: 20px;
                            color: white;
                            font-weight: 500;
                            line-height: 30px;
                        }

                        .hostTags {
                            text-align: left;
                            height: 100%;
                            min-width: 150px;
                            margin: 0px 12px;
                            flex-grow: 1;

                            span {
                                background-color: #e8eaf0;
                                border-radius: 3px;
                                color: #666;
                                font-size: 11px;
                                font-weight: 400;
                                padding: 2px 6px;
                                margin-right: 8px;
                                line-height: 30px;
                            }
                        }

                        .hostFans {
                            height: 100%;
                            display: flex;
                            flex-direction: row;


                            .follow {
                                width: 60px;
                                height: 24px;
                                background-color: #fd7272;
                                border-top-left-radius: 0.6rem;
                                border-bottom-left-radius: 0.6rem;
                                text-align: center;
                                margin: auto 0;
                                display: flex;
                                justify-content: center;
                                align-items: center;

                                img {
                                    width: 16px;
                                }

                                span {
                                    font-size: 12px;
                                    line-height: 24px;
                                    color: white;
                                }
                            }

                            .followed {
                                background-color: rgb(116, 115, 115);
                            }

                            .follow:hover {
                                cursor: pointer;
                            }

                            .count {
                                /* width: 54px; */
                                height: 24px;
                                background-color: white;
                                border-top-right-radius: 0.6rem;
                                border-bottom-right-radius: 0.6rem;
                                text-align: center;
                                margin: auto 0;

                                span {
                                    color: gray;
                                    font-size: 11px;
                                    line-height: 24px;
                                    margin: auto 10px;
                                }
                            }
                        }

                    }

                    .row2 {
                        display: flex;
                        flex-direction: row;
                        justify-content: space-around;
                        height: 24px;
                        padding: 0 8px;

                        .hostTitle {
                            /* flex-basis: 50%; */
                            height: 100%;
                            /* background-color: gray; */

                            span {
                                font-size: 16px;
                                line-height: 24px;
                                color: rgba(255, 212, 35, 1) !important;
                                font-weight: 500;
                            }
                        }


                        .hostIcon {
                            height: 100%;
                            /* background-color: gray; */
                            display: flex;
                            flex-grow: 1;
                            justify-content: flex-end;

                            .icon {
                                display: flex;
                                align-items: center;
                                margin-left: 20px;

                                img {
                                    width: 16px;
                                    /* height: 18px; */
                                }

                                span {
                                    color: white;
                                    font-size: 12px;
                                    margin: auto 3px;
                                    line-height: 24px;
                                    letter-spacing: 1px;
                                }
                            }

                        }
                    }
                }

            }

            .playerContainer {
                position: relative;
                width: 100%;
                padding-bottom: 9/16;

                #player {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                }
            }

            .foot {
                height: 100px;
                border-bottom-left-radius: 0.3rem;
                border-bottom-right-radius: 0.3rem;
                background-image: url('../../assets/bottom.jpg');
                background-repeat: no-repeat;
                display: flex;
                align-items: center;
                justify-content: center;

                span {
                    color: white;
                    font-size: 20px;
                }
            }
        }

        .chat_aside_main {
            position: relative;
            width: 310px;


            .chatContainer {
                min-width: 310px;
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                display: flex;
                flex-direction: column;
                margin-left: 8px;
                border-radius: 0.3rem;

                .chatTab {
                    background-image: url('../../assets/chat.png');
                    height: 90px;

                    .chatTabul {
                        display: flex;
                        margin: 0;

                        li {
                            color: #9b9b9b;
                            flex: 1;
                            list-style: none;
                            font-size: 14px;
                            cursor: pointer;
                            font-weight: 700;
                            line-height: 36px;
                        }

                        li:hover {
                            color: white;

                        }

                        li.selected {
                            color: gold;

                        }
                    }


                }

                .msgContent {
                    background-color: whitesmoke;
                    overflow-y: auto;
                    font-size: 12px;
                    letter-spacing: 1px;
                    position: absolute;
                    top: 90px;
                    left: 0;
                    right: 0;
                    bottom: 100px;
                    z-index: 10;

                    .sysmessage {
                        padding: 4px 6px;
                        margin: 4px 6px;

                        span {
                            color: pink;
                            font-weight: 700;
                        }

                    }

                    .mymessage {
                        padding: 4px 6px;
                        margin: 4px 6px;

                        .userId {
                            color: red;
                        }
                    }

                    .remotemessage {
                        padding: 4px 6px;
                        margin: 4px 6px;

                        .userId {
                            color: blue;
                        }
                    }
                }

                .send {
                    background-color: #fff;
                    position: absolute;
                    z-index: 20;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    z-index: 10;
                    height: 100px;

                    .tool {
                        height: 36px;
                        background-color: rgb(198, 197, 197);

                        img {
                            width: 20px;
                            margin: 8px;
                        }
                    }

                    .sendMsg {

                        height: 64px;
                        width: 100%;
                        margin: auto;
                        display: flex;

                        .inputMsg {
                            height: 90%;
                            flex-grow: 1;
                            margin: auto;

                            textarea {
                                height: calc(100% - 5.2px);
                                width: calc(100% - 5.2px);
                                outline: none;
                                padding-right: 0;
                                border-top-left-radius: 0.2rem;
                                border-bottom-left-radius: 0.2rem;
                            }
                        }

                        .sendbtn {
                            height: 90%;
                            width: 44px;
                            margin: auto;
                            color: white;
                            background-color: rgb(190, 190, 190);
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            border-top-right-radius: 0.2rem;
                            border-bottom-right-radius: 0.2rem;
                        }

                        .sendbtn:hover {
                            background-color: rgb(168, 168, 168);
                        }
                    }
                }




            }
        }


    }
}

/* 添加一个按钮或图标，用于触发收起/展开侧边栏的操作 */
#toggleButton {
    cursor: pointer;
    position: absolute;
    top: 50%;
    left: 0;
    transform: translate(0, -50%);
    padding: 6px;
    background-color: #3498db;
    color: #fff;
    border: none;
    border-radius: 0.6rem;
    z-index: 999;
    /* 确保按钮在最上层 */
}
</style>