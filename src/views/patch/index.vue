<template>
  <div class="app-container">
    <div class="filter-container">
      <el-row class="demo-autocomplete">
        <el-col :span="5">
          补丁描述:
          <el-input class="common-input" v-model="listQuery.subject" placeholder="请输入内容">
          </el-input>
        </el-col>

        <!-- <el-col :span="4" v-for="(value,condition) in searchCondition" :key="condition">
          {{value.desc}}:
          <el-autocomplete :hide-loading=true class="inline-input" clearable v-model="listQuery.condition" :fetch-suggestions="value.queryFun" placeholder="请输入内容" @select="handleFilter">
          </el-autocomplete>
        </el-col> -->
        <el-col :span="4">
          项目:
          <el-autocomplete :hide-loading=true class="inline-input" clearable v-model="listQuery.project" :fetch-suggestions="queryProjects" placeholder="请输入内容" @select="handleFilter">
          </el-autocomplete>
        </el-col>
        <el-col :span="4">
          仓库:
          <el-autocomplete :hide-loading=true class="inline-input" clearable v-model="listQuery.repo" :fetch-suggestions="queryRepos" placeholder="请输入内容" @select="handleFilter">
          </el-autocomplete>
        </el-col>
        <el-col :span="4">
          分支:
          <el-autocomplete :hide-loading=true class="inline-input" clearable v-model="listQuery.branch" :fetch-suggestions="queryBranchs" placeholder="请输入内容" @select="handleFilter">
          </el-autocomplete>
        </el-col>
        <el-col :span="4">
          所有者:
          <el-autocomplete :hide-loading=true class="inline-input" clearable v-model="listQuery.owner" :fetch-suggestions="queryOwners" placeholder="请输入内容" @select="handleFilter">
          </el-autocomplete>
        </el-col>
        <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
          查找
        </el-button>
        <el-button class="filter-item" type="primary" @click="clearQuery">
          清除
        </el-button>
      </el-row>
      <el-checkbox-group v-model="checkboxVal">
        <el-checkbox v-for="val in formTheadOptions" :label="val" :key="val">
          {{val}}
        </el-checkbox>
      </el-checkbox-group>
    </div>

    <el-table v-loading="listLoading" :data="list" element-loading-text="Loading" border fit highlight-current-row>
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
            {{ decode_message(scope.row[column]) }}
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
const defaultFormThead = ['jira_id']
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

import { fetchList, getOwners } from "@/api/patch";
import { getProjects, getRepos, getBranchs } from "@/api/branch";
import { decode_message, format_date } from "@/utils/util";
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination

export default {
  name: "Branch",
  components: {
    Pagination,
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
      listLoading: true,
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: { page: 1, limit: 10, subject: undefined, project: undefined, owner: undefined, repo: undefined, branch: undefined, sort: "+id", },
      // listTest: null,
      // searchCondition: {
      //   "project": { "desc": "项目", "queryFun": this.queryProjects },
      //   "repo": { "desc": "仓库", "queryFun": this.queryRepos },
      //   "branch": { "desc": "分支", "queryFun": this.queryBranchs },
      //   "owner": { "desc": "拥有者", "queryFun": this.queryOwners }
      // },
      fixFormTheads: fixFormTheads,
      checkForTheads: checkForTheads,
      formTheadOptions: formTheadOptions,
      checkboxVal: defaultFormThead, // checkboxVal
      formThead: defaultFormThead // 默认表头 Default header
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
      if (this.$route.query.branch) this.listQuery.branch = this.$route.query.branch
      this.listLoading = true;
      fetchList(this.listQuery).then((response) => {
        this.list = response.data.items;
        this.total = response.data.total;
        this.listLoading = false;
        // Just to simulate the time of the request
        // setTimeout(() => { this.listLoading = false; }, 0 * 1000);
      });
    },
    getList() {
      this.listLoading = true;
      fetchList(this.listQuery).then((response) => {
        this.list = response.data.items;
        this.total = response.data.total;
        this.listLoading = false;
        // Just to simulate the time of the request
        // setTimeout(() => { this.listLoading = false; }, 0 * 1000);
      });
    },
    /*getQueryCondition() {
      // getSubjects().then((response) => {
      //   this.subjects = response.data.items;
      // });
      getProjects().then((response) => {
        this.projects = response.data.items;
      });
      getOwners().then((response) => {
        this.owners = response.data.items;
      });
      getRepos().then((response) => {
        this.repos = response.data.items;
      });
      getBranchs().then((response) => {
        this.branchs = response.data.items;
      });
    },*/
    handleFilter() {
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
        // 调用 callback 返回建议列表的数据
        cb(results);
      })
    },
    queryBranchs(queryString, cb) {
      var branchs = [];
      this.listQuery.branch = queryString
      getBranchs(this.listQuery).then((response) => {
        branchs = response.data.items;
      }).then(() => {
        var results = queryString ? branchs.filter(this.createFilter(queryString)) : branchs;
        // 调用 callback 返回建议列表的数据
        cb(results);
      })
    },
    queryOwners(queryString, cb) {
      var owners = [];
      this.listQuery.owner = queryString
      getOwners(this.listQuery).then((response) => {
        owners = response.data.items;
      }).then(() => {
        var results = queryString ? owners.filter(this.createFilter(queryString)) : owners;
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
      console.log(item.value);
    },
    clearQuery() {
      this.listQuery.project = ''
      this.listQuery.repo = ''
      this.listQuery.branch = ''
      this.listQuery.owner = ''
    }
  },
};
</script>
