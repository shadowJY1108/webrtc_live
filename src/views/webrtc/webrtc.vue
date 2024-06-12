<template>
    <div id="container">

        <div v-if="!showRoom" class="pre_container">

            <div class="pre_main">
                <div class="pre_localvideo">
                    <video ref="localvideo" autoplay></video>
                </div>

                <div class="pre_device">
                    <div class="device">
                        <div id="mic">
                            <div class="mic-icon-box">
                                <button class="device-icon">
                                    <img src="../../assets/icons/麦克风.svg" alt="Icon">
                                </button>
                            </div>

                            <div class="arrow-background" @click="showAudioDevice">
                                <div class="arrow"></div>
                            </div>

                            <div class="device-select-card" ref="audioDeviceCard">
                                <div class="device-select">
                                    <span>选择麦克风</span>
                                    <select ref="audioSourceSelect" @change="changeAudioDevice"></select>
                                </div>
                            </div>

                        </div>

                        <div id="camera">
                            <div class="camera-icon-box">
                                <button class="device-icon">
                                    <img src="../../assets/icons/摄像头.svg" alt="Icon">
                                </button>
                            </div>

                            <div class="arrow-background" @click="showVideoDevice">
                                <div class="arrow"></div>
                            </div>

                            <div class="device-select-card" ref="videoDeviceCard">
                                <div class="device-select">
                                    <span>选择摄像头</span>
                                    <select ref="videoSourceSelect" @change="changeVideoDevice"></select>
                                </div>
                            </div>
                        </div>


                    </div>
                </div>

            </div>

            <div class="pre_info">
                <div class="pre_info_page">
                    <div class="pre_info_text">
                        <span>加入连麦直播</span>
                    </div>
                    <form ref="form" @submit.prevent="joinRoom">
                        <div class="input_confID">
                            <label for="confId">请输入连麦房间Id:</label>
                            <div class="confId">
                                <input type="text" name="roomId" v-model="roomId" placeholder="roomId" required>
                            </div>
                        </div>
                        <div class="join_conf">
                            <button type="submit" class="">开启</button>
                        </div>
                    </form>
                </div>
            </div>

        </div>

        <div v-if="showRoom" class="rtc-container">
            <div class="videoBox">

                <div class="grid-container grid-1" v-if="currentLayout === 1">
                    <div class="one">
                        <div class="placeholder"></div>
                        <div class="video-container">
                            <video class="video1" ref="video1" autoplay></video>
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
                            <div class="siteName-left">
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

                <!-- <div class="localvideo">
                    <video autoplay ref="localvideo"></video>
                </div> -->
            </div>

            <div class="setting-box">

                <div class="device">
                    <div id="mic">
                        <div class="mic-icon-box">
                            <button class="device-icon">
                                <img src="../../assets/icons/麦克风.svg" alt="Icon">
                                <!-- <span>静音</span> -->
                            </button>
                        </div>

                        <div class="arrow-background" @click="showAudioDevice">
                            <div class="arrow"></div>
                        </div>

                        <div class="device-select-card" ref="audioDeviceCard">
                            <div class="device-select">
                                <span>选择麦克风</span>
                                <select ref="audioSourceSelect" @change="changeAudioDevice"></select>
                            </div>
                        </div>

                    </div>

                    <div id="camera">
                        <div class="camera-icon-box">
                            <button class="device-icon">
                                <img src="../../assets/icons/摄像头.svg" alt="Icon">
                                <!-- <span>摄像机</span> -->
                            </button>
                        </div>

                        <div class="arrow-background" @click="showVideoDevice">
                            <div class="arrow"></div>
                        </div>

                        <div class="device-select-card" ref="videoDeviceCard">
                            <div class="device-select">
                                <span>选择摄像头</span>
                                <select ref="videoSourceSelect" @change="changeVideoDevice"></select>
                            </div>
                        </div>
                    </div>


                </div>

                <div class="setting-middle">

                    <div class="participant middle-Icon-box">
                        <div class="middle-Icon" @click="showParticipantFn">
                            <img src="../../assets/icons/与会者.svg" alt="" class="middle-icon-img">
                            <span class="middle-icon-text">成员管理</span>
                        </div>
                    </div>


                    <div class="bandwidth middle-Icon-box">
                        <div class="middle-Icon" @click="showBandWidthFn">
                            <img src="../../assets/icons/码率.svg" alt="" class="middle-icon-img">
                            <span class="middle-icon-text">码率</span>
                        </div>

                        <div v-if="showBandWidth" class="bandwidth-card middle-icon-card">
                            <div class="bandwidth-select">
                                <span>选择分辨率和码率</span>
                                <select id="bandwidthSelect" ref="bandwidthSelect"
                                    @change="selectCodeAndVideoResolution">
                                    <option value="    ">自适应</option>
                                    <option value="1920 1080 60 4096">1080P60FPS 4096kbps</option>
                                    <option value="1920 1080 30 2048">1080P30FPS 2048kbps</option>
                                    <option value="1280 720 60 1536">720P60FPS 1536kbps</option>
                                    <option value="1280 720 30 1024">720P30FPS 1024kbps</option>
                                    <option value="640 360 30 512">4CIF 512kbps</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div class="record  middle-Icon-box">
                        <div class="middle-Icon">
                            <img src="../../assets/icons/开播gray.svg" alt="" class="middle-icon-img">
                            <span class="middle-icon-text">录制</span>
                        </div>

                    </div>

                </div>

                <div class="setting-right">
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
                </div>

            </div>
        </div>

        <div v-if="showParticipant" class="participantCard">
            <ul>
                <li v-for="(user, index) in userList" :key="index">
                    <div class="nickname">
                        <span> {{ user.userId }}</span>

                    </div>
                    <div class="avatarIcon">
                        <div>
                            <img :src="user.avatar" alt="">
                        </div>
                        <div class="micIcon" @click="swtichRemoteMic(user.userId)">
                            <img src="../../assets/icons/麦克风静音.svg" alt="">
                        </div>
                        <div class="videoIcon" @click="swtichRemoteCamera(user.userId)">
                            <img src="../../assets/icons/开播gray.svg" alt="">
                        </div>
                    </div>

                </li>
            </ul>
        </div>

        <div class="background"></div>

    </div>
