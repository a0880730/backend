<template>
  <div>
    <el-tag
      v-for="tag in dynamicTags"
      :key="tag"
      closable
      :disable-transitions="false"
      @close="handleClose(tag)"
    >
      {{ tag }}
    </el-tag>
    <el-input
      v-if="inputVisible"
      ref="saveTagInput"
      v-model="inputValue"
      class="input-new-tag"
      size="small"
      @keyup.enter.native="handleInputConfirm"
      @blur="handleInputConfirm"
    />
    <el-button v-else class="button-new-tag" size="small" @click="showInput">+ {{ newButtonName }}</el-button>
  </div>
</template>

<script>
export default {
  name: 'TagInput',
  filters: {},
  props: {
    newButtonName: {
      type: String,
      default: ''
    },
    tagData: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      dynamicTags: [],
      inputVisible: false,
      inputValue: ''
    }
  },
  watch: {
    tagData: {
      handler(value) {
        if (typeof this.tagData !== 'undefined' && this.tagData !== '') {
          this.dynamicTags = this.tagData.split(',')
        } else {
          this.dynamicTags = []
        }
      },
      deep: true
    },
    dynamicTags: {
      handler(value) {
        this.$emit('update:tagData', value.join(','))
      },
      deep: true
    }
  },
  created() {
  },
  methods: {
    handleClose(tag) {
      this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1)
    },
    showInput() {
      this.inputVisible = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    handleInputConfirm() {
      const inputValue = this.inputValue
      if (inputValue) {
        this.dynamicTags.push(inputValue)
      }
      this.inputVisible = false
      this.inputValue = ''
    }
  }
}
</script>

<style scope>
  .el-tag + .el-tag {
    margin-left: 10px;
  }
  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }
</style>
