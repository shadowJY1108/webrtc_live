<template>
    <div class="header"></div>
    <div id="admin_container">

        <div class="my_live">
            <div class="aside">
                <!-- <div class="aside_name"> <span>我的直播间</span> </div> -->

                <ul>
                    <li @click="swtichContent(items[0])">个人信息</li>
                    <li @click="swtichContent(items[1])">头像</li>
                    <li @click="swtichContent(items[2])">其他</li>
                </ul>

            </div>

            <div class="content">
                <!-- 1 -->
                <div v-if="selectedItem && selectedItem.id === 0" class="content_userinfo">
                    <div>
                        <label for="nickname">ncikname</label>
                        <input type="text" placeholder="请输入新的昵称">
                    </div>

                    <div>
                        <label for="title">标题名称</label>
                        <input type="text" placeholder="请输入直播间标题">
                    </div>
                </div>

                <!-- 2.头像avatar -->
                <div v-if="selectedItem && selectedItem.id === 1" class="content_avatar">
                    <div class="avatar_box">
                        <div class="cropper_box">
                            <vueCropper ref="cropper" :img="pre_Image" :outputType="'jpeg'" :canMoveBox='true'
                                :autoCrop="true" :autoCropWidth="'120px'" :autoCropHeight="'120px'"
                                @realTime="realTime">
                            </vueCropper>
                        </div>

                        <div class="pre_large"
                            :style="{ 'width': previews.w + 'px', 'height': previews.h + 'px', 'overflow': 'hidden', }">
                            <div :style="previews.div">
                                <img :src="previews.url" :style="previews.img">
                            </div>
                        </div>

                        <!-- <p>中等大小</p> -->
                        <div class="pre_mid" :style="previewStyle1">
                            <div :style="previews.div">
                                <img :src="previews.url" :style="previews.img">
                            </div>
                        </div>


                    </div>

                    <div class=" btn_box">
                        <input type="file" accept="image/*" ref="imgRef" style="display:none" @change="onFileChangeFn">
                        <button @click="chooseImgFn">选择图片</button>
                        <button type="success" :disabled="crpper_avatar === ''" @click="cropImage">裁剪并保存</button>
                    </div>

                </div>

                <!-- 3. -->
                <div v-if="selectedItem && selectedItem.id === 2" class="content_other">{{ selectedItem.name }}
                </div>

            </div>

        </div>
    </div>

</template>

<script>
import { updateUserAvatar } from '@/api/api';
import { VueCropper } from 'vue-cropper';
import 'vue-cropper/dist/index.css'


export default {
    name: 'admin',
    components: {
        VueCropper
    },
    data() {
        return {
            items: [
                { id: 0, name: 'Item 1' },
                { id: 1, name: 'Item 2' },
                { id: 2, name: 'Item 3' },
            ],
            selectedItem: null,

            pre_Image: null,
            crpper_avatar: null,
            previews: {},
            // option: {
            //     img: this.avatar,   // 裁剪图片地址，这里可以本地图片或者链接，链接不用require
            //     outputSize: 1, // 裁剪生成图片质量
            //     outputType: 'jepg', // 裁剪生成图片格式
            //     canScale: true, // 图片是否允许滚轮播放
            //     autoCrop: true, // 是否默认生成截图框 false
            //     info: false, // 是否展示截图框信息
            //     autoCropWidth: 200, // 生成截图框的宽度
            //     autoCropHeight: 200, // 生成截图框的高度
            //     canMoveBox: true, // 截图框是否可以拖动
            //     fixedBox: true, // 固定截图框的大小
            //     canMove: false, // 上传图片是否可拖动
            //     centerBox: true, // 截图框限制在图片里面
            // },

        }
    },

    mounted() {
        // 默认选中第一个菜单项
        this.selectedItem = this.items[0];
    },


    methods: {
        swtichContent(item) {
            this.selectedItem = item
        },

        chooseImgFn() {
            this.$refs.imgRef.click()
        },

        // 选择确定的图片
        onFileChangeFn(e) {
            console.log(e);
            const files = e.target.files
            if (files.length === 0) {
                // 打开了窗口，但没有选择文件，就点击确定关闭了窗口
                return
            }
            const fr = new FileReader()
            fr.onload = (e) => {
                // e.target.result就是读完的结果
                console.log(e.target.result);
                this.pre_Image = e.target.result
            }
            fr.readAsDataURL(files[0])
        },

        /* 截图 */
        cropImage() {
            const cropper = this.$refs.cropper;
            cropper.getCropData(data => {
                // do something
                this.crpper_avatar = data
                this.uploadFn(data)
            })
        },

        // 上传图片
        async uploadFn(avatar) {
            const res = await updateUserAvatar(avatar)
            console.log(res);
            if (res.data.status !== 0) {
                return alert('update avatar error')
            }
            //刷新vuex里的数据,实现同步更新
            this.$store.commit('updateAvatar', avatar)
        },

        handleCropMove(e) {
            // 在这里可以监听裁剪框的移动
        },

        realTime(data) {
            var previews = data
            var h = 0.5
            var w = 0.3

            this.previewStyle1 = {
                width: previews.w + "px",
                height: previews.h + "px",
                overflow: "hidden",
                margin: "0",
                zoom: h
            }
            this.previews = data
        },

    }
} 
</script>

<style scoped>
.header {
    height: 60px;
    width: 100%;
    position: absolute;
    top: -60px;
    background-color: black;
}

#admin_container {

    width: 100%;
    height: 100%;
}

.my_live {
    width: 60%;
    height: 100%;
    margin: auto;
    display: flex;

    .aside {
        width: 30%;
        height: 100%;
        background-color: aqua;

        ul {
            padding: 10px;

            li {
                height: 40px;
                line-height: 40px;
                list-style: none;
                margin: 30px 0;
                background-color: gold;
                cursor: pointer;
            }
        }
    }

    .content {
        width: 70%;
        height: 100%;
        /* background-color: pink; */
    }

    .content_avatar {
        width: 800px;
        height: 600px;
        margin: 20px;

        .avatar_box {
            display: flex;
            width: 800px;
            height: 300px;

            .cropper_box {
                width: 300px;
                height: 300px;
            }

            .pre_large {
                background-color: pink;
                margin: auto;
            }
            .pre_mid {
                background-color: pink;
                margin: auto;
            }

        }
    }

}
</style>