<template>
  <div class="app-container">
    <div id="app">
    </div>
    <div class="filter-container">
      <el-row class="demo-autocomplete">
        <el-col :span="4">
          项目:
          <el-autocomplete :hide-loading=true class="inline-input" clearable v-model="listQuery.project" :fetch-suggestions="queryProjects" placeholder="请输入内容" @select="handleFilter">
          </el-autocomplete>
        </el-col>
        <el-col :span="5">
          镜像:
          <el-autocomplete :hide-loading=true class="inline-input" clearable v-model="listQuery.image" :fetch-suggestions="queryImages" placeholder="请输入内容" @select="handleFilter">
          </el-autocomplete>
        </el-col>
        <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
          查找
        </el-button>
        <el-button class="filter-item" type="primary" @click="clearQuery">
          清除
        </el-button>
      </el-row>
    </div>

    <el-table v-loading="listLoading" :data="listPage" element-loading-text="Loading" border fit highlight-current-row>
      <el-table-column v-for="(val, column) in fixFormTheads" :key="column" :label="val['label']" :align="val['align']" :width="val['width']">
        <template slot-scope="scope">
          <div v-if="column === 'project' || column === 'name'">
            <span class="link-type" @click="openDialog(scope.row)">{{ scope.row[column] }}</span>
          </div>
          <div v-else-if="column === 'description'">
            <template v-if="scope.row['display_desc']  && scope.row[column] != ''">
              <el-button @click="dockerfile(scope.row)">点击收缩</el-button>
              <pre v-highlightjs><code class="Dockerfile">{{ scope.row[column] }}</code></pre>
            </template>
            <template v-else>
              <el-button @click="dockerfile(scope.row)">点击展开</el-button>
            </template>
            <!-- <pre v-highlightjs><code class="Dockerfile">{{ scope.row[column] }}</code></pre> -->
          </div>
          <div v-else>
            {{ scope.row[column] }}
          </div>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog v-el-drag-dialog :visible.sync="dialogTableVisible" title="Tag详情" width="60%">
      <el-table :data="gridData" border fit highlight-current-row>
        <el-table-column v-for="(val, column) in dialogTheads" :key="column" :label="val['label']" align="center" :width="val['width']">
          <template slot-scope="scope">
            <div v-if="column === 'pull_cmd' ">
              <el-button type="primary" icon="el-icon-document" @click="handleCopy(scope.row[column],$event)">
                copy
              </el-button>
            </div>
            <div v-else>
              {{ scope.row[column] }}
            </div>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>

  </div>
</template>

<script>
const defaultFormThead = ['jira_id']
const formTheadOptions = ['jira_id', 'commit_id', 'message', 'merge_date']
const fixFormTheads = {
  "id": { label: "id", width: "100", align: "center", },
  "project": { label: "所属项目", width: "", align: "center", },
  "name": { label: "镜像名称", width: "", align: "center", },
  "artifact_count": { label: "标签数", width: "130", align: "center", },
  "pull_count": { label: "下载数", width: "130", align: "center", },
  "update_time": { label: "最后一次更新时间", width: "250", align: "center", },
  "description": { label: "描述", width: "130", align: "center", },
}
const dialogTheads = {
  "digest": { label: "Digest", width: "600", },
  "tags": { label: "Tasg", width: "160", },
  "size": { label: "Size(MB)", width: "150", },
  "pull_cmd": { label: "Pull", width: "", },
}

import { fetchList, getProjects, getTags } from "@/api/harbor";
// import { decode_message, format_date } from "@/utils/util";
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination
import elDragDialog from '@/directive/el-drag-dialog' // base on element-ui
import clip from '@/utils/clipboard' // use clipboard directly
import clipboard from '@/directive/clipboard/index.js' // use clipboard by v-directive

