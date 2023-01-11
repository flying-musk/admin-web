<template>
  <div class="flex flex-col border rounded-lg overflow-hidden bg-white mb-2">
    <div class="grid grid-cols-1 sm:grid-cols-3">
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
            text-gray-700
            sm:text-primary-700
            flex
            sm:flex-col
            text-xs
            items-center
            gap-x-1
            w-full
            sm:justify-center
          ">
          <small>預收單編號</small>
          <p class="sm:text-xl sm:font-bold">#{{ order.id }}</p>
        </div>
        <p
          class="text-xs min-w-fit flex items-center gap-x-1"
          :class="{
            'text-green-500': status == 'completed',
            'text-orange-500': status == 'cancelled',
          }"
          v-if="status != 'null'">
          <el-icon v-show="status == 'completed'"><SuccessFilled /></el-icon>
          <el-icon v-show="status == 'cancelled'"
            ><CircleCloseFilled
          /></el-icon>
          <span class="text-gray-400">
            {{ order?.date_cancelled || order?.date_completed }}
          </span>
        </p>
        <div :class="{ hidden: status != 'null' }">
          <el-tag
            size="small"
            effect="plain"
            round
            :type="formatType(order?.ttlamt, order?.payrcvday)">
            {{ formatTypeTitle(order?.ttlamt, order?.paystatus) }}
          </el-tag>
        </div>
      </div>
      <div class="flex flex-col sm:border-l col-span-2">
        <div class="flex flex-col space-y-1 p-1 px-2 text-gray-600">
          <div class="flex flex-row text-sm">
            <span class="flex items-center mr-2">
              <el-icon>
                <User />
              </el-icon>
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
              <span>訂購人</span>
              <span class="text-gray-400">{{ order.mbid }}</span>
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
              <span>入單日期</span>
              <span class="text-gray-400">{{ order.dateadd }}</span>
            </p>
          </div>

          <div class="flex flex-row text-sm">
            <span class="flex items-center mr-2">
              <el-icon><PriceTag /></el-icon>
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
              <span
                :class="
                  Number(order?.ttlamt) > 0
                    ? 'text-primary-500'
                    : 'text-gray-400'
                "
                >{{ Number(order.ttlamt || 0).toLocaleString('zh-CN') }}</span
              >
            </p>
          </div>

          <div class="flex flex-row text-sm" v-show="Number(order?.ttlamt) > 0">
            <span class="flex items-center mr-2">
              <el-icon><Box /></el-icon>
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
              <span>品項</span>
              <el-button text bg size="small">
                <p class="pr-1" @click="actions.handleShowSubProduct">
                  查看品項
                </p>
                <el-icon>
                  <ArrowDown />
                </el-icon>
              </el-button>
            </p>
          </div>
          <div class="border" v-show="state.show">
            <small class="border-l-2 border-primary-500 pl-1"
              >品項共 {{ state?.selectedSubList.length }} 筆</small
            >
            <SelectedSubProduct
              :selected="state.selectedSubList"
              :type2name="type2name" />
          </div>
        </div>
        <div class="flex flex-col w-full relative bottom-0">
          <div class="flex justify-end p-2 border-t">
            <el-button
              v-show="status == 'null'"
              size="small"
              round
              @click="
                emit('change-status', { id: order?.id, type: 'completed' })
              "
              >完成</el-button
            >
            <el-button
              v-show="status == 'null'"
              size="small"
              round
              @click="
                emit('change-status', { id: order?.id, type: 'cancelled' })
              "
              >取消</el-button
            >
            <el-button
              v-show="status == 'null'"
              size="small"
              round
              @click="emit('on-edit', { visible: true, id: order?.id })"
              >修改訂單</el-button
            >
            <el-button
              v-show="status != 'null'"
              size="small"
              round
              @click="
                emit('change-status', {
                  id: order?.id,
                  type: status,
                  action: 'reset_order',
                })
              "
              >恢復訂單</el-button
            >
            <el-button size="small" round @click="emit('go-detail', order?.id)"
              >查看詳情</el-button
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import SelectedSubProduct from '@/components/Card/SelectedSubProduct.vue'
import { computed, reactive } from 'vue'
import { PreOrderApiHandler } from '@/api/pre_order'

const props = defineProps({
  status: {
    type: String,
    default: 'null',
  },
  order: {
    type: Object,
    default: () => {},
  },
  type2name: {
    type: Object,
    default: () => {},
  },
})
const emit = defineEmits(['go-detail', 'on-edit', 'change-status'])

const state = reactive({
  selectedSubList: [],
  show: false,
})

const formatType = computed(() => (price = 0, date = null) => {
  const hasPrice = Number(price) > 0
  if (!hasPrice) return 'info'
  if (!date) return 'danger'
  return null
})
const formatTypeTitle = computed(() => (price = 0, paystatus = null) => {
  const hasPrice = Number(price) > 0
  if (!hasPrice) return '未添加商品'
  if (!paystatus) return '未收款'
  return paystatus
})

const actions = {
  handleFetchSubProduct: async () => {
    const params = {
      action: 'list_child',
      preorderid: props.order.id,
    }
    const { code, data, msg } = await PreOrderApiHandler(params)
    state.selectedSubList = data || []
  },
  handleShowSubProduct: () => {
    state.show = !state.show
    if (!state.show) return
    actions.handleFetchSubProduct()
  },
}
</script>