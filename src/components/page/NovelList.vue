<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 公开文章
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-form ref="form" :model="pageInfo">
                    <el-row>
                        <el-col :span="10">
                            <el-form-item label="小说标题">
                                <el-input
                                    v-model="dto.novelTitle"
                                    placeholder="小说标题"
                                    style="width:250px"
                                    class="handle-input mr10"
                                ></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="10">
                            <el-form-item label="发布时间">
                                <el-date-picker
                                    v-model="createTm"
                                    type="daterange"
                                    align="right"
                                    unlink-panels
                                    range-separator="至"
                                    start-placeholder="开始日期"
                                    end-placeholder="结束日期"
                                    format="yyyy 年 MM 月 dd 日"
                                    value-format="yyyy-MM-dd HH:mm:ss"
                                ></el-date-picker>
                            </el-form-item>
                        </el-col>
                        <el-col :span="4" style="text-align:right">
                            <el-button type="primary" @click="onSubmit">搜索</el-button>
                            <el-button type="success" @click="exportExcel">导出Excel</el-button>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="10">
                            <el-form-item label="文本类型">
                                <el-input
                                    v-model="dto.novelType"
                                    placeholder="文本类型"
                                    style="width:250px"
                                    class="handle-input mr10"
                                ></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="10">
                            <el-form-item label="更新时间">
                                <el-date-picker
                                    v-model="updateTm"
                                    type="daterange"
                                    align="right"
                                    unlink-panels
                                    range-separator="至"
                                    start-placeholder="开始日期"
                                    end-placeholder="结束日期"
                                    format="yyyy 年 MM 月 dd 日"
                                    value-format="yyyy-MM-dd HH:mm:ss"
                                ></el-date-picker>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
            </div>
            <el-table :data="data" border class="table" ref="multipleTable" @sort-change="sortChange">
                <el-table-column prop="id" label="ID" width="80" :show-overflow-tooltip="true"></el-table-column>
                <el-table-column prop="novelTitle" label="标题" :show-overflow-tooltip="true" sortable="custom"></el-table-column>
                <el-table-column prop="novelAuthor" label="作者" width="120" :show-overflow-tooltip="true" sortable="custom"></el-table-column>
                <el-table-column
                    prop="novelType"
                    label="类型"
                    width="120"
                    :show-overflow-tooltip="true"
                    sortable="custom"
                ></el-table-column>
                <el-table-column
                    prop="novelContent"
                    label="内容"
                    :show-overflow-tooltip="true"
                ></el-table-column>
                <el-table-column
                    prop="createTm"
                    label="创建时间"
                    :show-overflow-tooltip="true"
                    sortable="custom"
                ></el-table-column>
                <el-table-column
                    prop="updateTm"
                    label="更新时间"
                    :show-overflow-tooltip="true"
                    sortable="custom"
                ></el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination
                    background
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="pageInfo.total"
                    :page-size="pageInfo.size"
                    :current-page="pageInfo.current"
                    :page-sizes="[10,20,50,100]"
                    :page-count="pageInfo.pages"
                    @size-change="sizeChange"
                    @current-change="currentChange"
                ></el-pagination>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'novellist',
    data() {
        return {
            tableData: [],
            // multipleSelection: [],

            pageInfo: { total: 10, size: 10, current: 1, pages: 1 },
            // theader: '',
            createTm: [],
            updateTm: [],

            productCategory: '',
            options: [], //服务项目一级
            options_children: [], //服务项目二级
            realStartTime: [],
            settlementTime: [],
            serviceOptions: [], //服务区域
            serviceArray: [],
            dto: {
                novelTitle:'',
                novelType:'',
                createTm1: '',
                createTm2: '',
                updateTm1:'',
                updateTm2:'',

                export: '',
                orderBy: '',
                pageIndex: '',
                pageSize: ''
            }
        };
    },
    created() {
        // this.$getData("getProductCategory").then(res => {
        //     res.data.unshift({ text: "请选择", value: "" });
        //     this.options = res.data;
        // });
        // // 服务区域下拉框
        // this.$getData("getCityArea").then(res => {
        //     res.data.unshift({ label: "请选择", value: "" });
        //     this.serviceOptions = res.data;
        // });
        this.getData();
    },
    computed: {
        data() {
            return this.tableData.filter(d => {
                d.createTm =
                    d.createTm == null
                        ? null
                        : d.createTm.replace("T", " ").substring(0, 16);
                d.updateTm =
                    d.updateTm == null
                        ? null
                        : d.updateTm.replace("T", " ").substring(0, 16);
                return d;
            });
        }
    },
    methods: {
        changeValue(value) {
            // this.dto.productId = "";
            // this.$getData("getProductName", { productCategoryId: value }).then(
            //     res => {
            //         this.options_children = res.data;
            //     }
            // );
        },
        getData() {
            this.openFullScreen();
            this.$postData('novelList', this.dto, {})
                .then(res => {
                    if (res.state == 200) {
                        this.tableData = res.data.records;
                        this.pageInfo = res.data;
                        this.closeFullScreen();
                    } else {
                        this.closeFullScreen();
                        this.$message.error('查询失败，' + res.msg);
                    }
                })
                .catch(error => {
                    this.closeFullScreen();
                    this.$message.error('查询失败，系统超时');
                });
        },
        onSubmit() {
            this.dto.createTm1 = this.createTm?this.createTm[0]||"":"";
            this.dto.createTm2 = this.createTm?this.createTm[1]||"":"";
            this.dto.updateTm1 = this.updateTm?this.updateTm[0]||"":"";
            this.dto.updateTm2 = this.updateTm?this.updateTm[1]||"":"";

            // this.dto.areaId = this.serviceArray[this.serviceArray.length - 1];
            this.dto.export = '';
            this.dto.orderBy = "";
            this.dto.pageSize = "";
            this.dto.pageIndex = '1';

            this.getData();
        },
        exportExcel() {
            this.dto.export = 'Excel';
            this.$postData('novelList', this.dto, {
                responseType: 'arraybuffer'
            }).then(res => {
                this.blobExport({
                    tablename: '小说列表',
                    res: res
                });
                this.dto.export = '';
            });
        },
        // 页码大小
        sizeChange(size) {
            this.dto.pageSize = size;
            this.dto.pageIndex = 1;
            this.getData();
        },
        // 跳转页码
        currentChange(index) {
            this.dto.pageIndex = index;
            this.getData();
        },
        blobExport({ tablename, res }) {
            const aLink = document.createElement('a');
            let blob = new Blob([res], { type: 'application/vnd.ms-excel' });
            aLink.href = URL.createObjectURL(blob);
            aLink.download = tablename + '.xlsx';
            document.body.appendChild(aLink);
            aLink.click();
            document.body.removeChild(aLink);
        },
        openFullScreen() {
            const loading = this.$loading({
                lock: true,
                text: 'Loading',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)'
            });
        },
        closeFullScreen() {
            const loading = this.$loading({
                lock: true,
                text: 'Loading',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)'
            });
            loading.close();
        },
        sortChange: function(column, prop, order) {
            if (column == null) {
                this.dto.orderBy = '';
            } else {
                if (column.order == 'ascending') {
                    this.dto.orderBy = column.prop + ' ASC';
                }
                if (column.order == 'descending') {
                    this.dto.orderBy = column.prop + ' DESC';
                }
            }
            this.getData();
        }
    }
};
</script>

<style scoped>
.handle-box {
    margin-bottom: 20px;
}

.handle-select {
    width: 120px;
}

.handle-input {
    width: 300px;
    display: inline-block;
}
.table {
    width: 100%;
    font-size: 14px;
}
.red {
    color: #ff0000;
}
.mr10 {
    margin-right: 10px;
}
.table-td-thumb {
    display: block;
    margin: auto;
    width: 40px;
    height: 40px;
}
</style>
