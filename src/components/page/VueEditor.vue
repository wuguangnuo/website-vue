<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-calendar"></i> 表单
                </el-breadcrumb-item>
                <el-breadcrumb-item>编辑器</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="plugins-tips">
                Vue-Quill-Editor：基于Quill、适用于Vue2的富文本编辑器。
                访问地址：
                <a
                    href="https://github.com/surmon-china/vue-quill-editor"
                    target="_blank"
                >vue-quill-editor</a>
            </div>
            <div style='margin-bottom:20px'>
                <label>小说标题</label>
                <el-input v-model="title" placeholder="小说标题"></el-input>
            </div>
            <quill-editor ref="myTextEditor" v-model="content" :options="editorOption"></quill-editor>
            <el-button class="editor-btn" type="primary" @click="submit">提交/更新</el-button>
            <el-button class="editor-btn" type="primary" @click="newNovel">新文章</el-button>
        </div>
    </div>
</template>

<script>
import 'quill/dist/quill.core.css';
import 'quill/dist/quill.snow.css';
import 'quill/dist/quill.bubble.css';
import { quillEditor } from 'vue-quill-editor';
export default {
    name: 'editor',
    data: function() {
        return {
            content: '',
            title: '',
            novelId: 0,
            editorOption: {
                placeholder: 'Hello World'
            }
        };
    },
    components: {
        quillEditor
    },
    methods: {
        onEditorChange({ editor, html, text }) {
            this.content = html;
        },
        submit() {
            // console.log(this.content);
            // this.$message.success('提交成功！');
            this.$postData(
                'addEdit',
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
        },
        newNovel(){
            this.$confirm('此操作将清空当前小说, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.content = "";
                this.title = "";
                this.novelId = 0;
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
};
</script>
<style scoped>
.editor-btn {
    margin-top: 20px;
}
</style>