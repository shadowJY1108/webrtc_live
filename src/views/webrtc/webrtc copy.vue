<template>
    <div class="videoBox">
        <video ref="localvideo" id="localvideo" autoplay></video>
        <video ref="remotevideo" id="remotevideo" autoplay></video>
        <video ref="video3" id="video3" autoplay></video>
        <video ref="video4" id="video4" autoplay></video>
    </div>
    

    <div class="btn">
        <button @click="publish">开播</button>
        <button @click="play">播放</button>
    </div>
</template>

<script>
import { publishStream, playStream } from '@/api/api';

export default {
    name: 'join webrtc',
    data() {
        return {
            pc: null,
            // playpc:null,
            localStream: null,
            remoteStream: null,
        }
    },

    methods: {
        async publish() {
            if (this.pc !== null && pc !== undefined) {
                console.log("已开始推流");
                return;
            }
            const httpURL = "https://47.100.101.44:443/rtc/v1/publish/"
            const webrtcURL = "webrtc://47.100.101.44/jy01/1"
            const constraints = {
                audio:true,
                video: {
                    width: { min: 640, ideal: 1280 },
                    height: { min: 360, ideal: 720 },
                    aspectRatio: 16 / 9
                }
            }

            try {
                // 1.获取本地流
                this.localStream = await navigator.mediaDevices.getUserMedia(constraints);
                const localvideo = this.$refs.localvideo;
                localvideo.srcObject = this.localStream;

                // 2.创建 PeerConnection
                // 注意添加顺序为audio、video,后续RTCPeerConnection创建offer时SDP的m线顺序遵循此顺序创建，SRS自带的信令服务器响应的SDP中m线总是先audio后video。
                // 若本端SDP和远端SDP中的m线顺序不一直，则设置远端描述时会异常，显示offer中的m线与answer中的m线顺序不匹配
                this.pc = new RTCPeerConnection();
                this.pc.addTransceiver("audio", {direction: "recvonly"});
                this.pc.addTransceiver("video", {direction: "recvonly"});

                // 3.将本地流的 track 添加到 PeerConnection
                this.localStream.getTracks().forEach(track => {
                    this.pc.addTrack(track, this.localStream);
                });

                // 4.创建本地 offer，添加本地描述
                const offer = await this.pc.createOffer();
                console.log('offer:', offer);
                await this.pc.setLocalDescription(offer);

                const data = {
                    api: httpURL,
                    streamurl: webrtcURL,
                    sdp: offer.sdp
                };

                // 5.发送 offer 到服务器,接收answer 
                const answer = await publishStream(httpURL, data);
                console.log('answer:', answer);
                

                // 设置远程描述
                await this.pc.setRemoteDescription(new RTCSessionDescription({ type: 'answer', sdp: answer.sdp }));

            } catch (error) {
                console.error('Error publishing stream:', error);
            }


        },

        async play() {
            const httpURL = "https://47.100.101.44:443/rtc/v1/play/"
            const webrtcURL = "webrtc://47.100.101.44/jy01/1"

            try {
                const remotevideo = this.$refs.remotevideo
                const stream = new MediaStream()
                const pc = new RTCPeerConnection()
                pc.addTransceiver("audio", {direction: "recvonly"});
                pc.addTransceiver("video", {direction: "recvonly"});
                const offer = await pc.createOffer()  
                await pc.setLocalDescription(offer)
                console.log('offer:', offer); 

                pc.ontrack = e => {
                    console.log(e);
                    stream.addTrack(e.track)
                    remotevideo.srcObject = stream
                }        
           
                const data = {
                    'api': httpURL,
                    'streamurl': webrtcURL,
                    'sdp': offer.sdp
                };
                const answer = await playStream(httpURL, data)
                console.log('answer:', answer);
                await pc.setRemoteDescription(new RTCSessionDescription({ type: 'answer', sdp: answer.sdp }));
          
            } catch (error) {
                console.error('Error play stream:', error);
            }

        }

    }

}



</script>

<style>
.videoBox {
    display: grid;
    grid-template-columns:  repeat(2, 1fr);
    grid-gap: 4px;
    width: 60%;
    /* height: 60%; */
    background-color: pink;
    outline: auto;
}
video{
    width: 100%;
    height: 100%;
    background-color: rgb(252, 251, 251);
}

.btn {
    display: flex;
    justify-content: center;
    button{
        width: 100px;
        height: 45px;
        margin: 20px;
    }
}
</style>