<template>
    <div class="login-wrap">
        <div class="ms-login">
            <div class="ms-title">黄毛写小说专用系统</div>
            <el-form
                :model="ruleForm"
                :rules="rules"
                ref="ruleForm"
                label-width="0px"
                class="ms-content"
            >
                <el-form-item prop="username">
                    <el-input v-model="ruleForm.username" placeholder="username">
                        <el-button slot="prepend" icon="el-icon-lx-people"></el-button>
                    </el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input
                        type="password"
                        placeholder="password"
                        v-model="ruleForm.password"
                        @keyup.enter.native="submitForm('ruleForm')"
                    >
                        <el-button slot="prepend" icon="el-icon-lx-lock"></el-button>
                    </el-input>
                </el-form-item>
                <div class="login-btn">
                    <el-button type="primary" @click="submitForm(ruleForm)">登录</el-button>
                </div>
                <p class="login-tips">{{loginTips}}</p>
            </el-form>
        </div>
    </div>
</template>

<script>
export default {
    data: function() {
        return {
            title: '',
            loginTips: '',
            ruleForm: {
                username: '',
                password: ''
            },
            rules: {
                username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
                password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
            }
        };
    },
    methods: {
        submitForm(formName) {
            // this.$refs[formName].validate((valid) => {
            //     if (valid) {
            //         localStorage.setItem('ms_username',this.ruleForm.username);
            //         this.$router.push('/');
            //     } else {
            //         console.log('error submit!!');
            //         return false;
            //     }
            // });
            this.$postData(
                'login',
                {
                    account: formName.username,
                    password: formName.password
                },
                {}
            ).then(res => {
                if (res.code == 200) {
                    localStorage.setItem('token', res.data.token);
                    localStorage.setItem('userName', res.data.username);
                    localStorage.setItem('realName', res.data.realname);
                    localStorage.setItem('headImg', res.data.headimg);
                    this.$router.push('/');
                } else {
                    this.loginTips = res.msg;
                }
            });
        }
    }
};
</script>

<style scoped>
.login-wrap {
    background: linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)),
        url('https://wuguangnuo-1257896087.cos.ap-guangzhou.myqcloud.com/public/img/ReinhardtWilhelm.jpg') no-repeat fixed;
    position: fixed;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: 0;
    font-size: 12px;
    font-family: Georgia, Arial, SimSun, 'Microsoft Yahei';
    margin: 0;
    padding: 0;
    -moz-user-select: none;
    -webkit-user-select: none;
    -ms-user-select: none;
    -khtml-user-select: none;
    user-select: none;
}
.ms-title {
    width: 100%;
    line-height: 60px;
    text-align: center;
    font-size: 24px;
    color: #333;
    font-weight: 500;
    border-bottom: 1px solid #ddd;
}
.ms-login {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 350px;
    margin: -190px 0 0 -175px;
    border-radius: 5px;
    background: rgba(255, 255, 255, 0.3);
    overflow: hidden;
}
.ms-content {
    padding: 30px 30px;
}
.login-btn {
    text-align: center;
}
.login-btn button {
    width: 100%;
    height: 36px;
    margin-bottom: 10px;
}
.login-tips {
    font-size: 12px;
    line-height: 30px;
    color: red;
}
</style>