</template>

<script>
import { publishStream, playStream } from '@/api/api';
import { io } from "socket.io-client";

export default {
    name: 'join webrtc',
    data() {
        return {
            // socket: io('https://101.43.35.208:7001'),
            socket: null,

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
            roomId: '',   //指定的房间Id

            site: {},
            showBandWidth: false,
            showParticipant: false,
            showRoom: false,

            currentLayout: 1,  //默认布局为1
            currentStreams: {},
        }
    },

    mounted() {
        // 页面加载获取
        navigator.mediaDevices.enumerateDevices()
            .then(this.gotDevices)
            .then(this.getLocalStream)
            .catch(err => {
                console.error('获取设备出错：', err);
            })

    },

    methods: {
        // 0.加入房间
        joinRoom() {
            this.socket = io('https://101.43.35.208:7001')
            // 设置连接成功后的事件监听器
            this.socket.on('connect', async () => {
                const data = {
                    user: this.user,
                    roomId: this.roomId,
                };
                console.log('Socket connected:', this.user.nickname);
                this.socket.emit('joinRtcRoom', data);
                this.socketListeners();
                this.showRoom = !this.showRoom
                navigator.mediaDevices.enumerateDevices()
                    .then(this.gotDevices)
                    .catch(err => {
                        console.error('获取设备出错：', err);
                    })
            })
        },

        socketListeners() {
            this.socket.on('joined', data => {
                console.log(data);
                console.log(`receive ${data[0].userId} Joined room ${this.roomId}`);
                this.userList = data
                console.log(this.userList);
                this.publish()
            })

            // 监听到自己加入房间，遍历播放所有人
            this.socket.on('published', data => {
                console.log(`${data.userId} published`);
                this.updateLayout();
                for (const user of this.userList) {
                    console.log(user);
                    this.play(user.userId)
                }
            })

            // 监听到其他人加入otherJoin，播放other
            this.socket.on('otherPublished', data => {
                // play
                console.log('other published:', data);
                this.userList.push(data)
                this.updateLayout();
                this.play(data.userId)
            })

            // 离开房间
            this.socket.on('leaveRoom', data => {
                console.log('离开房间：', data.userId);
                this.userList = this.userList.filter(value => {
                    return value !== data.nickname;
                });
                this.pcs[data.userId].close()
                this.pcs[data.userId] = null
                console.log('leave room -> this.pcs:', this.pcs);
            })

            this.socket.on('disconnect', () => {
                console.log('Disconnected from server');
                this.pc.close()
                this.pc = null
            });

            // 监听answerSDP 推流的sdp,  注意不是play的SDP
            this.socket.on('answerSDP', async data => {
                console.log('receive publish answerSDP', data);
                await this.pc.setRemoteDescription(new RTCSessionDescription({ type: 'answer', sdp: data.sdp }));
                // const startBroadcast = this.$refs.startBroadcast
                // startBroadcast.style.display = 'none'
                // 当推流成功保存当前peer中的track
                this.currentVideoTrack = this.localStream.getVideoTracks()[0];
                this.currentAudioTrack = this.localStream.getAudioTracks()[0];
            })

            // 监听playAnswerSDP  播放的sdp
            this.socket.on('playAnswerSDP', async data => {
                const { userId, sdp, videoTag } = data;
                this.site[videoTag] = userId
                console.log('this.site', this.site);

                const stream = new MediaStream()
                const video = this.$refs[`video${videoTag}`]
                console.log('receive playAnswerSDP:', data);

                try {
                    // if (!this.pcs[nickname]) {
                    //   console.log('不存在');
                    // }     
                    this.pcs[userId].ontrack = e => {
                        console.log('play track event:', e)
                        stream.addTrack(e.track)
                        video.srcObject = stream
                    }
                    await this.pcs[userId].setRemoteDescription(new RTCSessionDescription({ type: 'answer', sdp: sdp }));
                    console.log(`set remoteDesc for play ${userId}`);
                } catch (err) {
                    console.error('Error setting remote description or handling track event:', err);
                }
            })
        },

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
                // video: true
                video: {
                    width: { min: 320, ideal: 384 },
                    height: { min: 180, ideal: 216 },
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
            const videoDeviceCard = this.$refs.videoDeviceCard
            videoDeviceCard.style.display = 'none'
            if (!this.pc) {
                console.log('No peerconnection found2');
                return;
            }
        },

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

                // 修改为根据推流信息创建指定传输器
                this.pc.addTransceiver("audio", { direction: "sendrecv" });
                this.pc.addTransceiver("video", { direction: "sendrecv" });

                // 3.将本地流的 track 添加到 PeerConnection
                this.localStream.getTracks().forEach(track => {
                    this.pc.addTrack(track, this.localStream);
                });

                // 4.创建本地 offer，添加本地描述
                const offer = await this.pc.createOffer();
                // offer.sdp = this.setBandwidth(offer.sdp);

                console.log('publish  offer:', offer);
                await this.pc.setLocalDescription(offer);

                const data = {
                    userId: this.user.nickname,
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
                console.log('set localDesc for play:', offer);

                const data = {
                    'userId': us,
                    'roomId': this.roomId,
                    'sdp': offer.sdp
                };
                // console.log('playOfferSDP:', data);
                this.socket.emit('playOfferSDP', data)
                // const answer = await playStream(httpURL, data)
                // await pc.setRemoteDescription(new RTCSessionDescription({ type: 'answer', sdp: answer.sdp }));

            } catch (error) {
                console.error('Error play stream:', error);
            }

        },

        swtichRemoteMic(remoteId) {
            this.pcs[remoteId].getReceivers().forEach(receiver => {
                if (receiver.track.kind === 'audio') {
                    receiver.track.enabled = !receiver.track.enabled
                }
            });
        },

        swtichRemoteCamera(remoteId) {
            this.pcs[remoteId].getReceivers().forEach(receiver => {
                if (receiver.track.kind === 'video') {
                    receiver.track.enabled = !receiver.track.enabled
                }
            });
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
            const userCount = Object.keys(this.userList).length;
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

        // 6. 修改sdp修改带宽 
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

        // 修改码率
        setCodeRate(newParam) {
            this.pc.getSenders().forEach(sender => {
                if (sender.track.kind === 'aduio') {
                    return;
                }
                let param = sender.getParameters()
                param.encodings[0].maxBitrate = newParam
                sender.setParameters(param)
                    .then(() => {
                        console.log('set maxBitrate sucess!');
                    })
                    .catch(err => {
                        console.error("set MaxBitrate error!" + err.name);
                    })
            })
        },
        setVideoResolution(width, height, frameRate) {
            let videoTrack = this.localStream.getVideoTracks()[0]
            let constraints = {
                width: { exact: width },
                height: { exact: height },
                frameRate: { exact: frameRate }
            };
            videoTrack.applyConstraints(constraints)
                .then(() => {
                    console.log('update VideoResolution sucess:', width, height);
                })
                .catch(err => {
                    console.warn('update VideoResolution err:', err);
                    alert('无法应用新的分辨率，请检查摄像机是否支持', err)
                })
        },

        selectCodeAndVideoResolution() {
            const bandwidthSelectValue = this.$refs.bandwidthSelect.value
            const values = bandwidthSelectValue.split(' ');
            // 分别获取分辨率和码率
            let width = values[0];
            let height = values[1]
            let frameRate = values[2]
            let bitrate = values[3] * 1000;
            console.log('bandwith:', values);
            this.setCodeRate(bitrate)
            this.setVideoResolution(width, height, frameRate)
        },

        // setting btn
        showParticipantFn() {
            // const showBox = this.$refs.participantCard
            this.showParticipant = !this.showParticipant
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
                    width: { min: 320, ideal: 800 },
                    height: { min: 180, ideal: 450 },
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
        },

        showAudioDevice() {
            const audioDeviceCard = this.$refs.audioDeviceCard
            const videoDeviceCard = this.$refs.videoDeviceCard
            if (audioDeviceCard.style.display === 'block') {
                audioDeviceCard.style.display = 'none'
            } else {
                audioDeviceCard.style.display = 'block'
                videoDeviceCard.style.display = 'none'
            }
        },

        showVideoDevice() {
            const videoDeviceCard = this.$refs.videoDeviceCard
            const audioDeviceCard = this.$refs.audioDeviceCard
            if (videoDeviceCard.style.display === 'block') {
                videoDeviceCard.style.display = 'none'
            } else {
                videoDeviceCard.style.display = 'block'
                audioDeviceCard.style.display = 'none'
            }
        },

        showBandWidthFn() {
            this.showBandWidth = !this.showBandWidth
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
    height: 100%;
    display: flex;
    position: relative;
    justify-content: center;
    align-items: center;
}

.background {
    background-image: url('../../assets/background.webp');
    width: 100%;
    height: 100%;
    position: absolute;
    background-size: cover;
    z-index: -20;
}

.pre_container {
    height: 450px;
    display: flex;
    justify-content: center;

    .pre_main {
        position: relative;
        width: 800px;
        height: 450px;
        background-color: #dee0e3;
        border-radius: 8px;
        outline: gold;


        .pre_localvideo {
            width: 100%;
            height: 100%;

            video {
                width: 100%;
                height: 100%;
                border-radius: 8px;
            }
        }

        .pre_device {
            position: absolute;
            width: 200px;
            bottom: 10px;
            left: 0;
            right: 0;
            margin: auto;
        }
    }

    .pre_info {
        width: 320px;
        height: 450px;
        background-color: white;
        box-shadow: 0 10px 60px 10px rgba(31, 35, 41, .1);
        border-radius: 8px;
        margin-left: 12px;
        display: flex;
        justify-content: center;
        align-items: center;

        .pre_info_page {
            width: 210px;
            height: 264px;
            display: flex;
            flex-direction: column;


            .pre_info_text {
                flex: 1;
                /* background-color: pink; */
                font-size: 22px;
                font-weight: 700;
            }

            form {
                flex: 2;
                width: 100%;
                display: flex;
                flex-direction: column;
                justify-content: space-around;

                .input_confID {
                    width: 100%;
                    height: 70px;
                    border-radius: 8px;

                    label {
                        font-size: 12px;
                        color: rgb(31, 35, 41)
                    }

                    .confId {
                        width: 100%;
                        height: 40px;
                        margin-top: 8px;
                        padding: 2px 6px;
                        display: flex;
                        box-sizing: border-box;
                        outline: none;
                        border: 1px solid rgb(208, 211, 214);
                        border-radius: 6px;

                        input {
                            /* flex: 1; */
                            border: 0;
                            color: rgb(31, 35, 41);
                            width: 100%;
                            height: 36px;
                            border-radius: 6px;
                            font-size: 14px;
                            padding: 0;
                            outline: none;
                            user-select: auto;
                            background: transparent;
                        }
                    }

                }

                .join_conf {
                    width: 100%;
                    text-align: center;
                    margin-top: 20px;

                    button {
                        width: 100%;
                        height: 40px;
                        border-radius: 6px;
                        background-color: rgb(53, 189, 75);
                        color: white;
                        font-size: 16px;
                        font-weight: 500;
                    }
                }

            }
        }

    }
}

.rtc-container {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
}

.videoBox {
    width: 100%;
    height: calc(100% - 40px);
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
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .grid-1 .one {
        width: 55%;
        outline: auto;
        position: relative;
        background-color: rgb(241 243 244);
        border-radius: 6px;

        .video-container {
            padding-bottom: 56.25%;
            height: 0;
            position: relative;
            border-radius: 6px;

            video {
                position: absolute;
                top: 0;
                right: 0;
                width: 100%;
                height: 100%;
                display: block;
                border-radius: 6px;
                object-fit: cover;
            }
        }

        .placeholder {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            border-radius: 6px;
            background-color: #ddd;
            box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.5);
            z-index: -1;
        }
    }

    .grid-2 .two {
        position: relative;
        border-radius: 8px;
        display: flex;
        align-items: center;

        .video-container {
            width: 900px;
            height: 506px;
            outline: gold 2px solid;
            border-radius: 6px;

            video {
                width: calc(100% - 4px);
                display: block;
                border-radius: 6px;
                object-fit: cover;
            }
        }
    }


    .grid-4 {
        display: grid;
        grid-template-rows: auto auto;
        grid-template-columns: auto auto;
        align-content: center;

        .four {
            position: relative;
            outline: gold 2px solid;
            border-radius: 6px;
            width: 752px;
            height: 423px;

            .video-container {
                border-radius: 6px;

                .siteName-left {
                    display: flex;
                    align-items: center;
                    position: absolute;
                    bottom: 5px;
                    left: 10px;
                    height: 22px;
                    line-height: 22px;
                    padding: 2px;
                    background-color: rgb(237, 237, 237);
                    border-radius: 6px;
                    font-size: 12px;
                    text-align: center;

                    img {
                        width: 14px;
                        margin: 0 3px;
                    }
                }

                .video1,
                .video3,
                .video2,
                .video4 {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    border-radius: 8px;
                }
            }



        }
    }

}

.setting-box {
    display: flex;
    height: 40px;
    background-color: pink;
    justify-content: center;


    .setting-middle {
        display: flex;
        justify-content: center;
        flex: 6;

        .middle-Icon-box {
            position: relative;
            margin: 0 10px;

            .middle-Icon {
                display: flex;
                flex-direction: column;
                align-items: center;
                cursor: pointer;
                padding: 2px 8px;
                border-radius: 3px;

                .middle-icon-img {
                    width: 20px;
                    height: 20px;
                }

                .middle-icon-text {
                    font-size: 12px;
                }

            }

            .middle-icon-card {
                position: absolute;
                bottom: 40px;
                left: -100%;
                padding: 10px;
                background-color: #fff;
                border-radius: 8px;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                font-size: 12px;

                .bandwidth-select {
                    display: flex;
                    flex-direction: column;

                    span {
                        font-size: 12px;
                        padding: 4px 0;
                    }

                    select {
                        border: 1px solid #ccc;
                        outline: none;
                        padding: 10px 8px;
                        margin-bottom: 8px;
                        border-radius: 6px;
                        background-color: #f0f0f0;
                        font-size: 14px;
                        cursor: pointer;
                    }
                }

            }

            .middle-Icon:hover {
                background-color: rgb(197, 196, 196);
            }

        }

    }

    .setting-right {
        flex: 1;
        justify-content: flex-start;

        .grid-icon-btn {
            width: 110px;
            display: flex;
            align-items: center;
            height: 20px;
            margin: 6px 10px 6px 40px;
            padding: 4px;
            border-radius: 6px;
            cursor: pointer;
            position: relative;
            flex: 1;

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
    }

}

.device {
    display: flex;
    /* height: 100%; */

    #mic,
    #camera {
        margin: 3px 10px;
        display: flex;
        position: relative;

        .mic-icon-box,
        .camera-icon-box {
            .device-icon {
                display: flex;
                align-items: center;
                flex-direction: column;
                border: none;
                background-color: white;
                cursor: pointer;
                padding: 4px 10px;
                box-sizing: border-box;
                border-top-left-radius: 6px;
                border-bottom-left-radius: 6px;

                img {
                    width: 26x;
                    height: 26px;
                }

            }

        }

        .arrow-background {
            position: relative;
            padding: 0 2px;
            width: 20px;
            height: 34px;
            background-color: white;
            border-top-right-radius: 6px;
            border-bottom-right-radius: 6px;

            .arrow {
                position: absolute;
                top: calc(50% - 2px);
                width: 8px;
                height: 8px;
                border-right: 1px solid black;
                border-bottom: 1px solid black;
                cursor: pointer;
                transform: rotate(-135deg);
                z-index: 10;
                left: 0;
                right: 0;
                margin: auto;
            }
        }

        .arrow-background:hover {
            background-color: rgb(172, 172, 172);
        }

        .device-select-card {
            position: absolute;
            display: none;
            bottom: 40px;
            padding: 10px;
            background-color: #fff;
            border-radius: 8px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);

            .device-select {
                display: flex;
                flex-direction: column;

                span {
                    /* background-color: gray; */
                    font-size: 12px;
                    padding: 4px 0;
                }

                select {
                    border: 1px solid #ccc;
                    outline: none;
                    padding: 10px 8px;
                    margin-bottom: 8px;
                    border-radius: 6px;
                    background-color: #f0f0f0;
                    font-size: 14px;
                    cursor: pointer;

                    /* 隐藏默认箭头 */
                    /* appearance: none;    */
                    option {
                        height: 36px;
                        cursor: pointer;
                        padding: 20px;
                    }
                }
            }

        }
    }



}


.participantCard {
    width: 115px;
    background-color: whitesmoke;
    text-align: center;

    ul {
        padding: 5px 4px;

        li {
            list-style: none;
            display: flex;
            flex-direction: column;

            .nickname {
                text-align: left;

                span {
                    color: blue;
                    font-size: 14px;
                    /* background-color: rgb(212, 210, 210); */
                }
            }

            .avatarIcon {
                display: flex;
                justify-content: space-around;
                align-items: center;
                /* background-color: aquamarine; */

                img {
                    width: 48px;
                    height: 48px;
                    border-radius: 24px;
                }

                .micIcon,
                .videoIcon {
                    img {
                        width: 20px;
                        height: 20px;
                    }
                }

                .micIcon:hover,
                .videoIcon:hover {
                    transform: translateY(3px);
                }
            }


        }
    }

}
</style>