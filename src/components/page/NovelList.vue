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
        <el-form
          ref="form"
          :model="pageInfo"
        >
          <el-row>
            <el-col :span="10">
              <el-form-item label="文章标题">
                <el-input
                  v-model="dto.novelTitle"
                  placeholder="文章标题"
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
            <el-col
              :span="4"
              style="text-align:right"
            >
              <el-button
                type="primary"
                @click="onSubmit"
              >搜索</el-button>
              <el-button
                type="success"
                @click="exportExcel"
              >导出Excel</el-button>
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
      <el-table
        :data="data"
        border
        class="table"
        ref="multipleTable"
        @sort-change="sortChange"
      >
        <el-table-column
          prop="id"
          label="编号"
          width="100"
          :show-overflow-tooltip="true"
          sortable="custom"
        ></el-table-column>
        <el-table-column
          prop="novelTitle"
          label="标题"
          width="200"
          :show-overflow-tooltip="true"
          sortable="custom"
        ></el-table-column>
        <el-table-column
          prop="novelAuthor"
          label="作者"
          width="150"
          :show-overflow-tooltip="true"
          sortable="custom"
        ></el-table-column>
        <el-table-column
          prop="novelType"
          label="类型"
          width="150"
          :show-overflow-tooltip="true"
          sortable="custom"
        ></el-table-column>
        <el-table-column
          prop="novelState"
          label="状态"
          width="150"
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
          width="150"
          :show-overflow-tooltip="true"
          sortable="custom"
        ></el-table-column>
        <el-table-column
          prop="updateTm"
          label="更新时间"
          width="150"
          :show-overflow-tooltip="true"
          sortable="custom"
        ></el-table-column>
        <el-table-column
          label="操作"
          width="225"
        >
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              @click="novelEdit(scope.$index, scope.row)"
            >编辑</el-button>
            <el-button
              size="mini"
              type="success"
              @click="novelDownload(scope.$index, scope.row)"
            >下载</el-button>
            <el-button
              size="mini"
              type="danger"
              @click="novelDelete(scope.$index, scope.row)"
            >删除</el-button>
          </template>
        </el-table-column>
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
                novelTitle: '',
                novelType: '',
                createTm1: '',
                createTm2: '',
                updateTm1: '',
                updateTm2: '',

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
                d.createTm = d.createTm == null ? null : d.createTm.replace('T', ' ').substring(0, 16);
                d.updateTm = d.updateTm == null ? null : d.updateTm.replace('T', ' ').substring(0, 16);
                return d;
            });
        }
    },
    methods: {
        novelEdit(index, row) {
          if(row.novelType == 'Html'){
            this.$router.push({ name: 'editor', params: { novelId: row.id, novelType: row.novelType }})
          } else if(row.novelType == 'Markdown'){
            this.$router.push({ name: 'markdown', params: { novelId: row.id, novelType: row.novelType }})
          } else {
            this.$message.error('文章类型错误:' + row.novelType);
          }
        },
        novelDownload(index, row) {
          this.$postData('novelDownload', { id: row.id }, {})
            .then(res => {
                if (res.status == 200) {
                    this.$alert('文件生成成功，点击&nbsp;<strong><a href="'+res.data+'">'+row.novelTitle+'</a></strong>&nbsp;下载', '文件下载', {
                      dangerouslyUseHTMLString: true
                    });
                } else {
                    this.$message.error('操作失败，' + res.message);
                }
            })
            .catch(error => {
                this.$message.error('操作失败，系统超时');
            });
        },
        novelDelete(index, row) {
            let param1 = '确定删除文章【' + row.novelTitle + '】?'
            let param2 = '提示'
            let param3 = {confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'}
            if(row.novelState.includes('删除')){
              param1 = '确定永久删除文章【' + row.novelTitle + '】?'
              param2 = '删除确认'
              param3 = {confirmButtonText: '确定', cancelButtonText: '取消', type: 'error'}
            }
            this.$confirm(param1, param2, param3)
                .then(() => {
                    this.$postData('novelDelete', { id: row.id }, {})
                        .then(res => {
                            if (res.status == 200) {
                                this.$message({
                                    type: 'success',
                                    message: '删除成功!'
                                });
                                this.getData();
                            } else {
                                this.$message.error('操作失败，' + res.message);
                            }
                        })
                        .catch(error => {
                            this.$message.error('操作失败，系统超时');
                        });
                })
                .catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消'
                    });
                });
        },
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
            this.$pageData('novelList', this.dto, {})
                .then(res => {
                    if (res.status == 200) {
                        this.tableData = res.data.list;
                        this.pageInfo = res.data;
                        this.closeFullScreen();
                    } else {
                        this.closeFullScreen();
                        this.$message.error('查询失败，' + res.message);
                    }
                })
                .catch(error => {
                    this.closeFullScreen();
                    this.$message.error('查询失败，系统超时');
                });
        },
        onSubmit() {
            this.dto.createTm1 = this.createTm ? this.createTm[0] || '' : '';
            this.dto.createTm2 = this.createTm ? this.createTm[1] || '' : '';
            this.dto.updateTm1 = this.updateTm ? this.updateTm[0] || '' : '';
            this.dto.updateTm2 = this.updateTm ? this.updateTm[1] || '' : '';

            // this.dto.areaId = this.serviceArray[this.serviceArray.length - 1];
            this.dto.export = '';
            this.dto.orderBy = '';
            this.dto.pageSize = '';
            this.dto.pageIndex = '1';

            this.getData();
        },
        exportExcel() {
            this.dto.export = 'Excel';
            this.$$postData('novelList', this.dto, {
                responseType: 'arraybuffer'
            }).then(res => {
                this.blobExport({
                    tablename: '文章列表',
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
