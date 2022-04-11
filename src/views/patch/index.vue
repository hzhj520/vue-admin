<template>
  <div class="app-container">
    <div class="filter-container">
      <!-- <el-input v-model="listQuery.subject" placeholder="Subject" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-select v-model="listQuery.importance" placeholder="Imp" clearable style="width: 90px" class="filter-item">
        <el-option v-for="item in importanceOptions" :key="item" :label="item" :value="item" />
      </el-select>
      <el-select v-model="listQuery.type" placeholder="Type" clearable class="filter-item" style="width: 130px">
        <el-option v-for="item in calendarTypeOptions" :key="item.key" :label="item.display_name+'('+item.key+')'" :value="item.key" />
      </el-select>
      <el-select v-model="listQuery.sort" style="width: 140px" class="filter-item" @change="handleFilter">
        <el-option v-for="item in sortOptions" :key="item.key" :label="item.label" :value="item.key" />
      </el-select> -->

      <el-row class="demo-autocomplete">
        <el-col :span="5">
          补丁描述:
          <el-input class="common-input" v-model="listQuery.subject" placeholder="请输入内容">
          </el-input>
          <!-- <el-input class="inline-input" v-model="listQuery.subject" placeholder="请输入内容" >
          </el-input> -->
        </el-col>
        <el-col :span="4">
          项目:
          <el-autocomplete :hide-loading=true class="inline-input" v-model="listQuery.project" :fetch-suggestions="queryProjects" placeholder="请输入内容" @select="handleFilter">
          </el-autocomplete>
        </el-col>
        <el-col :span="4">
          仓库:
          <el-autocomplete :hide-loading=true class="inline-input" v-model="listQuery.repo" :fetch-suggestions="queryRepos" placeholder="请输入内容" @select="handleFilter">
          </el-autocomplete>
        </el-col>
        <el-col :span="4">
          分支:
          <el-autocomplete :hide-loading=true class="inline-input" v-model="listQuery.branch" :fetch-suggestions="queryBranchs" placeholder="请输入内容" @select="handleFilter">
          </el-autocomplete>
        </el-col>
        <el-col :span="4">
          所有者:
          <el-autocomplete :hide-loading=true class="inline-input" v-model="listQuery.owner" :fetch-suggestions="queryOwners" placeholder="请输入内容" @select="handleFilter">
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
        <el-checkbox label="commit_id">
          commit_id
        </el-checkbox>
        <el-checkbox label="jira_id">
          jira_id
        </el-checkbox>
        <el-checkbox label="message">
          message
        </el-checkbox>
      </el-checkbox-group>
    </div>

    <el-table v-loading="listLoading" :data="list" element-loading-text="Loading" border fit highlight-current-row>
      <el-table-column align="center" label="gerrit_id" width="80">
        <template slot-scope="scope">
          <!-- {{ scope.$index + 1 + (listQuery.page - 1) * listQuery.limit }} -->
          <a class="link-type" :href="scope.row.gerrit_url" target="_blank">
            {{ scope.row.gerrit_id }}
          </a>
        </template>
      </el-table-column>
      <el-table-column label="补丁描述" align="center">
        <template slot-scope="scope">
          <a class="link-type" :href="scope.row.gerrit_url" target="_blank">
            {{ scope.row.subject }}
          </a>
        </template>
      </el-table-column>
      <el-table-column label="项目" width="150" align="center">
        <template slot-scope="scope">
          {{ scope.row.project }}
        </template>
      </el-table-column>
      <el-table-column label="仓库" align="center">
        <template slot-scope="scope">
          {{ scope.row.repo }}
        </template>
      </el-table-column>
      <el-table-column label="分支" width="200" align="center">
        <template slot-scope="scope">
          {{ scope.row.branch }}
        </template>
      </el-table-column>
      <el-table-column label="所有者" width="200" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.owner }}</span>
        </template>
      </el-table-column>

      <el-table-column v-for="column in formThead" :key="column" :label="column" align="center">
        <template slot-scope="scope">
          <div v-if="column==='message'">
            {{ decode_message(scope.row[column]) }}
          </div>
          <div v-else>
            {{ scope.row[column] }}
          </div>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
  </div>
</template>

<script>
const defaultFormThead = ['jira_id']
let Base64 = require('js-base64').Base64;
import { fetchList, getOwners } from "@/api/patch";
import { getProjects, getRepos, getBranchs } from "@/api/branch";
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
      list: null,
      listLoading: true,
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 10,
        subject: undefined,
        project: undefined,
        owner: undefined,
        repo: undefined,
        branch: undefined,
        sort: "+id",
      },
      listTest: null,
      formTheadOptions: ['commit_id', 'jira_id', 'message'],
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
      this.formThead = this.formTheadOptions.filter(i => valArr.indexOf(i) >= 0)
      this.tableKey = this.tableKey + 1// 为了保证table 每次都会重渲 In order to ensure the table will be re-rendered each time
      console.log(Base64.decode("bW9kaWZ5IGduJm5pbmphIHBhdGguCgpDaGFuZ2UtSWQ6IEk3NjU2ZDlhZDU5OGQyYTc2ZTA4YTUzNTZlMGNkNmYxOTE0MGMxNTgyCg=="))
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
    clearQuery(item) {
      this.listQuery.project = ''
      this.listQuery.repo = ''
      this.listQuery.branch = ''
      this.listQuery.owner = ''
    },
    decode_message(message) {
      return Base64.decode(message)
    }
  },
};
</script>
