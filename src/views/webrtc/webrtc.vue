<template>
    <div id="container">

        <div class="rtc-container">
            <div class="videoBox">
                <div class="grid-container grid-1" v-if="currentLayout === 1">
                    <div class="one">
                        <div class="placeholder"></div>
                        <div class="video-container">
                            <video class="video1" ref="video1" autoplay></video>
                            <div class="startBroadcast" ref="startBroadcast">
                                <input type="button" value="开启连麦" @click="publish">
                            </div>
                        </div>

                    </div>

                </div>
                <div class="grid-container grid-2" v-if="currentLayout === 2">
                    <div class="two">
                        <div class="video-container">
                            <video ref="video1" autoplay></video>
                        </div>

                    </div>
                    <div class="two">
                        <div class="video-container">
                            <video ref="video2" autoplay></video>
                        </div>
                    </div>
                </div>
                <div class="grid-container grid-4" v-if="currentLayout === 4">
                    <div class="four">
                        <div class="video-container">
                            <video ref="video1" class="video1" autoplay></video>
                            <div class="siteName-left">
                                <img src="../../assets/icons/麦克风静音.svg" alt="">
                                <span>{{ site[1] }}</span>
                            </div>

                        </div>
                    </div>
                    <div class="four">
                        <div class="video-container">
                            <video ref="video2" class="video2" autoplay></video>
                            <div class="siteName-right">
                                <img src="../../assets/icons/麦克风静音.svg" alt="">
                                <span>{{ site[2] }}</span>
                            </div>
                        </div>
                    </div>
                    <div class="four">
                        <div class="video-container">
                            <video ref="video3" class="video3" autoplay></video>
                        </div>
                    </div>
                    <div class="four">
                        <div class="video-container">
                            <video ref="video4" class="video4" autoplay></video>
                        </div>
                    </div>
                </div>
                <div class="localvideo">
                    <video autoplay ref="localvideo"></video>
                </div>
            </div>

            <div class="setting-box">

                <div class="device-icon-btn">
                    <select class="arrow" ref="audioSourceSelect" @change="changeAudioDevice"></select>
                    <select class="arrow" ref="videoSourceSelect" @change="changeVideoDevice"></select>

                    <button @click="show">与会者</button>
                </div>

                <div class="grid-icon-btn" @click="toChangeGrid">
                    <div class="grid-icon">
                        <span>■</span>
                        <span>■</span>
                        <span>■</span>
                        <span>■</span>
                    </div>
                    <div class="grid-icon-text">
                        <div>宫格视图</div>
                        <div class="arrow"></div>
                    </div>
                    <div class="grid-card" ref="gridCard">
                        <div class="grid-card-layout">
                            <div class="grid-card-1" @click="changeLayout(1)">
                                <img src="../../assets/icons/一宫.svg" alt="">
                            </div>
                            <div @click="changeLayout(2)">
                                <img src="../../assets/icons/两宫.svg" alt="">
                            </div>
                            <div @click="changeLayout(4)">
                                <img src="../../assets/icons/四宫.svg" alt="">
                            </div>
                        </div>

                    </div>
                </div>




                <!-- <div>
                <button class="popup" @mouseenter="showPopup = true"></button>
            </div> -->

                <div v-if="showPopup" class="popup" @mouseleave="showPopup = false">
                    <div>
                        <ul>
                            <li v-if="userList"><img :src="userList[0].avatar" alt=""></li>
                            <li>2</li>
                        </ul>
                    </div>
                </div>

            </div>
        </div>


        <div class="showBox" ref="showBox">
            <span>123</span>
        </div>

        <div class="background">

        </div>

    </div>
</template>

<script>
import { publishStream, playStream } from '@/api/api';
import { io } from "socket.io-client";

