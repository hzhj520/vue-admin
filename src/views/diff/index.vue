<template>
  <div class="app-container">
    <div class="filter-container">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="按时间比较" name="time">
          <el-row class="demo-autocomplete">
            <el-col :span="4">
              仓库:
              <el-autocomplete :hide-loading=true class="inline-input" clearable v-model="listQuery.repo" :fetch-suggestions="queryRepos" placeholder="请输入内容">
              </el-autocomplete>
            </el-col>
            <el-col :span="5">
              开始日期:
              <el-date-picker v-model="listQuery.startDate" type="date" placeholder="选择日期">
              </el-date-picker>
            </el-col>
            <el-col :span="5">
              结束日期:
              <el-date-picker v-model="listQuery.endDate" type="date" placeholder="选择日期">
              </el-date-picker>
            </el-col>
            <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
              比对
            </el-button>
            <el-button class="filter-item" type="primary" @click="clearQuery">
              清除
            </el-button>
          </el-row>
        </el-tab-pane>
        <el-tab-pane label="按分支比较" name="branch">
          <el-row class="demo-autocomplete">
            <el-col :span="4">
              仓库:
              <el-autocomplete :hide-loading=true class="inline-input" clearable v-model="listQuery.repo" :fetch-suggestions="queryRepos" placeholder="请输入内容">
              </el-autocomplete>
            </el-col>
            <el-col :span="4">
              分支1:
              <el-autocomplete :hide-loading=true class="inline-input" clearable v-model="listQuery.branch1" :fetch-suggestions="queryBranch1" :disabled="branchStatus" placeholder="请输入内容">
              </el-autocomplete>
            </el-col>
            <el-col :span="4">
              分支2:
              <el-autocomplete :hide-loading=true class="inline-input" clearable v-model="listQuery.branch2" :fetch-suggestions="queryBranch2" :disabled="branchStatus" placeholder="请输入内容">
              </el-autocomplete>
            </el-col>
            <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
              比对
            </el-button>
            <el-button class="filter-item" type="primary" @click="clearQuery">
              清除
            </el-button>
          </el-row>
        </el-tab-pane>
        <el-tab-pane label="按TAG比较" name="tag">
          <el-row class="demo-autocomplete">
            <el-col :span="4">
              仓库:
              <el-autocomplete :hide-loading=true class="inline-input" clearable v-model="listQuery.repo" :fetch-suggestions="queryRepos" placeholder="请输入内容">
              </el-autocomplete>
            </el-col>
            <el-col :span="4">
              Tag1:
              <el-autocomplete :hide-loading=true class="inline-input" clearable v-model="listQuery.tag1" :disabled="tagStatus" :fetch-suggestions="queryTag1" placeholder="请输入内容">
              </el-autocomplete>
            </el-col>
            <el-col :span="4">
              Tag2:
              <el-autocomplete :hide-loading=true class="inline-input" clearable v-model="listQuery.tag2" :disabled="tagStatus" :fetch-suggestions="queryTag2" placeholder="请输入内容">
              </el-autocomplete>
            </el-col>
            <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
              比对
            </el-button>
            <el-button class="filter-item" type="primary" @click="clearQuery">
              清除
            </el-button>
          </el-row>
        </el-tab-pane>
      </el-tabs>

      <el-checkbox-group v-model="checkboxVal">
        <el-checkbox v-for="val in formTheadOptions" :label="val" :key="val">
          {{val}}
        </el-checkbox>
      </el-checkbox-group>
    </div>

    <el-table v-loading="listLoading" :data="listPage" element-loading-text="Loading" border fit highlight-current-row>
      <el-table-column v-for="(val, column) in fixFormTheads" :key="column" :label="val['label']" align="center" :width="val['width']">
        <template slot-scope="scope">
          <div v-if="column === 'subject' || column ==='gerrit_id'">
            <a class="link-type" :href="scope.row.gerrit_url" target="_blank">
              {{ scope.row[column] }}
            </a>
          </div>
          <div v-else>
            {{ scope.row[column] }}
          </div>
        </template>
      </el-table-column>

      <el-table-column v-for="column in formThead" :key="column" :label="checkForTheads[column]['label']" align="center" :width="checkForTheads[column]['width']">
        <template slot-scope="scope">
          <span v-if="column==='message'">
            <prism language="git" :plugins="['numbers']" :code="decode_message(scope.row[column])"></prism>
          </span>
          <span v-else-if="column==='merge_date'">
            {{ format_date(scope.row[column]) }}
          </span>
          <span v-else-if="column==='jira_id'">
            <span v-if="scope.row[column]===''">
              N/A
            </span>
            <span v-else>
              <a class="link-type" :href="'http://jira.eswin.com/browse/' + scope.row[column]" target="_blank">
                {{ scope.row[column] }}
              </a>
            </span>
          </span>
          <span v-else>
            {{ scope.row[column] }}
          </span>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
  </div>
