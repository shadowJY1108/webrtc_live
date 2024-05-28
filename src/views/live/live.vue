<template>
    <div id="container">

        <div id="player_box">

            <div id="player">
                <div id="liveshow">
                    <div id="H5_player" ref="H5_player"></div>
                </div>

                <div id="elseshow">
                    <div class="list" ref="list">
                        <div v-for="(item, index) in playInfo" :key="index" :ref="`${index}`"
                            :class="['itemshow', { 'selectedItemShow': isSelected === index }]"
                            @click="changeLiveChannel(index)">
                            <img :src="item.coverUrl" alt="哈哈" @load="handleImageLoad" class="imgCover">
                        </div>

                        <div v-for="n in defaultElementsCount" :key="'default-' + n" :ref="`${'default-' + n}`"
                            :class="['itemshow', { 'selectedItemShow': isSelected === 'default-' + n }]"
                            @click="changeLiveChannel('default-' + n)">
                            <img :src="defaultInfo[0].coverUrl" @load="handleImageLoad" class="imgCover" alt="哈哈">
                        </div>

                    </div>
                </div>

            </div>

        </div>

        <div id="ad_box">
            <div class="adtitle">
                <img src="../../assets/icons/reco.png" alt="">
                <span>推荐直播间</span>
            </div>

            <div v-if="recommendedRooms && recommendedRooms.length > 0" class="aditemBox">
                <div v-for="(item, index) in recommendedRooms" :key="index" class="aditem">
                    <img :src="item.coverUrl" @click="toLiveRoom(item.roomId)" alt="哈哈">
                    <div class="title">
                        {{ item.title }}
                    </div>
                    <span>{{ item.zone }}</span> <span v-if="item.tags">{{ item.tags }}</span>
                </div>

            </div>


        </div>


    </div>
</template>

<script>
import Player from 'xgplayer';
import FlvPlayer from 'xgplayer-flv';
import "xgplayer/dist/index.min.css";
import { getLiveInfo, getRoomInfo } from '@/api/api';
import { Events } from 'xgplayer'
export default {
    name: 'first',

    data() {
        return {
            player: null,
            fixedElementsCount: 5,
            playInfo: [],
            defaultInfo: [
                { user: 'default', coverUrl: 'https://101.43.35.208:7001/media/cover/default.png' },
            ],
            recommendedRooms: [],
            isSelected: null,
            initialLoad: true
        };
    },

    computed: {
        defaultElementsCount() {
            // 计算需要渲染的默认元素数量
            return Math.max(0, this.fixedElementsCount - this.playInfo.length);
        }
    },

    mounted() {
        this.initPlayer()
        this.getStreams()
        this.getRooms()
        window.addEventListener('resize', this.resizePlayer);
    },

    /*  组件销毁前移除窗口大小变化事件监听,销毁播放器实例，防止内存溢出*/
    beforeUnmount() {
        window.removeEventListener('resize', this.handleResize);
        if (this.player) {
            this.player.destroy();
            this.player = null
            console.log('web player closed');
        }
    },

    created() { },

    methods: {
        // =========================1，设置播放器必要参数===================
        initPlayer() {
            const config = {
                id: 'H5_player',
                url: null,
                poster: "https://101.43.35.208:7001/media/cover/baozhi.png",
                // fluid: true,
                volume: 0.1,
                plugins: [],
                isLive: true,
                playbackRate: false,
                videoInit: true,  //初始化首帧 
                autoplay: true,
                // autoplayMuted: true,
            };
            config.plugins.push(FlvPlayer)
            this.player = new Player(config);
            this.resizePlayer()

            this.player.on(Events.ENDED, () => {
                console.log('play ENDED');
                setTimeout(() => {
                    this.getStreams()
                }, 1000);
            })
        },

        resizePlayer() {
            const playerElement = this.$refs.H5_player;
            const itemElements = document.querySelectorAll('.itemshow')
            // console.log(itemElements);
            // console.log('window.innerWidth:', window.innerWidth);
            const newWidth = 0.56 * window.innerWidth;
            const newHeight = (9 / 16) * newWidth;

            const list = this.$refs.list
            // 设置播放器容器的新大小
            if (window.innerWidth > 1024) {
                playerElement.style.width = newWidth + 'px';
                playerElement.style.height = newHeight + 'px';
                // console.log(playerElement.style.height)
                list.style.maxHeight = (parseInt(playerElement.style.height) - 8) + 'px';
                // console.log(list.style.maxHeight);
                itemElements.forEach(item => {
                    // item.style.width = 0.187 * newWidth + 'px';
                    // item.style.height = 0.187 * newHeight + 'px';
                    // item.style.width = list.style.maxHeight/5;
                    item.style.height = (parseInt(playerElement.style.height) - 44) / 5 + 'px';
                })
            } else {
                playerElement.style.width = '573.44px';
                playerElement.style.height = '322.56px';
                list.style.maxHeight = (parseInt(playerElement.style.height) - 8) + 'px';
                itemElements.forEach(item => {
                    // item.style.width = '137.6256px';
                    // item.style.height = '77.4144px'
                    item.style.height = (parseInt(playerElement.style.height) - 44) / 5 + 'px';
                })
            }
        },

        getStreams() {
            getLiveInfo()
                .then(res => {
                    if (res.data.length > 0) {
                        this.playInfo = res.data
                        console.log('getplayInfo:', this.playInfo);
                        this.player.playNext({
                            url: this.playInfo[0].playUrl,
                        })
                        this.changeLiveChannel(0);
                    } else {
                        console.log('当前无人直播，去看看直播回放吧');
                        this.changeLiveChannel(0);
                    }
                })
                .catch(error => {
                    console.error('获取直播信息时发生错误:', error);
                });
        },

        getRooms() {
            getRoomInfo().then(res => {
                this.recommendedRooms = res.data.data
                console.log(this.recommendedRooms);
            })
        },

        handleImageLoad() {
            this.$nextTick(() => {
                // const imgCover = this.$el.querySelector('.imgCover');
                // // 设置样式
                // imgCover.style.objectFit = 'cover';
                // imgCover.style.width = '100%';
                // imgCover.style.height = '100%';
                this.resizePlayer()
            });

        },

        changeLiveChannel(index) {
            // const selectedItemShow = this.$refs[index];
            this.isSelected = index;
            if (typeof index === 'number' && this.playInfo[index].playUrl) {
                this.player.switchURL(this.playInfo[index].playUrl)
            } else if (typeof index === 'string') {
                alert('等待主播开播')
            } else {
                alert('未开播')
            }
        },

        toLiveRoom(roomId) {
            // console.log(roomId);
            this.$store.dispatch('getHostInfoAction', roomId)
                .then(() => {
                    this.$router.push({
                        name: 'liveRoom',
                        params: { roomId: roomId }
                    });
                })
                .catch(error => {
                    console.error('Error:', error);
                    this.$router.push('/login')
                });
        }

    },


}
</script>

