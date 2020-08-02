<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>个人中心</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <el-row>
                <el-col :span="12">
                    <div class="form-box">
                        <el-form ref="form" :model="form" label-width="80px">
                            <el-form-item label="登录名">
                                <el-input v-model="form.username" :disabled="true"></el-input>
                            </el-form-item>
                            <el-form-item label="姓名">
                                <el-input v-model="form.realname"></el-input>
                            </el-form-item>
                            <el-form-item label="邮箱">
                                <el-input v-model="form.email"></el-input>
                            </el-form-item>
                            <el-form-item label="密码">
                                <el-input v-model="form.password" show-password></el-input>
                            </el-form-item>
                            <el-form-item>
                                <el-button type="primary" @click="onSubmit">提交</el-button>
                                <!-- <el-button>取消</el-button> -->
                            </el-form-item>
                        </el-form>
                    </div>
                </el-col>
                <el-col :span="12">
                    <div class="crop-demo">
                        <img :src="form.headimg" class="pre-img">
                        <div class="crop-demo-btn">选择图片
                            <input class="crop-input" type="file" name="image" accept="image/*" @change="setImage"/>
                        </div>
                    </div>
                </el-col>
            </el-row>

            <el-dialog title="裁剪图片" :visible.sync="dialogVisible" width="30%">
                <vue-cropper ref='cropper'
                    :src="imgSrc" 
                    :ready="cropImage" 
                    :zoom="cropImage" 
                    :cropmove="cropImage" 
                    :aspect-ratio="4/4"
                    drag-mode="move"
                    :view-mode="1"
                    :movable="true"
                    :crop-box-movable="true"
                    :crop-box-resizable="false"
                    alt="Profiel afbeelding"
                ></vue-cropper>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="cancelCrop">取 消</el-button>
                    <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
                </span>
            </el-dialog>
        </div>
    </div>
</template>

<script>
    import VueCropper  from 'vue-cropperjs';
    export default {
        name: 'profile',
        data: function(){
            return {
                defaultSrc: require('../../assets/img/img.jpg'),
                imgSrc:'',
                dialogVisible: false,
                form:{
                    username:'',
                    realname:'',
                    email:'',
                    password:'',
                    headimg:''
                }
            }
        },
        components: {
            VueCropper
        },
        methods:{
            setImage(e){
                const file = e.target.files[0];
                if (!file.type.includes('image/')) {
                    return;
                }
                const reader = new FileReader();
                reader.onload = (event) => {
                    this.dialogVisible = true;
                    this.imgSrc = event.target.result;
                    this.$refs.cropper && this.$refs.cropper.replace(event.target.result);
                };
                reader.readAsDataURL(file);
            },
            cropImage () {
                let w = this.$refs.cropper.getCroppedCanvas().width
                let scale = 400/w<1?400/w:1
                
                this.form.headimg = this.$refs.cropper.getCroppedCanvas().toDataURL('image/jpeg', scale);
            },
            cancelCrop(){
                this.dialogVisible = false;
                this.form.head = this.defaultSrc;
            },
            onSubmit(){
                const mailReg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/
                if(!mailReg.test(this.form.email)){
                    this.$message.error("邮箱格式错误，请重新输入");
                    return;
                }
                this.$postData("updateProfile",this.form,{}).then(res=>{
                    if(res.status == 200){
                        this.$message.success("更新成功，请重新登录");
                    }else{
                        this.$message.error(res.message);
                    }
                }).catch(err=>{
                    this.$message.error("更新失败，系统超时");
                })
            },
            getProfile(){
                this.$postData("getProfile",{},{}).then(res=>{
                    if(res.status == 200){
                        this.form = res.data
                    }else{
                        this.$message.error(res.message);
                    }
                }).catch(err=>{
                    this.$message.error("查询失败，系统超时");
                })
            }
        },
        created(){
            // this.form.headimg = this.defaultSrc;
            this.getProfile()
        }
    }
</script>

<style scoped>
    .content-title{
        font-weight: 400;
        line-height: 50px;
        margin: 10px 0;
        font-size: 22px;
        color: #1f2f3d;
    }
    .pre-img{   
        width: 100px;
        height: 100px;
        background: #f8f8f8;
        border: 1px solid #eee;
        border-radius: 5px;
    }
    .crop-demo{
        display: flex;
        align-items: flex-end;
    }
    .crop-demo-btn{
        position: relative;
        width: 100px;
        height: 40px;
        line-height: 40px;
        padding: 0 20px;
        margin-left: 30px;
        background-color: #409eff;
        color: #fff;
        font-size: 14px;
        border-radius: 4px;
        box-sizing: border-box;
    }
    .crop-input{
        position: absolute;
        width: 100px;
        height: 40px;
        left: 0;
        top: 0;
        opacity: 0;
        cursor: pointer;
    }
</style>