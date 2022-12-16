<template>
  <div class="upload-file">
    <div v-if="disabled" class="el-upload-list el-upload-list--picture-card">
      <div
        v-for="(item, index) in fileList"
        :key="index"
        class="el-upload-list__item">
        <div class="flex flex-col w-full">
          <div
            class="
              flex
              justify-center
              p-4
              w-full
              h-full
              bg-gray-50
              items-center
            "
            v-if="!formatFileIcon(item?.original_name).includes('file')">
            <p class="text-lg">
              {{ formatFileIcon(item?.original_name) }}
            </p>
          </div>
          <svg-icon
            v-else
            :name="formatFileIcon(item?.original_name)"
            class="h-full w-full p-4"></svg-icon>
          <div
            class="
              flex
              max-w-[120px]
              items-center
              gap-x-1
              bg-gray-200
              px-2
              py-1
            ">
            <svg-icon
              v-if="item?.type != 'image'"
              :name="`${formatFileIcon(item?.original_name)}-small`"
              class="min-w-4 min-h-4"></svg-icon>
            <small class="truncate">{{ item?.original_name }}</small>
          </div>
        </div>

        <div class="el-upload-list__item-actions flex flex-col">
          <div
            class="
              el-upload-list__item-preview
              flex
              h-full
              w-full
              flex-col
              items-center
              bg-gray-300
              delay-75
            ">
            <div class="w-full p-3">
              <div class="flex items-center gap-x-1">
                <svg-icon
                  :name="`${formatFileIcon(item?.original_name)}-small`"
                  class="h-4 w-4"></svg-icon>
                <p class="truncate text-sm text-gray-900">
                  {{ item?.original_name }}
                </p>
              </div>
            </div>
            <div class="mt-auto flex justify-center gap-x-3 p-3">
              <div
                class="
                  flex
                  h-8
                  w-8
                  cursor-pointer
                  items-center
                  justify-center
                  rounded-lg
                  bg-gray-700
                  hover:bg-opacity-70
                "
                @click="actions.handleDownload(item)">
                <svg-icon
                  :name="'file-download-cloud'"
                  class="h-5 w-5"></svg-icon>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="upload-queue">
      <draggable
        v-model="fileList"
        class="el-upload-list el-upload-list--picture-card"
        ghost-class="ghost"
        item-key="link"
        @start="state.drag = true"
        @end="state.drag = false"
        @change="actions.handleUpdateList(fileList)">
        <template #item="{ element }">
          <div class="el-upload-list__item">
            <div class="flex flex-col w-full">
              <div
                class="
                  flex
                  justify-center
                  p-4
                  w-full
                  h-full
                  bg-gray-50
                  items-center
                "
                v-if="!formatFileIcon(element?.original_name).includes('file')">
                <p class="text-lg">
                  {{ formatFileIcon(element?.original_name) }}
                </p>
              </div>
              <svg-icon
                v-else
                :name="formatFileIcon(element?.original_name)"
                class="h-full w-full p-4"></svg-icon>
              <div
                class="
                  flex
                  max-w-[120px]
                  items-center
                  gap-x-1
                  bg-gray-200
                  px-2
                  py-1
                ">
                <svg-icon
                  v-if="formatFileIcon(element?.original_name).includes('file')"
                  :name="`${formatFileIcon(element?.original_name)}-small`"
                  class="min-w-4 min-h-4"></svg-icon>
                <small class="truncate">{{ element?.original_name }}</small>
              </div>
            </div>

            <div class="el-upload-list__item-actions flex flex-col">
              <div
                class="
                  el-upload-list__item-preview
                  flex
                  h-full
                  w-full
                  flex-col
                  items-center
                  bg-gray-300
                  delay-75
                ">
                <div class="w-full p-3">
                  <div class="flex items-center gap-x-1">
                    <svg-icon
                      v-if="
                        formatFileIcon(element?.original_name) != 'file-other'
                      "
                      :name="`${formatFileIcon(element?.original_name)}-small`"
                      class="h-4 w-4"></svg-icon>
                    <p class="truncate text-sm text-gray-900">
                      {{ element?.original_name }}
                    </p>
                  </div>
                  <!-- <small class="text-thin text-xs text-gray-700">{{
                    actions.handleFormatSize(element?.size)
                  }}</small> -->
                </div>
                <div class="mt-auto flex justify-center gap-x-3 p-3">
                  <div
                    class="
                      flex
                      h-8
                      w-8
                      cursor-pointer
                      items-center
                      justify-center
                      rounded-lg
                      bg-gray-700
                      hover:bg-opacity-70
                    "
                    @click="actions.handleDownload(element)">
                    <svg-icon
                      :name="'file-download-cloud'"
                      class="h-5 w-5"></svg-icon>
                  </div>
                  <div
                    class="
                      flex
                      h-8
                      w-8
                      cursor-pointer
                      items-center
                      justify-center
                      rounded-lg
                      bg-gray-700
                      hover:bg-opacity-70
                    "
                    @click="actions.handleDelete(element?.name, index)">
                    <span class="el-upload-list__item-delete">
                      <el-icon><Delete /></el-icon>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>
      </draggable>
      <el-upload
        v-if="fileList.length < max"
        accept=".odt,.doc,.xls,.xlsx,.ppt,.pptx,.pdf,.docx,.png,.jpg,.jpeg"
        class="el-upload el-upload--picture-card"
        action="#"
        :limit="max"
        :multiple="false"
        :show-file-list="false"
        :http-request="actions.handleUploadFile"
        :before-upload="actions.handleBeforeUpload"
        :on-exceed="actions.handleUploadExceed">
        <template #trigger>
          <div class="flex h-32 w-32 items-center justify-center">
            <el-icon><Plus /></el-icon>
          </div>
        </template>
      </el-upload>
    </div>
  </div>
