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
                注意：不建议使用图片上传功能，建议插入图片链接
            </div>
            <el-form>
                <el-row>
                    <el-col :span="10">
                    <el-form-item label="文章标题">
                        <el-input
                        v-model="title"
                        placeholder="文章标题"
                        style="width:400px"
                        class="handle-input mr10"
                        ></el-input>
                    </el-form-item>
                    </el-col>
                    <el-col :span="10">
                    <el-form-item label="文章权限">
                        <el-select v-model="state" placeholder="请选择">
                            <el-option
                                v-for="item in stateEnum"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <quill-editor ref="myTextEditor" 
                v-model="content" 
                :options="editorOption">
            </quill-editor>
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
            },
            state: '',
            stateEnum: [{
                value: '11',
                label: '自己可见'
            }, {
                value: '12',
                label: '所有人可见'
            }]
        };
    },
    created(){
        var novelId = this.$route.params.novelId;
        if(novelId){
            this.getNovel(novelId)
        }
    },
    watch: {
        $route (to, from) {
            if( from.path == '/novellist' && this.$route.params.novelType == 'Html') {
                var novelId = this.$route.params.novelId;
                if(novelId){
                    this.getNovel(novelId)
                }
            }
        }
    },
    components: {
        quillEditor
    },
    methods: {
        onEditorChange({ editor, html, text }) {
            this.content = html;
        },
        getNovel(novelId){
            this.$postData(
                'novelDetail',
                {id: novelId}
            ).then(res => {
                if (res.status == 200) {
                    this.novelId = res.data.id
                    this.content = res.data.novelContent
                    this.title = res.data.novelTitle
                    this.state = res.data.novelState
                } else {
                    this.$message.error(res.message);
                }
            }).catch(error => {
                this.$message.error('查询失败，系统超时');
            });
        },
        submit() {
            // console.log(this.content);
            // this.$message.success('提交成功！');
            this.$postData(
                'addEdit',
                {
                    id: this.novelId,
                    novelContent: this.content,
                    novelTitle: this.title,
                    novelState: this.state
                },
                {}
            ).then(res => {
                if (res.status == 200) {
                    if(this.novelId == 0){
                        this.$message.success('提交成功！');
                    }else{
                        this.$message.success('更新成功！');
                    }
                    this.novelId = res.data;
                    
                } else {
                    this.$message.error(res.message);
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
                this.state = '';
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