<style scoped>
#container {
    width: 100%;
    height: 100%;
    position: relative;
    z-index: 10;
}

#player_box::before {
    content: "";
    background-image: url('../../assets/live.jpg');
    background-size: cover;
    position: absolute;
    top: -60px;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: -10;
}


#player_box {
    width: 100%;
    height: auto;
    position: relative;
    z-index: 10;
    top: -60px;
    background-color: black;

    #player {
        /* height: calc(100% - 60px); */
        width: 100%;
        position: relative;
        top: 60px;
        display: flex;
        justify-content: center;


        #liveshow {
            min-height: 316.8px;
            min-width: 563.2px;
            /* display: flex; */

            #H5_player {
                background-color: rgb(0, 0, 0, 0.8);
                border-radius: 0.5rem;
            }
        }

        #elseshow::-webkit-scrollbar {
            width: 0 !important
        }

        #elseshow {
            padding: 4px 4px 4px 16px;
            margin-left: 5px;
            /* overflow-y: scroll; */

            .list {
                .itemshow {
                    border-radius: 0.3rem;
                    margin: 0 0 8px 0;
                    position: relative;
                    cursor: pointer;
                    outline: auto;

                    img {
                        object-fit: cover;
                        border-radius: 0.3rem;
                        width: 100%;
                        height: 100%;
                    }
                }

                .selectedItemShow {
                    outline: 4px solid gold;
                }

                .selectedItemShow::before {
                    content: '';
                    /* 伪元素必须有content属性，即使为空 */
                    position: absolute;
                    top: 50%;
                    left: -12px;
                    /* 控制箭头的位置 */
                    width: 0;
                    height: 0;
                    border-top: 8px solid transparent;
                    /* 上边框透明 */
                    border-bottom: 8px solid transparent;
                    /* 下边框透明 */
                    border-right: 12px solid gold;
                    /* 右边框为实心，控制箭头颜色 */
                    transform: translateY(-50%);
                    /* 居中箭头 */
                }

                .itemshow:hover {
                    outline: 4px solid gold;
                }

            }
        }
    }
}

#ad_box {
    width: calc(100% - 100px);
    margin: 10px auto 0 auto;

    .adtitle {
        margin: 0 auto;
        height: 28px;
        min-width: 800px;
        max-width: 1450px;
        /* background-color: aliceblue; */
        text-align: left;
        line-height: 28px;

        img {
            width: 28px;
            height: 28px;
            vertical-align: middle;
            margin: 0 auto;
        }

        span {
            line-height: 28px;
            font-size: 20px;
            font-family: inherit;
        }
    }

    .aditemBox {
        display: flex;
        justify-content: center;

        .aditem {
            min-width: 190px;
            width: 270px;
            aspect-ratio: 16/9;
            /* background-color: aqua; */
            margin: 6px;
            padding: 4px;

            img {
                width: 100%;
                height: 100%;
                object-fit: cover;
                border-radius: 0.2rem;
                cursor: pointer;
                /* transition: transform 0.2s ease; */
                outline: 2px solid gold;
            }

            img:hover {
                transform: translateY(-4px);
                /* 鼠标悬停时向上移动3像素 */
                box-shadow: 4px px 10px rgba(0, 0, 0, 0.6);
                /* 添加阴影效果 */
                /* outline: 2px solid gold; */
            }

            .title {
                font-size: 15px;
                font-weight: 500;
                margin: 4px 0;
            }

            span {
                background-color: #e8eaf0;
                border-radius: 3px;
                color: #666;
                font-size: 12px;
                font-weight: 400;
                padding: 2px 6px;
                line-height: 14px;
            }

        }
    }

}
</style>