</template>

<script>
const defaultFormThead = ['jira_id', 'merge_date']
const formTheadOptions = ['jira_id', 'commit_id', 'message', 'merge_date']
const fixFormTheads = {
  "gerrit_id": { label: "gerrit_id", width: "80", },
  "subject": { label: "补丁描述", width: "", },
  "project": { label: "项目", width: "150", },
  "repo": { label: "仓库", width: "200", },
  "branch": { label: "分支", width: "200", },
  "owner": { label: "所有者", width: "200", }
}
const checkForTheads = {
  "jira_id": { label: "jira_id", width: "150", },
  "commit_id": { label: "commit_id", width: "", },
  "message": { label: "message", width: "", },
  "merge_date": { label: "merge_date", width: "", },
}

import { dateDiff, branchDiff, tagDiff, getTags } from "@/api/patch";
import { getProjects, getRepos, getBranchs } from "@/api/branch";
import { decode_message, format_date } from "@/utils/util";
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination
import Prism from 'vue-prismjs'
import 'prismjs/themes/prism.css'

export default {
  name: "Branch",
  components: {
    Pagination,
    Prism
  },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: "success",
        draft: "gray",
        deleted: "danger",
      };
      return statusMap[status];
    },
  },
  data() {
    return {
      decode_message: decode_message,
      format_date: format_date,

      list: null,
      listPage: null,
      listLoading: true,
      tableKey: 0,
      total: 0,
      page: 1,
      limit: 10,
      listQuery: { page: 1, limit: 10, project: null, repo: null, branch1: null, branch2: null, startDate: null, endDate: null, tag1: null, tag2: null },

      fixFormTheads: fixFormTheads,
      checkForTheads: checkForTheads,
      formTheadOptions: formTheadOptions,
      checkboxVal: defaultFormThead, // checkboxVal
      formThead: defaultFormThead, // 默认表头 Default header

      activeName: 'time',
      branchStatus: false,
      tagStatus: false,
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
      if (this.$route.query.project) this.listQuery.project = this.$route.query.project
      if (this.$route.query.repo) this.listQuery.repo = this.$route.query.repo
      // if (this.$route.query.branch) this.listQuery.branch = this.$route.query.branch
      this.listLoading = false;
      // fetchList(this.listQuery).then((response) => {
      //   this.list = response.data.items;
      //   this.total = response.data.total;
      //   this.listLoading = false;
      // });
    },
    getList() {
      if (this.listQuery.repo === null) {
        alert("仓库不能为空！")
        this.listLoading = false;
        return
      }
      this.listLoading = true;
      if (this.activeName === 'branch') {
        if (this.listQuery.branch1 === this.listQuery.branch2) {
          alert("请选择不同的分支进行比较！")
          this.listLoading = false;
          return
        } else if (this.listQuery.repo === null || this.listQuery.branch1 === null || this.listQuery.branch2 === null) {
          alert("分支均不能为空！")
          this.listLoading = false;
          return
        }
        if (this.listQuery.page === 1) {
          branchDiff(this.listQuery).then((response) => {
            this.list = response.data.items;
            this.listPage = this.list.slice(0, this.listQuery.page * this.listQuery.limit)
            this.total = response.data.total;
            this.listLoading = false;
          });
        } else {
          this.listPage = this.list.slice((this.listQuery.page - 1) * this.listQuery.limit, this.listQuery.page * this.listQuery.limit)
          this.listLoading = false;
        }
      } else if (this.activeName === 'tag') {
        if (this.listQuery.tag1 === this.listQuery.tag2) {
          alert("请选择不同的Tag进行比较！")
          this.listLoading = false;
          return
        } else if (this.listQuery.repo === null || this.listQuery.tag1 === null || this.listQuery.tag2 === null) {
          alert("分支均不能为空！")
          this.listLoading = false;
          return
        }
        if (this.listQuery.page === 1) {
          tagDiff(this.listQuery).then((response) => {
            this.list = response.data.items;
            this.listPage = this.list.slice(0, this.listQuery.page * this.listQuery.limit)
            this.total = response.data.total;
            this.listLoading = false;
          });
        } else {
          this.listPage = this.list.slice((this.listQuery.page - 1) * this.listQuery.limit, this.listQuery.page * this.listQuery.limit)
          this.listLoading = false;
        }
      } else if (this.activeName === 'time') {
        if (this.listQuery.startDate === null || this.listQuery.endDate === null) {
          alert("开始时间和结束时间不能为空")
          this.listLoading = false;
          return
        } else if (this.listQuery.startDate >= this.listQuery.endDate) {
          alert("开始时间必须早于结束时间")
          this.listLoading = false;
          return
        }
        console.log("page----->", this.listQuery.page)
        dateDiff(this.listQuery).then((response) => {
          this.list = response.data.items;
          this.listPage = this.list
          this.total = response.data.total;
          this.listLoading = false;
        });
      }
    },
    handleFilter() {
      // console.log(this.activeName)
      this.listQuery.page = 1;
      this.getList();
    },
    queryProjects(queryString, cb) {
      var projects = [];
      this.listQuery.project = queryString
      getProjects(this.listQuery).then((response) => {
        projects = response.data.items;
      }).then(() => {
        var results = queryString ? projects.filter(this.createFilter(queryString)) : projects;
        cb(results);
      });
    },
    queryRepos(queryString, cb) {
      var repos = [];
      this.listQuery.repo = queryString
      getRepos(this.listQuery).then((response) => {
        repos = response.data.items;
      }).then(() => {
        var results = queryString ? repos.filter(this.createFilter(queryString)) : repos;
        cb(results);
        // 调用 callback 返回建议列表的数据
        this.listQuery.branch1 = null
        this.listQuery.branch2 = null
        this.branchStatus = false
        this.tagStatus = false
      })
    },
    queryBranch1(queryString, cb) {
      console.log("this.listQuery.repo------>", this.listQuery.repo)
      if (this.listQuery.repo === null || this.listQuery.repo === '') {
        alert("请先选择仓库")
        this.branchStatus = true
        cb([])
        return
      }
      var branchs = [];
      this.listQuery.branch1 = queryString
      getBranchs(this.listQuery).then((response) => {
        branchs = response.data.items;
      }).then(() => {
        var results = queryString ? branchs.filter(this.createFilter(queryString)) : branchs;
        // 调用 callback 返回建议列表的数据
        cb(results);
      })
    },
    queryBranch2(queryString, cb) {
      console.log("this.listQuery.repo------>", this.listQuery.repo)
      if (this.listQuery.repo === null || this.listQuery.repo === '') {
        alert("请先选择仓库")
        this.branchStatus = true
        cb([])
        return
      }
      var branchs = [];
      this.listQuery.branch2 = queryString
      getBranchs(this.listQuery).then((response) => {
        branchs = response.data.items;
      }).then(() => {
        var results = queryString ? branchs.filter(this.createFilter(queryString)) : branchs;
        // 调用 callback 返回建议列表的数据
        cb(results);
      })
    },
    queryTag1(queryString, cb) {
      console.log("this.listQuery.repo------>", this.listQuery.repo)
      if (this.listQuery.repo === null || this.listQuery.repo === '') {
        alert("请先选择仓库")
        this.tagStatus = true
        cb([])
        return
      }
      var tags = [];
      this.listQuery.tag1 = queryString
      getTags(this.listQuery).then((response) => {
        tags = response.data.items;
      }).then(() => {
        var results = queryString ? tags.filter(this.createFilter(queryString)) : tags;
        // 调用 callback 返回建议列表的数据
        cb(results);
      })
    },
    queryTag2(queryString, cb) {
      console.log("this.listQuery.repo------>", this.listQuery.repo)
      if (this.listQuery.repo === null || this.listQuery.repo === '') {
        alert("请先选择仓库")
        this.tagStatus = true
        cb([])
        return
      }
      var tags = [];
      this.listQuery.tag2 = queryString
      getTags(this.listQuery).then((response) => {
        tags = response.data.items;
      }).then(() => {
        var results = queryString ? tags.filter(this.createFilter(queryString)) : tags;
        // 调用 callback 返回建议列表的数据
        cb(results);
      })
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
      this.listQuery.repo = ''
      this.listQuery.branch1 = ''
      this.listQuery.branch2 = ''
      this.listQuery.tag1 = ''
      this.listQuery.tag2 = ''
      this.listQuery.startDate = ''
      this.listQuery.endDate = ''
    },
    handleClick(event) {
      console.log(this.activeName);
      this.listPage = null;
      this.total = 0;
      // console.log(this.listPage)
      // console.log(this.list)
    }
  },
};
</script>
