<template>
  <div>
    <div class="flex justify-end gap-x-3 tracking-wider pb-2 pr-1">
      <p>
        總PV：<span class="text-primary-500 font-bold text-lg">{{
          totalPV
        }}</span>
      </p>
      <p>
        總金額：<span class="text-primary-500 font-bold text-lg">{{
          totalAmount
        }}</span>
      </p>
    </div>
    <div class="grid grid-cols-5 gap-3">
      <div class="col-span-5 sm:col-span-2 border space-y-1">
        <p class="bg-gray-50 p-1 shadow tracking-wider">
          訂單商品（{{ listChild?.length }}筆）
        </p>
        <div class="space-y-1">
          <div
            v-for="product in listChild"
            :key="product.id"
            class="
              flex flex-col
              rounded-lg
              overflow-hidden
              border-b
              last:border-b-0
            ">
            <div class="grid grid-cols-1">
              <div class="flex flex-col col-span-3">
                <div class="flex flex-col space-y-1 p-1 px-2 text-gray-600">
                  <div class="flex flex-row items-center text-sm">
                    <span class="flex items-center mr-2">
                      <el-icon>
                        <Box />
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
                      ">
                      <p>商品品項</p>
                      <p
                        class="
                          leading-6
                          text-center
                          font-semibold
                          text-primary-500
                        ">
                        {{ formatType[product?.type] }}
                      </p>
                    </div>
                  </div>

                  <div class="flex flex-row items-center text-sm">
                    <span class="flex items-center mr-2">
                      <el-icon>
                        <Box />
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
                      ">
                      <p>套裝名稱</p>
                      <p class="text-gray-400">{{ product?.package }}</p>
                    </div>
                  </div>

                  <div class="flex flex-row text-sm">
                    <span class="flex items-center mr-2">
                      <el-icon><Coin /></el-icon>
                    </span>
                    <p
                      class="
                        flex
                        items-center
                        justify-between
                        text-xs
                        flex-1
                        text-gray-500
                      ">
                      <span>金額</span>
                      <span class="text-gray-400">{{
                        Number(product?.amount || 0).toLocaleString('zh-CN')
                      }}</span>
                    </p>
                  </div>

                  <div class="flex flex-row text-sm">
                    <span class="flex items-center mr-2">
                      <el-icon><Coin /></el-icon>
                    </span>
                    <p
                      class="
                        flex
                        items-center
                        justify-between
                        text-xs
                        flex-1
                        text-gray-500
                      ">
                      <span>PV</span>
                      <span class="text-gray-400">{{
                        Number(product?.pv || 0).toLocaleString('zh-CN')
                      }}</span>
                    </p>
                  </div>

                  <div class="flex flex-row text-sm">
                    <span class="flex items-center mr-2">
                      <el-icon><Calendar /></el-icon>
                    </span>
                    <p
                      class="
                        flex
                        items-center
                        justify-between
                        text-xs
                        flex-1
                        text-gray-500
                      ">
                      <span>出貨日期</span>
                      <span class="text-gray-400">{{ product?.shipdate }}</span>
                    </p>
                  </div>
                  <div class="flex flex-row text-sm">
                    <span class="flex items-center mr-2">
                      <el-icon><Van /></el-icon>
                    </span>
                    <p
                      class="
                        flex
                        items-center
                        justify-between
                        text-xs
                        flex-1
                        text-gray-500
                      ">
                      <span>快遞單號</span>
                      <span class="text-gray-400">
                        <el-tag
                          effect="plain"
                          round
                          size="small"
                          class="flex items-center mr-2"
                          v-show="!!product?.express_co">
                          <p class="tracking-wides">
                            {{ product?.express_co }}
                          </p> </el-tag
                        >{{ product?.trackno }}</span
                      >
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-span-5 sm:col-span-3 border">
        <p class="bg-gray-50 p-1 shadow racking-wider">收款資料</p>
        <div class="flex flex-col col-span-3">
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
    </div>
  </div>
</template>

<script setup>
import { Calendar } from '@element-plus/icons-vue'
import { reactive, computed } from 'vue'

const props = defineProps({
  listChild: {
    type: Array,
    default: () => [],
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

const totalPV = computed(() => {
  return props.listChild
    .reduce((acc, item) => Number(acc) + Number(item?.pv), 0)
    .toLocaleString()
})

const totalAmount = computed(() => {
  return props.listChild
    .reduce((acc, item) => Number(acc) + Number(item?.amount), 0)
    .toLocaleString()
})

defineExpose({
  model,
})
</script>