export default {
    name: 'join webrtc',
    data() {
        return {
            socket: io('https://101.43.35.208:7001'),

            pc: null,   //推流pc
            pcs: {},    //播放拉流pcs
            state: '',

            localStream: null,
            currentVideoTrack: '',    //current代表pc中track，用于replacetrack
            currentAudioTrack: '',

            user: {
                nickname: this.$store.getters.userInfo.userId,
                avatar: this.$store.getters.userInfo.avatar,
            },  //自己
            userList: [],   //房间所有人，存放user
            roomId: 1234,   //指定的房间Id

            site: {},
            showPopup: false,

            currentLayout: 1,  //默认布局为1
            currentStreams: {},

            flag: false,
        }
    },

    mounted() {
        this.socket.on('connect', () => {
            console.log('Socket connected:', this.user.nickname);
            // 页面加载直接发一条加入房间的消息
            // this.socket.emit('joinRoom', {
            //     nickname: this.nickname,
            //     roomId: this.roomId
            // })
        });

        // 监听加入连麦的主播
        this.socket.on('published', data => {
            console.log(data.nickname + '加入了连麦：' + data.videoTag);
            // this.state = 'joined'
            // console.log('update: state=', this.state);
            this.userList = data.userList
            console.log('房间列表：', this.userList);
            this.updateLayout();

            // 播放
            for (let user of this.userList) {
                this.play(user.nickname);
            }
        })

        // 监听到其他人加入otherJoin
        this.socket.on('otherPublished', data => {
            // play
            console.log('other published:', data.nickname, data.videoTag);
            this.userList = data.userList
            this.updateLayout();
            this.play(data.nickname)
            // for (let i = 0; i < this.userList.length; i++) {
            //     this.play(this.userList[i])
            //     console.log('play other:');
            // }
        })

        // 离开房间
        this.socket.on('leaveRoom', data => {
            console.log('离开房间：', data.nickname);
            this.userList = this.userList.filter(value => {
                return value !== data.nickname;
            });
            this.pcs[data.nickname].close()
            this.pcs[data.nickname] = null
            console.log(' this.pcs:', this.pcs);
        })

        // 监听answerSDP 推流的sdp
        this.socket.on('answerSDP', async data => {
            console.log('answerSDP', data);
            await this.pc.setRemoteDescription(new RTCSessionDescription({ type: 'answer', sdp: data.sdp }));
            const startBroadcast = this.$refs.startBroadcast
            startBroadcast.style.display = 'none'
            // 当推流成功保存当前peer中的track
            this.currentVideoTrack = this.localStream.getVideoTracks()[0];
            this.currentAudioTrack = this.localStream.getAudioTracks()[0];
        })

        // 监听playAnswerSDP  播放的sdp
        this.socket.on('playAnswerSDP', async data => {
            const { nickname, sdp, videoTag } = data;
            this.site[videoTag] = nickname
            console.log('this.site', this.site);

            const stream = new MediaStream()
            const video = this.$refs[`video${videoTag}`]
            console.log('playAnswerSDP:', data);
            try {
                this.pcs[nickname].ontrack = e => {
                    console.log('track event:', e)
                    stream.addTrack(e.track)
                    video.srcObject = stream
                }
                await this.pcs[nickname].setRemoteDescription(new RTCSessionDescription({ type: 'answer', sdp: sdp }));
                console.log(`Remote description set for ${nickname}`);

            } catch (err) {
                console.error('Error setting remote description or handling track event:', err);
            }
        })

        // 页面加载获取
        navigator.mediaDevices.enumerateDevices()
            .then(this.gotDevices)
            .then(this.getLocalStream)
            .catch(err => {
                console.error('获取设备出错：', err);
            })

    },
    methods: {
        // 1.本地流
        async getLocalStream() {
            const videoSourceSelect = this.$refs.videoSourceSelect;
            const videoSource = videoSourceSelect.value;
            const audioSourceSelect = this.$refs.audioSourceSelect;
            const audioSource = audioSourceSelect.value;

            const constraints = {
                audio: {
                    deviceId: audioSource ? { exact: audioSource } : undefined
                },
                video: {
                    width: { min: 320, ideal: 384 },
                    height: { min: 180, ideal: 240 },
                    deviceId: videoSource ? { exact: videoSource } : undefined,
                    aspectRatio: 16 / 9
                },
            }
            try {
                this.localStream = await navigator.mediaDevices.getUserMedia(constraints);
                const localvideo = this.$refs.localvideo;
                localvideo.srcObject = this.localStream;
                // this.updataLocalStream(this.localStream)
            } catch (error) {
                console.error('Error accessing media devices.', error);
                alert('无法访问摄像头和麦克风，请检查权限设置或设备连接。');
            }
        },

        // 1.1 
        gotDevices(deviceInfos) {
            const audioSourceSelect = this.$refs.audioSourceSelect;
            const videoSourceSelect = this.$refs.videoSourceSelect;
            // const selectors = [audioSourceSelect, videoSourceSelect];
            deviceInfos.forEach(deviceInfo => {
                var option = document.createElement('option');
                option.text = deviceInfo.label;
                option.value = deviceInfo.deviceId;
                if (deviceInfo.kind === 'audioinput') {
                    audioSourceSelect.appendChild(option);
                } else if (deviceInfo.kind === 'videoinput') {
                    videoSourceSelect.appendChild(option);
                }
            });
        },

        // 2.本地流设备切换
        updateLocalStreamWithNewTrack(type, newTrack) {
            const tracks = type === 'video' ? this.localStream.getVideoTracks() : this.localStream.getAudioTracks();
            tracks.forEach(track => this.localStream.removeTrack(track));
            this.localStream.addTrack(newTrack);
            if (!this.pc) {
                console.log('No peerconnection found2');
                return;
            }
        },

        // 3. 推流
        async publish() {
            if (this.pc !== null && this.pc !== undefined) {
                console.log("已开始推流");
                return;
            }

            try {
                // 1.获取本地流

                // 2.创建 PeerConnection
                // 注意添加顺序为audio、video,后续RTCPeerConnection创建offer时SDP的m线顺序遵循此顺序创建，SRS自带的信令服务器响应的SDP中m线总是先audio后video。
                // 若本端SDP和远端SDP中的m线顺序不一直，则设置远端描述时会异常，显示offer中的m线与answer中的m线顺序不匹配
                this.pc = new RTCPeerConnection();
                this.pc.addTransceiver("audio", { direction: "recvonly" });
                this.pc.addTransceiver("video", { direction: "recvonly" });

                // 3.将本地流的 track 添加到 PeerConnection
                this.localStream.getTracks().forEach(track => {
                    this.pc.addTrack(track, this.localStream);
                });

                // 4.创建本地 offer，添加本地描述
                const offer = await this.pc.createOffer();
                offer.sdp = this.setBandwidth(offer.sdp);
                console.log('publish  offer:', offer);
                await this.pc.setLocalDescription(offer);

                const data = {
                    user: this.user,
                    roomId: this.roomId,
                    sdp: offer.sdp
                };

                // 5.发送 offer 到服务器,接收answer 
                // const answer = await publishStream(httpURL, data);
                // 改用signal server 转发
                this.socket.emit('publish', data)

                // 设置远程描述,这里不再设置，监听远程sdp事件由客户端设置远程描述
                // await this.pc.setRemoteDescription(new RTCSessionDescription({ type: 'answer', sdp: answerSPD.sdp }));

            } catch (err) {
                console.error('Error publishing stream:', err);
            }


        },

        // 4. 拉流
        async play(us) {

            try {
                const pc = new RTCPeerConnection()
                this.pcs[us] = pc
                console.log('this.pcs:', this.pcs);
                this.pcs[us].addTransceiver("audio", { direction: "recvonly" });
                this.pcs[us].addTransceiver("video", { direction: "recvonly" });

                const offer = await this.pcs[us].createOffer()
                await this.pcs[us].setLocalDescription(offer)
                // const modifiedSdp = this.setBandwidth(offer.sdp);

                console.log('play offer:', offer);

                const data = {
                    'nickname': us,
                    'roomId': this.roomId,
                    'sdp': offer.sdp
                };
                console.log('playOfferSDP:', data);
                this.socket.emit('playOfferSDP', data)
                // const answer = await playStream(httpURL, data)
                // await pc.setRemoteDescription(new RTCSessionDescription({ type: 'answer', sdp: answer.sdp }));

            } catch (error) {
                console.error('Error play stream:', error);
            }

        },

        // 5.1 手动布局
        async changeLayout(layout) {
            for (let i = 1; i <= 4; i++) {
                const video = this.$refs[`video${i}`];
                if (video && video.srcObject) {
                    this.currentStreams[`video${i}`] = video.srcObject
                    // 暂停当前的srcObject
                    video.pause();
                }
            }
            // await new Promise((resolve) => setTimeout(resolve, 0));
            this.currentLayout = layout
            await new Promise((resolve) => setTimeout(resolve, 0));
            for (let i = 1; i <= layout; i++) {
                const video = this.$refs[`video${i}`];
                if (video) {
                    // 如果之前保存了srcObject，将其重新赋给对应的video元素
                    if (this.currentStreams[`video${i}`]) {
                        console.log(this.currentStreams[`video${i}`]);
                        video.srcObject = this.currentStreams[`video${i}`];
                        // video.play();
                    }
                }
            }
        },

        // 5.2 自动分屏
        updateLayout() {
            const userCount = this.userList.length;
            let layout;
            if (userCount === 1) {
                layout = 1;
            } else if (userCount === 2) {
                layout = 2;
            } else if (userCount >= 3 && userCount <= 4) {
                layout = 4;
            } else {
                // 超过4个用户，暂不考虑
                layout = 4;
            }
            this.changeLayout(layout);
        },

        // 6. 修改sdp
        setBandwidth(sdp) {
            // 将分辨率设置为较低的值
            const lowResolution = {
                width: 320,
                height: 180
            }

            const bandwidthLine = 'b=AS:256'; // 设置带宽为500kbps
            const modifiedSdp = sdp.replace(/(m=video.*)\r\n/, `\$1\r\n${bandwidthLine}\r\n`);

            return modifiedSdp;
        },


        // setting btn
        show() {
            const showBox = this.$refs.showBox
            if (this.flag) {
                showBox.style.display = 'none'
                this.flag = false
            } else {
                showBox.style.display = 'block'
                this.flag = true
            }

        },

        // peer 中切换媒体
        async replaceTracks(currentTrack, newTrack, type) {
            console.log({ currentTrack, newTrack, type });
            const senders = this.pc.getSenders();
            for (const sender of senders) {
                if (sender.track && sender.track.kind === type) {
                    await sender.replaceTrack(newTrack);
                }
            }
            // 更换媒体设备后更新current
            if (type === 'video') {
                this.currentVideoTrack = newTrack;
            } else if (type === 'audio') {
                this.currentAudioTrack = newTrack;
            }
        },

        async changeVideoDevice() {
            const videoSourceSelect = this.$refs.videoSourceSelect;
            const videoSource = videoSourceSelect.value;
            const newConstraints = {
                video: {
                    width: { min: 320, ideal: 384 },
                    height: { min: 180, ideal: 240 },
                    deviceId: videoSource ? { exact: videoSource } : undefined,
                    aspectRatio: 16 / 9
                },
                audio: false
            };

            try {
                const newLocalVideoStream = await navigator.mediaDevices.getUserMedia(newConstraints);
                console.log('newLocalVideoStream:', newLocalVideoStream);
                const newVideoTrack = newLocalVideoStream.getVideoTracks()[0];
                this.updateLocalStreamWithNewTrack('video', newVideoTrack)
                if (!this.pc) {
                    console.log('No peerconnection found1');
                    return
                }

                if (this.currentVideoTrack instanceof CanvasCaptureMediaStreamTrack) {
                    console.log('canvas-->camera成功:', this.currentVideoTrack.label);
                } else {
                    await this.replaceTracks(this.currentVideoTrack, newVideoTrack, 'video');
                    console.log('camera-->成功', newVideoTrack);
                }
            } catch (err) {
                console.error('Error getting new media stream:', err);
            }
        },

        async changeAudioDevice() {
            const audioSourceSelect = this.$refs.audioSourceSelect;
            const audioSource = audioSourceSelect.value;
            const newConstraints = {
                video: false,
                audio: {
                    deviceId: audioSource ? { exact: audioSource } : undefined
                }
            };

            try {
                const newLocalAudioStream = await navigator.mediaDevices.getUserMedia(newConstraints);
                const newAudioTrack = newLocalAudioStream.getAudioTracks()[0];
                this.updateLocalStreamWithNewTrack('audio', newAudioTrack)
                if (!this.pc) {
                    console.log('No peerconnection found');
                    return
                }

                if (newAudioTrack) {
                    await this.replaceTracks(this.currentAudioTrack, newAudioTrack, 'audio');
                    console.log('Audio switch successful:', newAudioTrack);
                }
            } catch (err) {
                console.error('Error getting new media stream:', err)
            }
        },

        toChangeGrid() {
            const gridCard = this.$refs.gridCard
            if (gridCard.style.display === 'block') {
                gridCard.style.display = 'none'
            } else {
                gridCard.style.display = 'block'
            }

        }


    },

    beforeDestroy() {
        // 关闭 PeerConnection
        if (this.pc) {
            this.pc.close();
            this.pc = null;
        }
    }



}



