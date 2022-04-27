<template>
  <div class="app-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>软件名称</span>
      </div>
      <div class="text item">
        卡片描述
      </div>
      <div v-for="o in 4" :key="o" class="text item">
        {{'列表内容 ' + o }}
      </div>
    </el-card>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>请在此处下载您所需要的软件</span><br>
      </div>
      <div>
        <el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">
          点击下载
        </el-button>
      </div>
    </el-card>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>More Downloads</span>
      </div>
      <ul>
        <li v-for="(v,index) in listVersions" :key="index" class="text item">
          <a class="link-type" @click="changeSoft">
            {{v.filename }}-{{v.version}}
          </a>
        </li>
      </ul>
    </el-card>
  </div>
</template>

<script>
import { getVersions } from '@/api/file'
import waves from '@/directive/waves' // waves directive

export default {
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
      listVersions: null,
      listLoading: true,
      filename: '',
      listQuery: { "filename": null },
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      this.listQuery['filename'] = 'Dockerfile'
      getVersions(this.listQuery).then(response => {
        this.listVersions = response.data.items
        console.log(this.listVersions)
        this.listLoading = false
      })
    },
    changeSoft() {
      alert("123")
    }
  },
  watch: {
    filename() {
      getVersions(this.listQuery).then(response => {
        this.listVersions = response.data.items
        console.log(this.listVersions)
        this.listLoading = false
      })
    }
  }
}
</script>
