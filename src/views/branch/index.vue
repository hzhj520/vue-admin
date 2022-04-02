<template>
  <div class="app-container">
    <div class="filter-container">
      <!-- <el-input v-model="listQuery.project" placeholder="Project" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
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
          项目经理:
          <el-autocomplete class="inline-input" v-model="listQuery.owner" :fetch-suggestions="queryOwners" placeholder="请输入内容" @select="handleFilter">
          </el-autocomplete>
        </el-col>
        <!-- <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
          查找
        </el-button> -->
        <el-button class="filter-item" type="primary" icon="el-icon-search" @click="clearQuery">
          清除查询条件
        </el-button>
      </el-row>
      <br>
    </div>

    <el-table v-loading="listLoading" :data="list" element-loading-text="Loading" border fit highlight-current-row>
      <el-table-column align="center" label="序号" width="100">
        <template slot-scope="scope">
          {{ scope.$index + 1 + (listQuery.page - 1) * listQuery.limit }}
        </template>
      </el-table-column>
      <el-table-column label="项目" width="410" align="center">
        <template slot-scope="scope">
          <span class="link-type" @click="handleRouter(scope.row.project, '', '')">
            {{ scope.row.project }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="仓库" align="center">
        <template slot-scope="scope">
          <span class="link-type" @click="handleRouter(scope.row.project, scope.row.repo, '')">
            {{ scope.row.repo }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="分支" width="410" align="center">
        <template slot-scope="scope">
          <span class="link-type" @click="handleRouter(scope.row.project, '', scope.row.branch)">
            {{ scope.row.branch }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="项目经理" width="310" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.owner }}</span>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
  </div>
</template>

<script>
import { fetchList, getProjects, getOwners, getRepos, getBranchs } from "@/api/branch";
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
        project: undefined,
        owner: undefined,
        repo: undefined,
        branch: undefined,
        sort: "+id",
      },
      listTest: null,
    };
  },
  created() {
    this.getList();
    // this.getQueryCondition();
  },
  methods: {
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
    getQueryCondition() {
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
    },
    handleFilter() {
      this.listQuery.page = 1;
      this.getList();
    },
    queryCondition(queryString, name) {
      console.log("name------------->" + name)
      switch (name) {
        case "projects":
          console.log("projects------------->" + queryString)
          this.listQuery.project = queryString
          getProjects(this.listQuery).then((response) => {
            this.projects = response.data.items;
          }).then(() => {
            console.log("projects2------------->" + this.projects)

          });
          break;
        case "owners":
          console.log("owners------------->" + queryString)
          this.listQuery.owner = queryString
          getOwners(this.listQuery).then((response) => {
            this.owners = response.data.items;
          });
          break;
        case "repos":
          console.log("repos------------->" + queryString)
          this.listQuery.repo = queryString
          getRepos(this.listQuery).then((response) => {
            this.repos = response.data.items;
          });
          break;
        case "branchs":
          console.log("branchs------------->" + queryString)
          this.listQuery.branch = queryString
          getBranchs(this.listQuery).then((response) => {
            this.branchs = response.data.items;
          });
          break;
      }
    },
    // queryProjects(queryString, cb) {
    //   this.projects = []
    //   console.log("projects1------------->" + this.projects)
    //   this.queryCondition(queryString, "projects")
    //   var projects = this.projects;
    //   var results = queryString ? projects.filter(this.createFilter(queryString)) : projects;
    //   // 调用 callback 返回建议列表的数据
    //   cb(results);
    // },
    // queryRepos(queryString, cb) {
    //   this.queryCondition(queryString, "repos")
    //   var repos = this.repos;
    //   var results = queryString ? repos.filter(this.createFilter(queryString)) : repos;
    //   // 调用 callback 返回建议列表的数据
    //   cb(results);
    // },
    // queryBranchs(queryString, cb) {
    //   this.queryCondition(queryString, "branchs")
    //   var branchs = this.branchs;
    //   var results = queryString ? branchs.filter(this.createFilter(queryString)) : branchs;
    //   // 调用 callback 返回建议列表的数据
    //   cb(results);
    // },
    // queryOwners(queryString, cb) {
    //   this.queryCondition(queryString, "owners")
    //   var owners = this.owners;
    //   var results = queryString ? owners.filter(this.createFilter(queryString)) : owners;
    //   // 调用 callback 返回建议列表的数据
    //   cb(results);
    // },
    queryProjects(queryString, cb) {
      this.projects = []
      console.log("projects1------------->" + this.projects)
      this.listQuery.project = queryString
      getProjects(this.listQuery).then((response) => {
        this.projects = response.data.items;
      }).then(() => {
        console.log("projects2------------->" + this.projects)
        var projects = this.projects;
        var results = queryString ? projects.filter(this.createFilter(queryString)) : projects;
        // 调用 callback 返回建议列表的数据
        cb(results);

      });
      // this.queryCondition(queryString, "projects")
    },
    queryRepos(queryString, cb) {
      this.repos = []
      getRepos(this.listQuery).then((response) => {
        this.repos = response.data.items;
      }).then(() => {
        var repos = this.repos;
        var results = queryString ? repos.filter(this.createFilter(queryString)) : repos;
        // 调用 callback 返回建议列表的数据
        cb(results);
      });
    },
    queryBranchs(queryString, cb) {
      this.branchs = []
      getBranchs(this.listQuery).then((response) => {
        this.branchs = response.data.items;
      }).then(() => {
        var branchs = this.branchs;
        var results = queryString ? branchs.filter(this.createFilter(queryString)) : branchs;
        // 调用 callback 返回建议列表的数据
        cb(results);
      });
    },
    queryOwners(queryString, cb) {
      this.owners = []
      getOwners(this.listQuery).then((response) => {
        this.owners = response.data.items;
      }).then(() => {
        var owners = this.owners;
        var results = queryString ? owners.filter(this.createFilter(queryString)) : owners;
        // 调用 callback 返回建议列表的数据
        cb(results);
      });
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
    handleRouter(project, repo, branch) {
      // this.$router.push({path:'/codemanage/patch'})
      // 变成 /user?id=2
      this.$router.push({
        path: '/codemanage/patch',
        query: {
          project: project,
          repo: repo,
          branch: branch,
        }
      })
    }
  },
};
</script>
