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
      <el-col :span="5">
        <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
          Search
        </el-button>
        <el-button class="filter-item" style="margin-left: 10px;" type="success" icon="el-icon-edit" @click="handleCreate">
          Add
        </el-button>
      </el-col>
    </div>

    <el-table :key="tableKey" v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%;">
      <el-table-column label="序号" prop="id" sortable="custom" align="center" width="80">
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
          <span class="link-type" @click="getFileDetail(row)">{{ row.title }}</span>
        </template>
      </el-table-column>
      <el-table-column label="描述" min-width="200px">
        <template slot-scope="{row}">
          <span class="link-type" @click="getFileDetail(row)">{{ row.description }}</span>
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
          <el-autocomplete :hide-loading=true class="inline-input" clearable v-model="temp.name" :fetch-suggestions="queryNames" placeholder="文件名">
          </el-autocomplete>
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

    <!-- <el-dialog :visible.sync="dialogUploadVisible" title="上传软件包" width="40%">
      <Upload @func="uploadFinish" :fileInfo='fileInfo'></Upload>
    </el-dialog> -->

    <!-- <el-dialog v-el-drag-dialog :visible.sync="dialogFileDetailVisible" title="软件包列表" width="50%">
      <el-table :data="fileDetailData" border fit highlight-current-row>
        <el-table-column v-for="(val, column) in dialogTheads" :key="column" :label="val['label']" align="center" :width="val['width']">
          <template slot-scope="scope">
            {{ scope.row[column] }}
          </template>
        </el-table-column>
      </el-table>
    </el-dialog> -->

    <Upload :fileInfo='fileInfo' :dialogUploadShow='dialogUploadShow'></Upload>
    <FileDetail :fileInfo='fileInfo' :dialogFileDetailShow='dialogFileDetailShow'></FileDetail>

  </div>
</template>

<script>

// const dialogTheads = {
//   "file_id": { label: "File_ID", width: "100", },
//   "filepath": { label: "路径", width: "300", },
//   "platform": { label: "系统平台", width: "150", },
//   "created_at": { label: "创建时间", width: "", },
// }


import { fetchList, deleteFileInfo, getTitles, getNames, getVersions, createFileInfo, updateFileInfo, fetchFileDetailList } from '@/api/file'
import waves from '@/directive/waves' // waves directive
import elDragDialog from '@/directive/el-drag-dialog' // base on element-ui
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import Upload from './components/upload' // secondary package based on el-pagination
import FileDetail from './components/FileDetail'


export default {
  name: 'FileManage',
  components: { Pagination, Upload, FileDetail },
  directives: { waves, elDragDialog, },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
    },
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
      },
      names: null,
      versions: null,
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
      fileInfo: null,
      rules: {
        timestamp: [{ type: 'date', required: true, message: 'timestamp is required', trigger: 'change' }],
        title: [{ required: true, message: 'title is required', trigger: 'blur' }],
        version: [{ required: true, message: 'title is required', trigger: 'blur' }]
      },
      // dialogUploadVisible: false,
      // fileDetailData: [],
      // dialogTheads: dialogTheads,
      // dialogFileDetailVisible: false,
      dialogUploadShow: false,
      dialogFileDetailShow: false,

    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      // console.log(this.listQuery)
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
          // console.log(typeof tempData)
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
      // 获取下拉框的文件名称
      getNames().then((response) => {
        this.names = response.data.items;
      });
    },
    queryNames(queryString, cb) {
      // 新增文件时，动态输入文件
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
    getFileDetailList(fileInfo) {
      // 在该组件中显示 dialog
      var param = { file_id: fileInfo.id }
      fetchFileDetailList(param).then(response => {
        this.fileDetailData = response.data.items
        this.dialogFileDetailShow = true
      })
    },
    // 以下为子组件调用方法
    upload(fileInfo) {
      this.fileInfo = fileInfo
      this.dialogUploadShow = !this.dialogUploadShow
    },
    uploadFinish() {
      this.dialogUploadShow = !this.dialogUploadShow
    },
    getFileDetail(fileInfo) {
      this.fileInfo = fileInfo
      this.dialogFileDetailShow = !this.dialogFileDetailShow
    },

  }
}
</script>
