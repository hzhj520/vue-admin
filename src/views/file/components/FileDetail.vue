<template>
  <div>
    <el-dialog v-el-drag-dialog :visible.sync="dialogFileDetailVisible" title="软件包列表" width="50%">
      <el-table :data="gridData" border fit highlight-current-row>
        <el-table-column v-for="(val, column) in dialogTheads" :key="column" :label="val['label']" align="center" :width="val['width']">
          <template slot-scope="scope">
            <div>
              {{ scope.row[column] }}
            </div>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
const dialogTheads = {
  "file_id": { label: "File_ID", width: "100", },
  "filepath": { label: "路径", width: "300", },
  "platform": { label: "系统平台", width: "150", },
  "created_at": { label: "创建时间", width: "", },
}

import { fetchFileDetailList } from '@/api/file'
import elDragDialog from '@/directive/el-drag-dialog' // base on element-ui

export default {
  name: 'FileDetail',
  directives: { elDragDialog, },
  model: {
    prop: 'fileList',
    event: 'change',
  },
  props: {
    fileInfo: {
      type: Object,
      default: ''
    },
    dialogFileDetailShow: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      gridData: [],
      total: 0,
      dialogTheads: dialogTheads,
      dialogFileDetailVisible: false,
    };
  },
  watch: {
    dialogFileDetailShow(newVal) {
      // console.log("watch方法生效了", newVal)
      this.getList()
    },
  },
  methods: {
    getList() {
      // console.log("进入子组件获取列表页面")
      var param = { file_id: this.fileInfo.id }
      fetchFileDetailList(param).then(response => {
        // console.log("fileInfo.id---------->", this.fileInfo.id)
        this.gridData = response.data.items
        // console.log(this.gridData)
        this.total = response.data.total
        this.dialogFileDetailVisible = true
      })
    },
  }
};
</script>