</template>

<script setup>
import SvgIcon from '@/components/SvgIcon/index.vue'
import draggable from 'vuedraggable'
import { ref, computed, getCurrentInstance } from 'vue'
import { PreOrderApiHandler, PreOrderFileApiHandler } from '@/api/pre_order'
import { FileApiHandler } from '@/api/file'
import { round } from 'lodash-es'
const { proxy } = getCurrentInstance()
const imgUrl = import.meta.env.VITE_APP_WEB_URL
const props = defineProps({
  title: { type: String, default: '' },
  max: {
    type: Number,
    default: 10,
  },
  list: {
    type: Array,
    default: () => [],
  },
  param: {
    type: String,
    default: '',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  id: {
    type: [Number, String],
    default: '',
  },
})
const emit = defineEmits(['update:list', 'on-change'])

const state = ref({
  drag: false,
  dragOptions: {
    animation: 200,
    group: 'description',
    disabled: false,
    ghostClass: 'ghost',
  },
  dialogImageUrl: '',
  dialogVisible: false,
})

const fileList = computed({
  get: () => props.list || [{ link: '', name: '' }],
  set: val => {
    emit('update:list', val)
  },
})
const formatFileIcon = computed(() => name => {
  if (name.includes('doc')) {
    return 'file-docx'
  } else if (name.includes('ppt')) {
    return 'file-ppt'
  } else if (name.includes('xls')) {
    return 'file-xlsx'
  } else if (name.includes('pdf')) {
    return 'file-pdf'
  } else {
    const type = name.split('.')[1]
    return type
  }
})

const actions = {
  handleUpdateList: list => {
    emit('on-change', list)
  },
  handleBeforeUpload: file => {
    const isLt5M = file.size / 1024 / 1024 < 5

    if (!isLt5M) {
      proxy.$message({
        type: 'error',
        message: '檔案大小不能超過 5MB!',
      })
    }
    return isLt5M
  },
  handleUploadExceed: () => {
    proxy.$message({
      type: 'error',
      message: `最多只能上傳${props.max}個檔案。`,
    })
  },
  handleFormatSize: size => {
    const kb = 1024 // Kilobyte
    const mb = 1024 * kb // Megabyte
    const gb = 1024 * mb // Gigabyte
    const tb = 1024 * gb // Terabyte
    if (size < mb) return `${round(size / kb, 2)}KB`
    if (size < gb) return `${round(size / mb, 2)}MB`
    if (size < tb) return `${round(size / gb, 2)}GB`
    return `${round(size / tb, 2)}TB`
  },
  /**
   * @description 刪除檔案
   */
  handleDelete: async name => {
    const params = {
      action: 'del_up_files',
      filename: [name],
    }
    const { code, data, msg } = await PreOrderApiHandler(params)
    if (code > 0) {
      const filterData = fileList.value.filter(el => el?.name != name)
      console.log(filterData)
      emit('on-change', filterData)
    }
    proxy.$message({
      type: code > 0 ? 'success' : 'error',
      message: msg,
    })
  },
  /**
   * @description 下載檔案
   */
  handleDownload: async file => {
    const params = {
      file: file.name,
      path: file.path,
    }
    try {
      const res = await FileApiHandler(params)
      const url = window.URL.createObjectURL(new Blob([res]))
      const link = document.createElement('a')
      console.log(res)
      console.log(url)
      link.href = url
      link.setAttribute('download', file.name)
      document.body.appendChild(link)
      link.click()
    } catch (error) {
      console.log(error)
      proxy.$message({
        type: 'error',
        message: '下載發生錯誤，請稍後再試',
      })
    }
  },
  /**
   * @description 預覽檔案
   */
  handlePreview: async file => {
    const href = `${imgUrl}${file.original_name}`
    window.open(href, '_blank')
  },
  /**
   * @description 附件
   */
  handleUploadFile: async params => {
    let formData = new FormData()
    formData.append('action', 'fileupload')
    formData.append('preorderid', props.id)
    formData.append('upfile[]', params.file)
    PreOrderFileApiHandler(formData)
      .then(result => {
        const upsuccess = result?.data?.upsuccess[0]
        if (upsuccess) {
          console.log(upsuccess)
          const type = upsuccess[1]?.split('.')[1]
          const prefix = `${upsuccess[1]?.split('_')[0]}_${
            upsuccess[1]?.split('_')[1]
          }_`
          const original_name = upsuccess[1]?.split(prefix)[1]
          const preview = {
            type: type,
            path: upsuccess[0],
            name: upsuccess[1],
            original_name: original_name,
          }
          console.log(preview)
          fileList.value.push(preview)
          emit('on-change', fileList.value)
        }
      })
      .catch(error => {
        console.log(error)
      })
  },
}
</script>
<style lang="scss">
.upload-file {
  .el-upload-list--picture-card {
    --el-upload-list-picture-card-size: 120px;
  }
  .el-upload.el-upload--picture-card {
    --el-upload-picture-card-size: 120px;
  }
}
</style>