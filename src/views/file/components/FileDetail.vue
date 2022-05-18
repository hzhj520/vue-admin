<template>
  <div>
    <el-dialog v-el-drag-dialog :visible.sync="dialogFileDetailVisible" title="软件包列表" width="50%">
      <el-table :data="gridData" border fit highlight-current-row>
        <el-table-column v-for="(val, column) in dialogTheads" :key="column" :label="val['label']" align="center"
          :width="val['width']">
          <template slot-scope="scope">
            <div>
              {{ scope.row[column] }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="100" class-name="small-padding fixed-width">
          <template slot-scope="{row,$index}">
            <el-button v-if="row.status != 'deleted'" size="mini" type="danger" @click="deleteConfirm(row, $index)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
const dialogTheads = {
  "id": { label: "序号", width: "80", },
  "filepath": { label: "路径", "min-width": "200", },
  "platform": { label: "系统平台", width: "100", },
  "update_at": { label: "创建时间", width: "180", },
}

import { fetchFileDetailList, deleteFileDetail } from '@/api/file'
import elDragDialog from '@/directive/el-drag-dialog' // base on element-ui
// import { parseTime } from '@/utils'

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
    handleDelete(row, index) {
      deleteFileDetail(row).then(() => {
        this.gridData.splice(index, 1)
        this.total -= 1
        this.$notify({
          title: 'Success',
          message: 'Delete Successfully',
          type: 'success',
          duration: 2000
        })
      })
    },
    deleteConfirm(row, $index) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.handleDelete(row, $index)
        this.$message({
          type: 'success',
          message: '删除成功!'
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    }
  },
};
</script>