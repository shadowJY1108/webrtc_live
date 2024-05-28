<template>
    <div id="login_container">
        <form ref="form" @submit.prevent="loginFn">

            <div class="row">
                <label for="username">User ID:</label>
                <input type="text" name="username" v-model="username" autocomplete="username" placeholder="请输入userId" required>
            </div>

            <div class="row">
                <label for="password">Password:</label>
                <input type="password" name="password" v-model="password" autocomplete="current-password" placeholder="请输入password" required>
            </div>

            <div class="login_row">
                <button type="submit" class="regBtn" disabled>注册</button>
                <button type="submit" class="loginBtn">Login</button>
            </div>
        </form>
    </div>

    <router-view></router-view>
</template>

<script>
import { postFormData } from '@/api/api';
import router from '@/router/router';

export default {
    name: 'login',
    data() {
        return {
            username: '',
            password: '',
        }
    },

    created() {

    },

    methods: {
        loginFn() {
            const formData = {
                userId: this.username,
                password: this.password,
            };
            postFormData('/userAPI/login', formData)
                .then(res => {
                    // console.log('Login successful:', res.data);
                    // 可以在登录成功后进行页面跳转等操作
                    const token = res.data.token
                    // localStorage.setItem('token', token)
                    this.$store.dispatch('updateToken', token)
                        .then(() => {
                            this.$store.dispatch('getUserInfoAction')
                                .then(() => {
                                    this.$router.push('/live')
                                })
                                .catch(error => {
                                    console.error('获取用户信息失败:', error);
                                    alert('获取用户信息失败');
                                });

                        })
                        .catch(error => {
                            console.error('更新token失败:', error);
                            // 可以根据实际需求进行错误处理
                            alert('更新token失败');
                        });
                })
                .catch(error => {
                    console.error('登录失败:', error);
                    // 根据实际情况处理不同的错误
                    if (error.response.status === 401) {
                        alert('用户名或密码错误');
                    } else {
                        alert('登录失败，请稍后重试');
                    }
                });

        }
    }

}

</script>

<style scoped>
#login_container {
    background-color: pink;
    width: 640px;
    height: 360px;
    position: absolute;
    top: 40%;
    left: 50%;
    transform: translate(-50%, -40%);
    display: flex;
    justify-content: center;
    background-image: url(https://s1.hdslb.com/bfs/seed/jinkela/short/mini-login-v2/img/22_open.4ea5f239.png),url(https://s1.hdslb.com/bfs/seed/jinkela/short/mini-login-v2/img/33_open.f7d7f655.png);
    background-position: 0 100%, 100% 100%;
    background-repeat: no-repeat;
    background-size: 18%;
    border-radius: 6px;
    
    form {
        margin: auto;
    }
    .row {
        width: 280px;
        height: 42px;
        display: flex;
        justify-content: flex-start;
        align-items: center;

        label {
            flex: 1;
            line-height: 28px;
            text-align: center;
        }

        input {
            height: 22px;
            flex: 2;
        }
    }

    .login_row{
        text-align: center;
        margin: 20px 0;
        display: flex;
        justify-content:space-around;
       
        .regBtn{
            width: 100px;
            height: 40px;
            border-radius: 8px;
        }
        .loginBtn{
            background-color: #00aeec;
            width: 100px;
            height: 40px;
            border-radius: 8px;
        }

    }
}
</style>
