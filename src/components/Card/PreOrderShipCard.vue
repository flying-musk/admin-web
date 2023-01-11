<template>
  <div
    class="flex flex-col rounded-lg overflow-hidden border mb-3"
    :class="{ 'border-2 border-primary-50': state.editable }">
    <div class="grid grid-cols-1 sm:grid-cols-4">
      <div
        class="
          flex
          sm:flex-col
          gap-y-2
          border-b
          sm:border-b-0
          items-center
          p-2
          sm:px-4 sm:h-full sm:justify-center
        ">
        <div
          class="
            tracking-widest
            text-primary-500
            flex
            sm:flex-col
            items-center
            gap-1
            w-full
            font-semibold
            sm:justify-center
          ">
          <p>{{ formatType[product?.type] }}</p>
        </div>
      </div>
      <div class="flex flex-col sm:border-l col-span-3">
        <div class="flex flex-col space-y-1 p-1 px-2 text-gray-600">
          <div class="flex flex-row items-center text-sm">
            <span class="mr-2">
              <el-icon>
                <Calendar />
              </el-icon>
            </span>
            <div
              class="
                flex
                items-center
                justify-between
                text-xs
                flex-1
                text-gray-500
                gap-x-3
                py-2
              ">
              <p class="min-w-fit">出貨日期</p>
              <el-date-picker
                v-model="state.model.shipdate"
                type="date"
                :editable="false"
                :clearable="!!state.model.shipdate ? false : true"
                :placeholder="state.editable ? '請選擇出貨日期' : '-'"
                value-format="YYYY-MM-DD"
                :disabled="!state.editable"
                style="width: 100%" />
            </div>
          </div>

          <div class="flex flex-row items-center text-sm pb-2">
            <span class="mr-2">
              <el-icon>
                <Van />
              </el-icon>
            </span>
            <div
              class="
                flex
                items-center
                justify-start
                text-xs
                flex-1
                text-gray-500
                gap-x-3
              ">
              <p class="min-w-fit">快遞公司</p>
              <el-radio-group
                v-model="state.model.express_co"
                class="flex w-full gap-y-1"
                size="small"
                :disabled="!state.editable">
                <el-radio
                  class="
                    min-w-full
                    sm:min-w-[85px]
                    border
                    px-2
                    bg-white
                    rounded
                    border-gray-300
                  "
                  label="UPS"
                  >UPS</el-radio
                >
                <el-radio
                  class="
                    min-w-full
                    sm:min-w-[85px]
                    border
                    px-2
                    bg-white
                    rounded
                    border-gray-300
                  "
                  label="FEDEX"
                  >FEDEX</el-radio
                >
                <el-radio
                  class="
                    min-w-full
                    sm:min-w-[85px]
                    border
                    px-2
                    bg-white
                    rounded
                    border-gray-300
                  "
                  label="POST"
                  >POST</el-radio
                >
              </el-radio-group>
            </div>
          </div>

          <div class="flex flex-row items-center text-sm">
            <span class="mr-2">
              <el-icon>
                <Tickets />
              </el-icon>
            </span>
            <div
              class="
                flex
                items-center
                justify-between
                text-xs
                flex-1
                text-gray-500
                gap-3
              ">
              <p class="min-w-fit">快遞單號</p>
              <el-input
                class="text"
                v-model="state.model.trackno"
                clearable
                :disabled="!state.editable"
                :placeholder="state.editable ? '請輸入快遞單號' : '-'" />
            </div>
          </div>
        </div>
        <div class="flex flex-col w-full relative bottom-0 p-2">
          <div class="flex justify-end items-center">
            <el-button
              v-show="state.editable"
              round
              plain
              size="small"
              auto-insert-space
              @click="state.editable = false">
              取消
            </el-button>
            <el-button
              v-if="state.editable"
              round
              type="primary"
              size="small"
              auto-insert-space
              @click="actions.handleEdit(product)">
              確認修改
            </el-button>
            <el-button
              v-else
              round
              plain
              icon="Edit"
              size="small"
              auto-insert-space
              @click="state.editable = true">
              編輯
            </el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, getCurrentInstance } from 'vue'
import { PreOrderApiHandler } from '@/api/pre_order'
const { proxy } = getCurrentInstance()

const props = defineProps({
  product: {
    type: Object,
    default: () => {},
  },
  commonPd: {
    type: Object,
    default: () => {},
  },
  preOrderId: {
    type: [String, Number],
    default: '',
  },
  formatType: {
    type: Object,
    default: () => {},
  },
})

const state = reactive({
  editable: false,
  model: {
    shipdate: null,
    express_co: null,
    trackno: null,
  },
})

const emit = defineEmits(['fetch-cart'])

const actions = {
  handleEdit: async product => {
    if (!state.editable) {
      state.editable = true
      return
    }
    const params = {
      action: 'edit_child',
      preorderid: props.preOrderId,
      child_id: product.id,
      shipdate: state.model.shipdate,
      express: [state.model.express_co, state.model.trackno],
    }
    const { code, msg } = await PreOrderApiHandler(params)
    if (code === 1) {
      state.editable = false
      emit('fetch-cart')
    }
    proxy.$message({
      type: code > 0 ? 'success' : 'error',
      message: msg,
    })
  },
}
</script>