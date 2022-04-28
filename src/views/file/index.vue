<template>
  <div class="app-container">
    <div class="filter-container">
      <el-col :span="3">
        <el-autocomplete :hide-loading=true class="inline-input" clearable v-model="listQuery.title" :fetch-suggestions="queryTitles" placeholder="标题" @select="handleFilter">
        </el-autocomplete>
      </el-col>
      <el-col :span="3">
        <el-select v-model="listQuery.name" placeholder="Name" clearable class="filter-item" @change="queryVersions">
          <el-option v-for="item in names" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-col>
      <el-col :span="3">
        <el-select v-model="listQuery.version" placeholder="Version" clearable class="filter-item">
          <el-option v-for="item in versions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-col>
      <!-- <el-select v-model="listQuery.sort" style="width: 140px" class="filter-item" @change="handleFilter">
        <el-option v-for="item in sortOptions" :key="item.key" :label="item.label" :value="item.key" />
      </el-select> -->
      <el-col :span="5">
        <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
          Search
        </el-button>
        <el-button class="filter-item" style="margin-left: 10px;" type="success" icon="el-icon-edit" @click="handleCreate">
          Add
        </el-button>
      </el-col>
      <!-- <el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">
        Export
      </el-button> -->
    </div>

    <el-table :key="tableKey" v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%;" @sort-change="sortChange">
      <el-table-column label="序号" prop="id" sortable="custom" align="center" width="80" :class-name="getSortClass('id')">
        <template slot-scope="scope">
          {{ scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column label="软件名称" width="110px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="版本号" width="110px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.version }}</span>
        </template>
      </el-table-column>
      <el-table-column label="标题" min-width="100px" align="center">
        <template slot-scope="{row}">
          <span class="link-type" @click="handleUpdate(row)">{{ row.title }}</span>
        </template>
      </el-table-column>
      <el-table-column label="描述" min-width="200px">
        <template slot-scope="{row}">
          <span class="link-type" @click="handleUpdate(row)">{{ row.description }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Date" width="160px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.created_at | date('yyyy-MM-dd hh:mm')}}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" class-name="status-col" width="100">
        <template slot-scope="{row}">
          <el-tag :type="row.status | statusFilter">
            {{ row.status }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="300" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            编辑
          </el-button>
          <el-button v-if="row.status!='published'" size="mini" type="success" @click="handleModifyStatus(row,'published')">
            发布
          </el-button>
          <el-button v-if="row.status!='draft'" size="mini" @click="handleModifyStatus(row,'draft')">
            撤回
          </el-button>
          <el-button v-if="row.status!='deleted'" size="mini" type="danger" @click="handleDelete(row,$index)">
            删除
          </el-button>
          <el-button size="mini" type="success" @click="upload(row)">
            上传包
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="100px" style="width: 700px; margin-left:50px;">

        <el-form-item label="软件名称" prop="name">
          <!-- <el-input v-model="temp.name" /> -->
          <!-- <el-col :span="3"> -->
          <el-autocomplete :hide-loading=true class="inline-input" clearable v-model="temp.name" :fetch-suggestions="queryNames" placeholder="文件名">
          </el-autocomplete>
          <!-- </el-col> -->
        </el-form-item>
        <el-form-item label="标题" prop="title">
          <el-input v-model="temp.title" />
        </el-form-item>
        <el-form-item label="Status">
          <el-select v-model="temp.status" class="filter-item" placeholder="Please select">
            <el-option v-for="item in statusOptions" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item label="版本号" prop="version">
          <el-input v-model="temp.version" />
        </el-form-item>
        <el-form-item label="软件描述">
          <el-input v-model="temp.description" :autosize="{ minRows: 8, maxRows: 40}" type="textarea" placeholder="Please input" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          确认
        </el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="dialogUploadVisible" title="上传软件包" width="40%">
      <Upload @func="uploadFinish" :fileInfo='fileInfo'></Upload>
    </el-dialog>

  </div>
</template>

<script>
import { fetchList, deleteFileInfo, getTitles, getNames, getVersions, createFileInfo, updateFileInfo } from '@/api/file'
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import Upload from './components/upload' // secondary package based on el-pagination
// import FileDetail from './components/FileDetail'


export default {
  name: 'FileManage',
  components: { Pagination, Upload,  },
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
    },
    typeFilter(type) {
      return calendarTypeKeyValue[type]
    }
  },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        name: undefined,
        title: undefined,
        version: undefined,
        sort: '+id'
      },
      names: null,
      versions: null,
      importanceOptions: [1, 2, 3],
      sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
      statusOptions: ['published', 'draft'],
      temp: {
        id: undefined,
        importance: 1,
        remark: '',
        timestamp: new Date(),
        title: '',
        type: '',
        status: 'published'
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '创建'
      },
      dialogUploadVisible: false,
      fileInfo: null,
      rules: {
        timestamp: [{ type: 'date', required: true, message: 'timestamp is required', trigger: 'change' }],
        title: [{ required: true, message: 'title is required', trigger: 'blur' }],
        version: [{ required: true, message: 'title is required', trigger: 'blur' }]
      },
      downloadLoading: false
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      console.log(this.listQuery)
      fetchList(this.listQuery).then(response => {
        // console.log(typeof this.listQuery)
        this.list = response.data.items
        this.total = response.data.total
        this.listLoading = false
      }).then(() => {
        this.getNames()
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleModifyStatus(row, status) {
      this.$message({
        message: '操作Success',
        type: 'success'
      })
      row.status = status
    },
    sortChange(data) {
      const { prop, order } = data
      if (prop === 'id') {
        this.sortByID(order)
      }
    },
    sortByID(order) {
      if (order === 'ascending') {
        this.listQuery.sort = '+id'
      } else {
        this.listQuery.sort = '-id'
      }
      this.handleFilter()
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        importance: 1,
        remark: '',
        timestamp: new Date(),
        title: '',
        status: 'published',
        type: ''
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.temp.id = parseInt(Math.random() * 100) + 1024 // mock a id
          this.temp.author = 'vue-element-admin'
          createFileInfo(this.temp).then(() => {
            this.list.unshift(this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: 'Created Successfully',
              type: 'success',
              duration: 2000
            })
          }).then(() => {
            this.getList()
          })
        }
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      //   this.temp.timestamp = new Date(this.temp.timestamp)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          console.log(typeof tempData)
          updateFileInfo(tempData).then(() => {
            const index = this.list.findIndex(v => v.id === this.temp.id)
            this.list.splice(index, 1, this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: 'Update Successfully',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleDelete(row, index) {
      deleteFileInfo(row).then(() => {
        this.list.splice(index, 1)
        this.$notify({
          title: 'Success',
          message: 'Delete Successfully',
          type: 'success',
          duration: 2000
        })
      })
    },
    handleFetchPv(pv) {
      fetchPv(pv).then(response => {
        this.pvData = response.data.pvData
        this.dialogUploadVisible = true
      })
    },
    handleDownload() {
      this.downloadLoading = true
      //   import('@/vendor/Export2Excel').then(excel => {
      //     const tHeader = ['timestamp', 'title', 'type', 'importance', 'status']
      //     const filterVal = ['timestamp', 'title', 'type', 'importance', 'status']
      //     const data = this.formatJson(filterVal)
      //     excel.export_json_to_excel({
      //       header: tHeader,
      //       data,
      //       filename: 'table-list'
      //     })
      //     this.downloadLoading = false
      //   })
    },
    // formatJson(filterVal) {
    //   return this.list.map(v => filterVal.map(j => {
    //     if (j === 'timestamp') {
    //       return parseTime(v[j])
    //     } else {
    //       return v[j]
    //     }
    //   }))
    // },
    getSortClass: function (key) {
      const sort = this.listQuery.sort
      return sort === `+${key}` ? 'ascending' : 'descending'
    },
    upload(fileInfo) {
      // console.log(fileInfo)
      this.fileInfo = fileInfo
      this.dialogUploadVisible = true
    },
    uploadFinish() {
      this.dialogUploadVisible = false
    },
    // queryVersions(queryString, cb) {
    //   var versions = []
    //   this.listQuery.version = queryString
    //   getVersions(this.listQuery).then((response) => {
    //     versions = response.data.items;
    //   }).then(() => {
    //     var results = queryString ? versions.filter(this.createFilter(queryString)) : versions;
    //     cb(results);

    //   });
    // },
    queryVersions() {
      getVersions(this.listQuery).then((response) => {
        this.versions = response.data.items;
      });
    },
    queryTitles(queryString, cb) {
      var titles = []
      this.listQuery.title = queryString
      getTitles(this.listQuery).then((response) => {
        titles = response.data.items;
      }).then(() => {
        var results = queryString ? titles.filter(this.createFilter(queryString)) : titles;
        cb(results);
      });
    },
    getNames() {
      getNames().then((response) => {
        this.names = response.data.items;
      });
    },
    queryNames(queryString, cb) {
      var names = []
      this.listQuery.name = queryString
      getNames(this.listQuery).then((response) => {
        names = response.data.items;
      }).then(() => {
        var results = queryString ? names.filter(this.createFilter(queryString)) : names;
        cb(results);
      });
    },
    createFilter(queryString) {
      return (restaurant) => {
        return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
      };
    },
  }
}
</script>
