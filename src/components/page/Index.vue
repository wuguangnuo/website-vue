<template>
  <div>
    <el-row>
      <el-col :span="8">
        <el-card
          shadow="hover"
          class="mgb20"
          style="height:252px;"
        >
          <div class="user-info">
            <img
              :src="homeInfo.headimg"
              class="user-avator"
            >
            <div class="user-info-cont">
              <div class="user-info-name">{{homeInfo.realname}}&nbsp;（{{homeInfo.username}}）</div>
              <div>{{homeInfo.role}}</div>
            </div>
          </div>
          <div class="user-info-list">
            上次登录时间：
            <span>{{homeInfo.loginAt}}</span>
          </div>
          <div class="user-info-list">
            上次登录地点：
            <span>{{homeInfo.lastIp}}&nbsp;（{{homeInfo.lastAdd}}）</span>
          </div>
        </el-card>
      </el-col>
      <el-row :gutter="20" class="mgb20">
        <el-col :span="4">
          <el-card
            shadow="hover"
            :body-style="{padding: '0px'}"
          >
            <div class="grid-content grid-con-1">
              <i class="el-icon-lx-people grid-con-icon"></i>
              <div class="grid-cont-right">
                <div class="grid-num">{{homeInfo.todayNum}}</div>
                <div>今日接口调用次数</div>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="4">
          <el-card
            shadow="hover"
            :body-style="{padding: '0px'}"
          >
            <div class="grid-content grid-con-2">
              <i class="el-icon-lx-notice grid-con-icon"></i>
              <div class="grid-cont-right">
                <div class="grid-num">{{homeInfo.allNum}}</div>
                <div>接口调用总次数</div>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="4">
          <el-card
            shadow="hover"
            :body-style="{padding: '0px'}"
          >
            <div class="grid-content grid-con-3">
              <i class="el-icon-lx-goods grid-con-icon"></i>
              <div class="grid-cont-right">
                <div class="grid-num">未统计</div>
                <div>版本更新次数</div>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="20">
        <el-card shadow="hover">
          <v-chart
            :options="weekChart"
            style="width:90%;height:800px"
            theme="light"
          ></v-chart>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import 'echarts/lib/chart/bar';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/grid';
import 'echarts/lib/component/legend';
import 'echarts/lib/component/title';
import 'echarts/lib/component/toolbox';

export default {
    name: 'index',
    data() {
        return {
            weekChart: {},
            homeInfo: {
                headimg: '',
                username: '',
                realname: '',
                role: '',
                loginAt: '',
                lastIp: '',
                lastAdd: '',
                todayNum: '',
                allNum: ''
            }
        };
    },
    components: {},
    computed: {},
    created() {
        this.loadDate();
    },
    methods: {
        loadDate() {
            const loading = this.$loading({
                lock: true,
                text: '数据处理中，请稍后！',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)'
            });
            this.$postData('getHomeInfo', {})
                .then(res => {
                    this.homeInfo = res.data;
                    this.weekChart = JSON.parse(res.data.weekChart);
                    loading.close();
                })
                .catch(error => {
                    loading.close();
                    this.$message.error('查询失败，系统超时');
                });
        }
    }
};
</script>


<style scoped>
.el-row {
    margin-bottom: 20px;
}

.grid-content {
    display: flex;
    align-items: center;
    height: 100px;
}

.grid-cont-right {
    flex: 1;
    text-align: center;
    font-size: 14px;
    color: #999;
}

.grid-num {
    font-size: 30px;
    font-weight: bold;
}

.grid-con-icon {
    font-size: 50px;
    width: 100px;
    height: 100px;
    text-align: center;
    line-height: 100px;
    color: #fff;
}

.grid-con-1 .grid-con-icon {
    background: rgb(45, 140, 240);
}

.grid-con-1 .grid-num {
    color: rgb(45, 140, 240);
}

.grid-con-2 .grid-con-icon {
    background: rgb(100, 213, 114);
}

.grid-con-2 .grid-num {
    color: rgb(45, 140, 240);
}

.grid-con-3 .grid-con-icon {
    background: rgb(242, 94, 67);
}

.grid-con-3 .grid-num {
    color: rgb(242, 94, 67);
}

.user-info {
    display: flex;
    align-items: center;
    padding-bottom: 20px;
    border-bottom: 2px solid #ccc;
    margin-bottom: 20px;
}

.user-avator {
    width: 120px;
    height: 120px;
    border-radius: 50%;
}

.user-info-cont {
    padding-left: 50px;
    flex: 1;
    font-size: 14px;
    color: #999;
}

.user-info-cont div:first-child {
    font-size: 30px;
    color: #222;
}

.user-info-list {
    font-size: 14px;
    color: #999;
    line-height: 25px;
}

.user-info-list span {
    margin-left: 70px;
}

.mgb20 {
    margin-bottom: 20px;
}

.todo-item {
    font-size: 14px;
}

.todo-item-del {
    text-decoration: line-through;
    color: #999;
}

.schart {
    width: 100%;
    height: 300px;
}
</style>
