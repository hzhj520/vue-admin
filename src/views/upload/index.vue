<template>
  <div class="app-container" style="width:70%">
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
      <el-form-item label="软件名称" prop="filename">
        <el-input v-model="ruleForm.filename"></el-input>
      </el-form-item>
      <el-form-item label="软件标题" prop="title">
        <el-input v-model="ruleForm.title"></el-input>
      </el-form-item>
      <el-form-item label="软件描述" prop="desc">
        <el-input type="textarea" v-model="ruleForm.desc"></el-input>
      </el-form-item>
      <el-form-item label="版本号" prop="version">
        <el-input v-model="ruleForm.version"></el-input>
      </el-form-item>
      <!-- <el-form-item label="系统平台" prop="region">
        <el-select v-model="ruleForm.region" placeholder="请选择系统平台">
          <el-option label="Windows" value="shanghai"></el-option>
          <el-option label="CentOS" value="beijing"></el-option>
          <el-option label="Ubuntu" value="beijing"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="活动时间" required>
        <el-col :span="11">
          <el-form-item prop="date1">
            <el-date-picker type="date" placeholder="选择日期" v-model="ruleForm.date1" style="width: 100%;"></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col class="line" :span="2">-</el-col>
        <el-col :span="11">
          <el-form-item prop="date2">
            <el-time-picker placeholder="选择时间" v-model="ruleForm.date2" style="width: 100%;"></el-time-picker>
          </el-form-item>
        </el-col>
      </el-form-item>
      <el-form-item label="即时配送" prop="delivery">
        <el-switch v-model="ruleForm.delivery"></el-switch>
      </el-form-item>
      <el-form-item label="活动性质" prop="type">
        <el-checkbox-group v-model="ruleForm.type">
          <el-checkbox label="美食/餐厅线上活动" name="type"></el-checkbox>
          <el-checkbox label="地推活动" name="type"></el-checkbox>
          <el-checkbox label="线下主题活动" name="type"></el-checkbox>
          <el-checkbox label="单纯品牌曝光" name="type"></el-checkbox>
        </el-checkbox-group>
      </el-form-item> -->
      <!-- <el-form-item label="系统平台" prop="resource">
        <el-radio-group v-model="ruleForm.resource">
          <el-radio label="Windows"></el-radio>
          <el-radio label="CentOS"></el-radio>
          <el-radio label="Ubuntu"></el-radio>
        </el-radio-group>
      </el-form-item> -->
      <el-form-item v-for="(item,index) in ruleForm.testList" :key=index label="上传安装包" inline="true">
        <el-row>
          <el-select v-model="item.platform" placeholder="请选择系统平台">
            <el-option label="Windows" value="shanghai"></el-option>
            <el-option label="CentOS" value="beijing"></el-option>
            <el-option label="Ubuntu" value="beijing"></el-option>
          </el-select>
          <el-upload class="upload-demo" drag action="http://localhost:8888/upload/upload" multiple style="align=right">
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
          </el-upload>

          <!-- <el-upload class="upload-demo" action="" :http-request="uploadMethod" :limit="1" :on-success="onSuccess" :file-list="fileList">
            <el-button size="small" type="primary">上传到服务器</el-button>
            <el-progress style="width: 200px;margin-top: 8px" :percentage="progressPercent" />
          </el-upload> -->
        </el-row>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">立即创建</el-button>
        <el-button @click="resetForm('ruleForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>


<script>
import { upload, uploadFile } from "@/api/upload";
// import { methods } from 'vue-prismjs';
export default {
  name: 'Upload',
  props: {
    value: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      progressPercent: 0, // 进度条默认为0
      tempUrl: '',
      dataObj: { token: '', key: '' },
      fileList: [],
      ruleForm: {
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: '',
        testList: [{ "platform": 'Windows', "filepath": "" }, ]
      },
      rules: {
        name: [
          { required: true, message: '请输入软件标题', trigger: 'blur' },
          // { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        region: [
          { required: true, message: '请选择活动区域', trigger: 'change' }
        ],
        date1: [
          { type: 'date', required: true, message: '请选择日期', trigger: 'change' }
        ],
        date2: [
          { type: 'date', required: true, message: '请选择时间', trigger: 'change' }
        ],
        type: [
          { type: 'array', required: true, message: '请至少选择一个活动性质', trigger: 'change' }
        ],
        resource: [
          { required: true, message: '请选择活动资源', trigger: 'change' }
        ],
        desc: [
          { required: true, message: '请填写活动形式', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          alert('submit!');
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },

    //上传文件成功后
    onSuccess(response, file, fileList) {
      console.log('----onSuccess----', response, file, fileList)
      this.$message.success('导入成功')
      this.loading = false
      this.fileList = [] //清空文件显示列表
      this.$emit('update:visible', false) //关闭文件选择的弹窗
      this.$emit('upload-success')//触发父组件中方法刷新列表数据
    },
    /**
     * 自定义上传图片的方法
     */
    uploadMethod(params) {
      // 上传新文件时，将进度条值置为零
      this.progressPercent = 0
      // console.log("params----->", params)

      const file = params.file
      this.forms = new FormData() // 实例化一个formData，用来做文件上传
      this.forms.append('file', file)
      // 将图片单独上传，并返回路径
      // 进度条
      const uploadProgressEvent = progressEvent => {
        this.progressPercent = Math.floor((progressEvent.loaded * 100) / progressEvent.total)
      }

      // 调用axios包装后的上传请求方法
      uploadFile(this.forms, uploadProgressEvent).then(res => {
        if (res.code === 20000) {
          alert("上传成功！")
          // console.log(res.data.items)
          //TODO 调用成功方法
        } else {
          //TODO 调用失败方法
        }
      }).catch(response => {
        console.log('文件上传失败')
      })
    },
  }
}

</script>