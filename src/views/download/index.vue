<template>
  <div class="app-container" v-loading="listLoading">
    <el-row :gutter="30">
      <el-col :span="18">
        <el-card class="box-card" v-for="file in listSofts" :key="file.id" @click="test">
          <div slot="header" class="title item" @click="changeFile(file)">
            <span>{{ file.title }}</span>
          </div>

          <el-col :span="17">
            <!-- <div>{{ fileInfo.version }}</div> -->
            <div style="border:0px solid black;" class="text item" @click="changeFile(file)">
              <!-- {{file.description}} -->
              <!-- <prism language="markdown" :plugins="['numbers']" :code="file.description"></prism> -->
              <VueMarkdown :source="file.description"></VueMarkdown>

              <!-- <a class="link-type" @click="changePlatformDownload(fileManual)">
                {{ fileManual.platform }}
              </a> -->
            </div>
          </el-col>
          <el-col :span="1">
            <div class="grid">
              <el-tooltip placement="top">
                <div slot="content">
                  {{ generateElementIconCode(item) }}
                </div>
                <!-- <div class="icon-item">
                  <i :class="'el-icon-' + item" />
                </div> -->
              </el-tooltip>
            </div>
          </el-col>
          <el-col :span="6">
            <div style="border:0px solid black;" class="text">
              <!-- <i class="el-icon-date"></i> -->
              <!-- <div class="icon-item">
                <i class="el-icon-download" />
              </div> -->
              <ul>
                <li v-for="(v, index) in file.fileDetails" :key="index" class="downtext item">
                  <a class="link-type text" @click="changePlatformDownload(v)">
                    {{ v.platform }}
                  </a>
                </li>
              </ul>
            </div>
          </el-col>
        </el-card>
      </el-col>
      <el-col :span="5">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>当前版本： {{ fileInfo.name }}-{{ fileInfo.version }} </span><br>
          </div>
          <div>
            <el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download"
              @click="handleDownload(fileManual)">
              用户手册下载
            </el-button>
          </div>
        </el-card>
        <!-- <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>当前软件版本： {{fileInfo.name }}-{{fileInfo.version}} </span><br>
          </div>
          <div>
            <el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">
              下载 {{fileDetail.platform}} 版本
            </el-button>
          </div>
        </el-card> -->
        <div class="temp"></div>
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>历史版本：</span>
          </div>
          <ul>
            <li v-for="(v, index) in listVersions" :key="index" class="text item">
              <a class="link-type" @click="changeVersion(v.value)">
                {{ fileInfo.name }}-{{ v.value }}
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
import elementIcons from './element-icons'
import VueMarkdown from 'vue-markdown'

export default {
  name: 'Download',
  components: { Prism, VueMarkdown },
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
      fileManual: {},
      listQuery: { "name": null },
      downloadLoading: false,
      item: "download",
      elementIcons
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
        // this.listLoading = false
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
      // console.log("@getFileDetailList", fileInfo)
      fetchFileDetailList({ file_id: fileInfo.id }).then(response => {
        // this.listFileDetails = response.data.items
        fileInfo.fileDetails = response.data.items
        this.fileManual = ''
        this.fileDetail = ''
        this.listLoading = true
        if (fileInfo.fileDetails && fileInfo.fileDetails.length > 0) {
          fileInfo.fileDetails.map((val, i) => {
            if (val.platform === 'Manual') {
              this.fileManual = fileInfo.fileDetails.splice(i, 1)[0]
              // console.log("@", typeof this.fileManual, this.fileManual)
            } else {
              this.fileDetail = fileInfo.fileDetails[i]
            }
          })
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
      }).then(() => {
        Window.reload
        // this.$router.go(0)
      })

    },
    changePlatformDownload(fileDetail) {
      this.changePlatform(fileDetail)
      this.handleDownload()
    },
    changePlatform(fileDetail) {
      // console.log(fileDetail)
      this.fileDetail = fileDetail
    },
    handleDownload(fileManual) {
      // console.log("@", this.fileDetail.filepath)
      var fileDetail = fileManual ? fileManual : this.fileDetail
      if (fileDetail) {
        let link = document.createElement('a')
        link.style.display = 'none'
        link.href = process.env.VUE_APP_BASE_API + '/file/download?filepath=' + fileDetail.filepath;
        link.click();
      }
    },
    changeFile(fileInfo) {
      if (fileInfo != this.fileInfo) {
        this.fileInfo = fileInfo
        this.getVersions()
        if (this.fileInfo.fileDetails && this.fileInfo.fileDetails.length > 0) {
          this.changePlatform(this.fileInfo.fileDetails[0])
        }
      }
      // this.fileDetail=this.fileInfo.fileDetails
    },
    test() {
      alert("123")
    },
    generateIconCode(symbol) {
      return `<svg-icon icon-class="${symbol}" />`
    },
    generateElementIconCode(symbol) {
      return `<i class="el-icon-${symbol}" />`
    },
    handleClipboard(text, event) {
      clipboard(text, event)
    },
    platformFilter(fileDetails) {
      console.log(fileDetails)
      if (fileDetails) {
        return fileDetails.filter(item => {
          return item.platform != 'Manual'
        })
      }
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

<style lang="scss" scoped>
.box-card {
  padding: 0px 0
}

.temp {
  padding: 10px
}

.title {
  font-size: 25px;
  font-weight: 800;
  color: #044586;
}

.downtext {
  margin: 10px;
  padding: 5px;
  font-size: 25px;
  font-weight: 800;
}

.icons-container {
  margin: 10px 20px 0;
  overflow: hidden;

  .grid {
    position: relative;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  }

  .icon-item {
    margin: 20px;
    height: 85px;
    text-align: center;
    width: 100px;
    float: left;
    font-size: 30px;
    color: #24292e;
    cursor: pointer;
  }

  span {
    display: block;
    font-size: 16px;
    margin-top: 10px;
  }

  .disabled {
    pointer-events: none;
  }

}
</style>