</script>

<style scoped>
#container {
    width: 100%;
    /* height: calc(100% - 5px); */
    height: 100%;
    display: flex;
    position: relative;

}

.showBox {
    width: 160px;
    height: 100%;
    background-color: bisque;
    display: none;
}

.background {
    background-image: url('../../assets/background.webp');
    width: 100%;
    height: calc(100% + 60px);
    position: absolute;
    background-size: cover;
    top: -60px;
    z-index: -20;

}

.rtc-container {
    display: flex;
    flex-direction: column;
    /* width: 100%; */
    flex-grow: 1;
    height: 100%;
}

.videoBox {
    /* outline: auto; */
    width: 100%;
    height: 100%;
    position: relative;

    .localvideo {
        position: absolute;
        top: auto;
        bottom: 0;
        left: 0;
        right: auto;
        width: 200px;
        height: 200px;
        border-radius: 100px;
        background-color: yellow;

        video {
            width: 100%;
            height: 100%;
            display: block;
            border-radius: 100px;
            object-fit: cover;
        }
    }

    .grid-1,
    .grid-2,
    .grid-4 {
        width: 100%;
        height: 100%;
    }

    .grid-1 {
        display: flex;
        justify-content: center;
        align-items: center;

        .one {
            width: 70%;
            outline: auto;
            position: relative;
            background-color: rgb(241 243 244);

            .video-container {
                padding-bottom: 56.25%;
                height: 0;
                position: relative;
                border-radius: 8px;
            }

            video {
                position: absolute;
                top: 0;
                right: 0;
                width: 100%;
                height: 100%;
                display: block;
                border-radius: 2px;
                object-fit: cover;
            }

            .startBroadcast {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background-color: #4CAF50;
                /* padding: 40px 80px; */
                border-radius: 5px;
            }

            .startBroadcast input[type="button"] {
                border: none;
                color: blue;
                font-weight: 700;
                padding: 40px 80px;
                text-align: center;
                text-decoration: none;
                display: inline-block;
                font-size: 20px;
                border-radius: 5px;
                cursor: pointer;
                transition: background-color 0.3s;
            }

            .startBroadcast input[type="button"]:hover {
                opacity: 0.7;
                background-color: #45a049;
            }

            .placeholder {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                border-radius: 8px;
                background-color: #ddd;
                /* 占位颜色 */
                box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.5);
                z-index: -1;

            }


        }


    }

    .grid-2 {
        display: flex;
        justify-content: center;
        /* align-items: center; */

        .two {
            position: relative;
            width: calc(50% - 14px);
            height: calc(90% - 12px);
            background-color: rgb(241 243 244);
            border-radius: 8px;
            outline: gold 2px solid;
            margin: 0 5px;

            .video-container {
                position: absolute;
                top: 50%;
                transform: translateY(-50%);
                left: 0;
                width: 100%;
                border-radius: 8px;

                video {
                    width: calc(100% - 4px);
                    display: block;
                    border-radius: 8px;
                    object-fit: cover;
                    margin: 2px;

                }
            }


        }
    }

    .grid-4 {
        display: flex;
        justify-content: center;
        flex-wrap: wrap;

        .four {
            width: 38%;
            position: relative;
            margin: 3px 5px;
            outline: gold 2px solid;
            border-radius: 8px;

            .video-container {
                padding-bottom: 56.25%;
                /* 16:9 宽高比 */
                height: 0;
                position: relative;
                border-radius: 8px;
                /* background-color: rgb(241 243 244); */

                .siteName-left {
                    display: flex;
                    align-items: center;
                    height: 22px;
                    padding: 2px;
                    /* background-color: rgb(185, 185, 185); */
                    background-color: white;
                    border-radius: 6px;
                    position: absolute;
                    bottom: 4px;
                    left: 10px;
                    font-size: 12px;
                    color: black;
                    text-align: center;
                    line-height: 22px;

                    img {
                        width: 14px;
                        margin: 0 3px;
                    }
                }

                .siteName-right {
                    display: flex;
                    align-items: center;
                    height: 22px;
                    padding: 2px;
                    /* background-color: rgb(185, 185, 185); */
                    background-color: white;
                    border-radius: 6px;
                    position: absolute;
                    bottom: 4px;
                    right: 10px;
                    font-size: 12px;
                    color: black;
                    text-align: center;
                    line-height: 22px;

                    img {
                        width: 14px;
                        margin: 0 3px;
                    }
                }

                .video1,
                .video3 {
                    position: absolute;
                    /* background-color: blue; */
                    top: 0;
                    right: 0;
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    border-radius: 8px;
                    /* outline: gold 2px solid; */
                }

                .video2,
                .video4 {
                    position: absolute;
                    /* background-color: pink; */
                    top: 0;
                    left: 0;
                    height: 100%;
                    width: 100%;
                    object-fit: cover;
                    border-radius: 8px;
                    /* outline: gold 2px solid; */
                }
            }



        }
    }

}



