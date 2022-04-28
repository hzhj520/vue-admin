<template>
  <el-upload
    ref="upload"
    :action="doUpload"
    :headers="headers"
    :http-request="ossUpload"
    :on-preview="handlePictureCardPreview"
    :on-remove="handleRemove"
    :on-success="handleSuccess"
    :on-error="handleError"
    :before-upload="beforeUpload"
    :file-list="fileList"
    :disabled="disable"
  >
    <el-button
      size="small"
      :disabled="disable"
      type="primary"
    >
      上传文件
    </el-button>
    <div
      slot="tip"
      class="el-upload__tip"
    >
      支持jpg、png、pdf、word格式，大小不超过500M。
    </div>
  </el-upload>
</template>

<script>
  import { getToken } from '@/utils/auth';
  import { ossUploadApi } from '@/api/serviceProvider';
  export default {
    name: 'FileDetail',
    model: {
      prop: 'fileList',
      event: 'change',
    },
    props: {
      fileList: {
        type: Array,
        required: true,
      },
      disable: {
        type: Boolean,
        default: false,
      },
    },
    data() {
      return {
        // 上传地址
        doUpload:
          process.env.VUE_APP_BASE_API +
          (process.env.NODE_ENV === 'production' ? '' : '/api') +
          process.env.VUE_APP_BASE_CONTENT_URL +
          '/contract/upload',
        // doUpload: 'https://jsonplaceholder.typicode.com/posts/',
        // 下载请求头
        headers: {
          tgt: getToken(),
        },
      };
    },
    watch: {},
    methods: {
      // 处理文件点击预览操作
      handlePictureCardPreview(file) {
        console.log(file);
        let downUrl = '';
        if (file.hasOwnProperty('url')) {
          downUrl = file.url;
        } else {
          downUrl = file.response.message;
        }
        // 赋值
        const a = document.createElement('a');
        // 创建href属性
        a.href = downUrl;
        // 点击下载
        a.click();
      },
      // 上传前
      beforeUpload(file) {
        const limitSize = 500;
        const isLt500M = file.size / 1024 / 1024 < limitSize;
        if (!isLt500M) {
          this.$message.error(`上传文件大小不能超过 ${limitSize}MB!`);
        }
        return isLt500M;
      },
      // 手动删除文件钩子
      handleRemove(_file, fileList) {
        console.log(fileList);
        this.processFileList(fileList);
      },
      // 上传成功钩子
      handleSuccess(_res, _file, fileList) {
        console.log(fileList);
        this.processFileList(fileList);
      },
      // 上传失败的钩子
      handleError(err, _file, fileList) {
        if (err.code !== 200) {
          this.$message({
            message: err.message || '上传失败',
            type: 'warning',
          });
        }
        this.processFileList(fileList);
      },
      // 自定义处理filelist
      processFileList(fileList) {
        fileList.forEach((item) => {
          if (!item.url && item.response) {
            const response = item.response;
            item.url = response.url;
          }
        });
        this.triggerChange(fileList);
      },
      triggerChange(fileList) {
        this.$emit('change', fileList);
      },
      // 自定义上传oss方法
      ossUpload(option) {
        const file = option.file;
        return ossUploadApi(file);
      },
    },
  };
</script>
<style lang="scss" scoped></style>