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
        <el-col :span="4">
          补丁描述:
          <el-autocomplete class="inline-input" v-model="listQuery.subject" :fetch-suggestions="querySubjects" placeholder="请输入内容" @select="handleFilter">
          </el-autocomplete>
        </el-col>
        <el-col :span="4">
          项目:
          <el-autocomplete class="inline-input" v-model="listQuery.project" :fetch-suggestions="queryProjects" placeholder="请输入内容" @select="handleFilter">
          </el-autocomplete>
        </el-col>
        <el-col :span="4">
          仓库:
          <el-autocomplete class="inline-input" v-model="listQuery.repo" :fetch-suggestions="queryRepos" placeholder="请输入内容" @select="handleFilter">
          </el-autocomplete>
        </el-col>
        <el-col :span="4">
          分支:
          <el-autocomplete class="inline-input" v-model="listQuery.branch" :fetch-suggestions="queryBranchs" placeholder="请输入内容" @select="handleFilter">
          </el-autocomplete>
        </el-col>
        <el-col :span="4">
          所有者:
          <el-autocomplete class="inline-input" v-model="listQuery.owner" :fetch-suggestions="queryOwners" placeholder="请输入内容" @select="handleFilter">
          </el-autocomplete>
        </el-col>
        <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
          查找
        </el-button>
      </el-row>
      <br>
    </div>

    <el-table v-loading="listLoading" :data="list" element-loading-text="Loading" border fit highlight-current-row>
      <el-table-column align="center" label="序号" width="95">
        <template slot-scope="scope">
          {{ scope.$index + 1 + (listQuery.page - 1) * listQuery.limit }}
        </template>
      </el-table-column>
      <el-table-column label="补丁描述" align="center">
        <template slot-scope="scope">
          {{ scope.row.subject }}
        </template>
      </el-table-column>
      <el-table-column label="项目" width="310" align="center">
        <template slot-scope="scope">
          {{ scope.row.project }}
        </template>
      </el-table-column>
      <el-table-column label="仓库" width="410" align="center">
        <template slot-scope="scope">
          {{ scope.row.repo }}
        </template>
      </el-table-column>
      <el-table-column label="分支" width="310" align="center">
        <template slot-scope="scope">
          {{ scope.row.branch }}
        </template>
      </el-table-column>
      <el-table-column label="所有者" width="210" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.owner }}</span>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
  </div>
</template>

<script>
import { fetchList, getSubjects, getOwners, getRepos, getBranchs } from "@/api/patch";
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
        owner: undefined,
        repo: undefined,
        branch: undefined,
        sort: "+id",
      },
      listTest: null,
    };
  },
  created() {
    // this.getList();
    this.getQueryCondition();

    this.$watch(
      () => this.$route.query,
      // console.log("repo1------------->" + this.$route.params.value),
      () => {
        this.getList()
      },
      // 组件创建完后获取数据，
      // 此时 data 已经被 observed 了
      { immediate: true }
    )
  },
  methods: {
    getList() {
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
    getQueryCondition() {
      getSubjects().then((response) => {
        this.subjects = response.data.items;
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
    },
    handleFilter() {
      this.listQuery.page = 1;
      this.getList();
    },
    querySubjects(queryString, cb) {
      var subjects = this.subjects;
      var results = queryString ? subjects.filter(this.createFilter(queryString)) : subjects;
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    queryOwners(queryString, cb) {
      var owners = this.owners;
      var results = queryString ? owners.filter(this.createFilter(queryString)) : owners;
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    queryRepos(queryString, cb) {
      var repos = this.repos;
      var results = queryString ? repos.filter(this.createFilter(queryString)) : repos;
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    queryBranchs(queryString, cb) {
      var branchs = this.branchs;
      var results = queryString ? branchs.filter(this.createFilter(queryString)) : branchs;
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    createFilter(queryString) {
      return (restaurant) => {
        return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
      };
    },
    handleSelect(item) {
      console.log(item.value);
    },
  },
};
</script>