.setting-box {
    display: flex;
    height: 40px;
    background-color: white;

    .grid-icon-btn {
        display: flex;
        align-items: center;
        height: 20px;
        margin: 6px 10px 6px 40px;
        padding: 4px;
        border-radius: 6px;
        cursor: pointer;
        position: relative;

        .grid-icon {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            grid-template-rows: repeat(2, 1fr);
            gap: 0;
            width: 20px;
            height: 20px;
            border-radius: 4px;
            margin-right: 4px;

            span {
                font-size: 16px;
                color: #000;
                line-height: 6px;
                width: 6px;
                height: 6px;
                border-radius: 4px;
            }
        }

        .grid-icon-text {
            font-size: 15px;
            font-family: Arial, sans-serif;
            display: flex;
            align-items: center;
            line-height: 20px;

            .arrow {
                width: 0;
                height: 0;
                border-right: 6px solid transparent;
                border-left: 6px solid transparent;
                border-top: 6px solid #000;
                margin-left: 5px;
            }
        }

        .grid-card {
            position: absolute;
            bottom: 40px;
            left: -45px;
            width: 180px;
            max-width: 300px;
            height: 40px;
            padding: 20px;
            background-color: #fff;
            border-radius: 8px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            text-align: center;
            display: none;

            .grid-card-layout {
                display: flex;
                justify-content: space-between;

                div {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    width: 30px;
                    height: 30px;
                    padding: 4px;
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                    border-radius: 4px;
                    outline: auto;

                    img {
                        width: 24px;
                        height: 24px;
                    }
                }

                div:hover {
                    outline: gold 2px solid;
                }


            }

        }

    }



    .grid-icon-btn:hover {
        background-color: #e0e0e0;
    }

    .popup {
        width: 120px;
        height: 60px;
        background-color: yellow;

        ul,
        li {
            img {
                width: 48px;
            }

        }
    }
}
</style>