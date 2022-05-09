<template>
  <div class="app-container" v-loading="listLoading">
    <el-row>
      <el-col :span="16">
        <el-card class="box-card" v-for="file in listSofts" :key="file.id" @click="test">
          <div slot="header" class="clearfix" @click="changeFile(file)">
            <span>{{file.title}}</span>
          </div>

          <el-col :span="17">
            <div class="text item" @click="changeFile(file)">
              <!-- {{file.description}} -->
              <prism language="markdown" :plugins="['numbers']" :code="file.description"></prism>
            </div>
          </el-col>
          <el-col :span="6">
            <div style="border:0px solid black;" class="text item">
              <ul>
                <li v-for="(v,index) in file.fileDetails" :key="index" class="text item">
                  <a class="link-type" @click="changePlatform(v)">
                    {{v.platform}}
                  </a>
                </li>
              </ul>
            </div>
          </el-col>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>请在此处下载您所需要的软件</span><br>
          </div>
          <div>
            <el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">
              下载 {{fileDetail.platform}}
            </el-button>
          </div>
        </el-card>
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>下载该文件的其他版本</span>
          </div>
          <ul>
            <li v-for="(v,index) in listVersions" :key="index" class="text item">
              <a class="link-type" @click="changeVersion(v.value)">
                {{fileInfo.name }}-{{v.value}}
              </a>
            </li>
          </ul>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { getVersions, fetchSoftList, fetchFileDetailList, getFileInfoByVersion } from '@/api/file'
import waves from '@/directive/waves' // waves directive
import Prism from 'vue-prismjs'
import 'prismjs/themes/prism.css'

export default {
  name: 'Download',
  components: { Prism },
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'gray',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      listSofts: [],
      // listFileDetails: [],
      listVersions: null,
      listLoading: true,
      // name: '', // 当前的文件名称
      // platform: '', //当前的下载平台
      // filepath: '', //当前的下载路径
      fileInfo: {}, //当前选中的文件信息
      fileDetail: {},
      listQuery: { "name": null },
      downloadLoading: false
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      // var file_id
      fetchSoftList(this.listQuery).then(response => {
        this.listLoading = false
        this.listSofts = response.data.items
        this.listSofts.forEach(fileInfo => {
          this.getFileDetailList(fileInfo)
        });
        if (this.listSofts && this.listSofts.length > 0) {
          // file_id = this.listSofts[0].id
          // this.name = this.listSofts[0].name
          this.fileInfo = this.listSofts[0]
        }
      }).then(() => {
        if (this.fileInfo) {
          // var file_id = this.listSofts[0].id
          this.getVersions()
        }
      })
    },
    getFileDetailList(fileInfo) {
      console.log("@getFileDetailList", fileInfo)
      fetchFileDetailList({ file_id: fileInfo.id }).then(response => {
        // this.listFileDetails = response.data.items
        fileInfo.fileDetails = response.data.items
        if (fileInfo.fileDetails && fileInfo.fileDetails.length > 0) {
          this.fileDetail = fileInfo.fileDetails[0]
        }
        this.listLoading = false
      })
    },
    getVersions() {
      getVersions({ name: this.fileInfo.name }).then(response => {
        this.listVersions = response.data.items
        // console.log(this.listVersions)
        this.listLoading = false
      })
    },
    changeVersion(version) {
      // console.log(version)
      var queryItem = { name: this.fileInfo.name, version: version }
      getFileInfoByVersion(queryItem).then(response => {
        let item = response.data.items
        for (let i = 0; i < this.listSofts.length; i++) {
          if (this.listSofts[i].name === item.name && this.listSofts[i].version != item.version) {
            console.log("后台查出来的version是------->", this.listSofts[i].version)
            console.log("当前的version是------->", item.version)
            // if (this.listSofts[i].version != item.version) {
            this.getFileDetailList(item)
            this.listSofts.splice(i, 1, item)
            console.log("修改当前的fileInfo")
            this.fileInfo = item
            // }
          }
        }
      })

    },
    changePlatform(fileDetail) {
      console.log(fileDetail)
      this.fileDetail = fileDetail
      // this.platform = fileDetail.platform
      // this.filepath = fileDetail.filepath
    },
    handleDownload() {
      console.log("@", this.fileDetail.filepath)
      if (this.fileDetail) {
        let link = document.createElement('a')
        link.style.display = 'none'
        link.href = process.env.VUE_APP_BASE_API + '/file/download?filepath=' + this.fileDetail.filepath;
        link.click();
      }
    },
    changeFile(fileInfo) {
      this.fileInfo = fileInfo
      this.getVersions()
      if (this.fileInfo.fileDetails && this.fileInfo.fileDetails.length > 0) {
        this.changePlatform(this.fileInfo.fileDetails[0])
      }
      // this.fileDetail=this.fileInfo.fileDetails
    },
    test() {
      alert("123")
    }
  },
  watch: {
    // fileInfo() {
    //   // console.log("version改变")
    //   this.getFileDetailList()
    //   this.getVersions()
    // }
  }
}
</script>