export default {
  name: "Harbor",
  components: {
    Pagination,
  },
  directives: {
    elDragDialog,
    clipboard,
  },
  data() {
    return {
      list: null,
      listPage: null,
      listImage: null,
      listLoading: true,
      tableKey: 0,
      total: 0,
      listQuery: { page: 1, limit: 10, image: null, project: null, sort: "+id", },
      // listTest: null,
      fixFormTheads: fixFormTheads,
      formTheadOptions: formTheadOptions,
      checkboxVal: defaultFormThead, // checkboxVal
      formThead: defaultFormThead, // 默认表头 Default header
      dialogTheads: dialogTheads,

      dialogTableVisible: false,
      dialogStatus: '',

      gridData: [],
    };
  },
  created() {
    // this.getList();
    // this.getQueryCondition();

    this.$watch(
      () => this.$route.query,
      // console.log("repo1------------->" + this.$route.params.value),
      () => {
        this.init()
      },
      // 组件创建完后获取数据，
      // 此时 data 已经被 observed 了
      { immediate: true }
    )
  },
  watch: {
    checkboxVal(valArr) {
      // console.log("valArr------->", valArr)
      this.formThead = formTheadOptions.filter(i => valArr.indexOf(i) >= 0)
      this.tableKey = this.tableKey + 1// 为了保证table 每次都会重渲 In order to ensure the table will be re-rendered each time
    },
  },
  methods: {
    init() {
      this.getList()
    },
    getList() {
      this.listLoading = true;

      if (this.listQuery.page === 1) {
        fetchList(this.listQuery).then((response) => {
          this.list = response.data.items;
          this.listPage = this.list.slice(0, this.listQuery.page * this.listQuery.limit)
          this.total = response.data.total;
          this.listLoading = false;
          this.listImage = this.list.filter(this.filter_item).map(obj => { return { "value": obj.name } })
        });
      } else {
        this.listPage = this.list.slice((this.listQuery.page - 1) * this.listQuery.limit, this.listQuery.page * this.listQuery.limit)
        this.listLoading = false;
        this.listImage = this.list.filter(this.filter_item).map(obj => { return { "value": obj.name } })
      }
    },
    getListFilter() {
      this.listLoading = true;
      if (this.listQuery.page === 1) {
        var list = this.list.filter(this.filter_item)
        this.listPage = list.slice(0, this.listQuery.page * this.listQuery.limit)
        this.total = list.length;
      } else {
        this.listPage = this.list.slice((this.listQuery.page - 1) * this.listQuery.limit, this.listQuery.page * this.listQuery.limit)
      }
      this.listLoading = false;
      this.listImage = this.list.filter(this.filter_item).map(obj => { return { "value": obj.name } })
    },
    handleFilter() {
      this.listQuery.page = 1;
      this.getListFilter();
    },
    queryProjects(queryString, cb) {
      var projects = [];
      this.listQuery.project = queryString
      getProjects(this.listQuery).then((response) => {
        projects = response.data.items;
        // console.log("projects------->", projects)
      }).then(() => {
        var results = queryString ? projects.filter(this.createFilter(queryString)) : projects;
        cb(results);
      });
    },
    filter_item(item) {
      // console.log("this.listQuery----->", this.listQuery.project, this.listQuery.image)
      var result = true
      if (this.listQuery.project != '' && this.listQuery.project != null && item["project"] != this.listQuery.project) {
        // console.log("进入 project 过滤")
        result = false
      } else if (this.listQuery.image != '' && this.listQuery.image != null && item["name"] != this.listQuery.image) {
        // console.log("进入 image 过滤")
        result = false
      }
      return result
    },
    queryImages(queryString, cb) {
      var images = this.listImage
      // console.log("list----->", images)
      this.listQuery.image = queryString

      var results = queryString ? images.filter(this.createFilter(queryString)) : images;
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    createFilter(queryString) {
      return (restaurant) => {
        return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
      };
    },
    handleSelect(item) {
      // console.log(item.value);
    },
    clearQuery() {
      this.listQuery.project = ''
      this.listQuery.image = ''
      this.listImage = null
      this.getList()
    },
    openDialog(row) {
      var parms = { "project": row["project"], "image": row["name"] }
      getTags(parms).then((response) => {
        this.gridData = response.data.items;
        this.listLoading = false;
      }).then(
        this.dialogTableVisible = true
      );
    },
    handleCopy(text, event) {
      clip(text, event)
    },
    clipboardSuccess() {
      this.$message({
        message: 'Copy successfully',
        type: 'success',
        duration: 1500
      })
    },
    dockerfile(row) {
      if (row['description'] != 'N/A') {
        for (var key in this.fixFormTheads) {
          if (row['display_desc'] === false) {
            this.fixFormTheads['project']['width'] = '150'
            this.fixFormTheads['name']['width'] = '150'
            this.fixFormTheads['description']['width'] = ''
            this.fixFormTheads['description']['align'] = 'left'
          } else {
            this.fixFormTheads['project']['width'] = ''
            this.fixFormTheads['name']['width'] = ''
            this.fixFormTheads['description']['width'] = '130'
            this.fixFormTheads['description']['align'] = 'center'
          }
        }
      }
      row['display_desc'] = !row['display_desc']
    }
  },
};
</script>
