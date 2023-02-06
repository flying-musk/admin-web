<template>
  <div class="mx-auto md:min-w-60 text-md bg-white text-gray-500 rounded border">
    <header
      class="flex items-center justify-between space-x-3 shadow p-1">
      <SubTitle title="收款資料" />
      <button
        class="
          flex
          items-center
          justify-center
          text-gray-700
          p-1
          border
          rounded-full
          shadow
          bg-gray-50
          hover:bg-opacity-50
          hover:text-primary-50
          transition
          duration-100
        ">
        <el-icon><Edit /></el-icon>
      </button>
    </header>        <div class="flex flex-col col-span-3">
          <div class="flex flex-col space-y-2 p-2 text-gray-600">
            <div
              class="
                flex
                items-center
                justify-between
                text-xs
                flex-1
                text-gray-500
                gap-x-3
              ">
              <p class="min-w-fit">收款日期</p>
              <el-date-picker
                v-model="model.payrcvday"
                type="date"
                :editable="false"
                clearable
                placeholder="YYYY-MM-DD"
                value-format="YYYY-MM-DD"
                style="width: 100%" />
            </div>

            <div
              class="
                flex
                items-center
                justify-between
                text-xs
                flex-1
                text-gray-500
                gap-x-3
              ">
              <p class="min-w-fit">收款狀況</p>
              <el-select
                v-model="model.paystatus"
                filterable
                clearable
                default-first-option
                :reserve-keyword="false"
                style="width: 100%"
                placeholder="請選擇收款狀況">
                <el-option
                  v-for="payItem in state.payOptions"
                  :key="payItem.value"
                  :label="payItem.label"
                  :value="payItem.value" />
              </el-select>
            </div>

            <div
              class="
                flex
                items-center
                justify-between
                text-xs
                flex-1
                text-gray-500
                gap-x-3
              ">
              <p class="min-w-fit">訂單備註</p>
              <el-input
                class="text"
                type="textarea"
                v-model="model.remark"
                clearable
                :autosize="{ minRows: 2, maxRows: 5 }"
                placeholder="請輸入備註"
                resize="none" />
            </div>
          </div>
        </div>
      </div>
 
</template>

<script setup>
import SubTitle from '@/components/Text/SubTitle.vue'
import { Calendar } from '@element-plus/icons-vue'
import { reactive } from 'vue'

const props = defineProps({
  preOrderId: {
    type: [String, Number],
    default: '',
  },
})

const state = reactive({
  payOptions: [
    {
      value: '到帳',
      label: '到帳',
    },
    {
      value: '未到帳可發貨',
      label: '未到帳可發貨',
    },
    {
      value: '未到帳不可發貨',
      label: '未到帳不可發貨',
    },
  ],
})

const model = reactive({
  payrcvday: null,
  paystatus: null,
  // paydetail: null,
  remark: null,
})
defineExpose({
  model,
})
</script>