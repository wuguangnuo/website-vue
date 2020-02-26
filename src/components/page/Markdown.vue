<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-calendar"></i> 表单</el-breadcrumb-item>
                <el-breadcrumb-item>markdown编辑器</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="plugins-tips">
                mavonEditor：基于Vue的markdown编辑器。
                访问地址：<a href="https://github.com/hinesboy/mavonEditor" target="_blank">mavonEditor</a>
            </div>
            <div style='margin-bottom:20px'>
                <label>小说标题</label>
                <el-input v-model="title" placeholder="小说标题"></el-input>
            </div>
            <mavon-editor v-model="content" ref="md" @imgAdd="$imgAdd" @change="change" style="min-height: 600px"/>
            <el-button class="editor-btn" type="primary" @click="submit">提交/更新</el-button>
            <el-button class="editor-btn" type="primary" @click="newNovel">新文章</el-button>
        </div>
    </div>
</template>

<script>
    import { mavonEditor } from 'mavon-editor'
    import 'mavon-editor/dist/css/index.css'
    export default {
        name: 'markdown',
        data: function(){
            return {
                novelId: 0,
                title: '',
                content:'',
                html:'',
                configs: {
                }
            }
        },
        components: {
            mavonEditor
        },
        methods: {
            // 将图片上传到服务器，返回地址替换到md中
            $imgAdd(pos, $file){
                var formdata = new FormData();
                formdata.append('file', $file);
                // 这里没有服务器供大家尝试，可将下面上传接口替换为你自己的服务器接口
                this.$axios({
                    url: '/common/upload',
                    method: 'post',
                    data: formdata,
                    headers: { 'Content-Type': 'multipart/form-data' },
                }).then((url) => {
                    this.$refs.md.$img2Url(pos, url);
                })
            },
            change(value, render){
                // render 为 markdown 解析后的结果
                this.html = render;
            },
            submit(){
                // console.log(this.content);
                // console.log(this.html);
                // this.$message.success('提交成功！');
                this.$postData(
                    'addMarkdown',
                    {
                        id: this.novelId,
                        novelContent: this.content,
                        novelTitle: this.title
                    },
                    {}
                ).then(res => {
                    if (res.state == 200) {
                        if(this.novelId == 0){
                            this.$message.success('提交成功！');
                        }else{
                            this.$message.success('更新成功！');
                        }
                        this.novelId = res.data;
                        
                    } else {
                        this.$message.error(res.msg);
                    }
                });
            }, newNovel(){
                this.$confirm('此操作将清空当前小说, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.content = "";
                    this.title = "";
                    this.novelId = 0;
                    this.html = "";
                    this.$message({
                        type: 'success',
                        message: '新小说!'
                    });
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消'
                    });          
                });
            }
        }
    }
</script>
<style scoped>
    .editor-btn{
        margin-top: 20px;
    }
</style>