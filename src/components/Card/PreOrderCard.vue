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
          <small>單號</small>
          <p class="sm:text-xl sm:font-bold">#{{ order.id }}</p>
        </div>
        <p
          v-show="showAction"
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

        <div :class="{ hidden: status != 'null' }" v-show="showAction">
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
              <span>送單人</span>
              <span class="text-gray-400">{{ order.mbid }}</span>
            </p>
          </div>

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
              <span class="text-gray-400">{{ order.name || '-' }}</span>
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

          <div
            class="flex flex-row text-sm"
            v-show="Number(order?.ttlamt) > 0 && showAction">
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
            <div class="flex items-center divide-x-2 py-1 shadow bg-white">
              <small class="border-l-2 border-primary-500 px-2"
                >品項共 {{ state?.selectedSubList.length }} 筆</small
              >
              <div class="flex justify-end gap-x-3 tracking-wider text-xs pl-2">
                <p>
                  總PV：<span class="text-primary-500 font-bold">{{
                    totalPV
                  }}</span>
                </p>
                <p>
                  總金額：<span class="text-primary-500 font-bold">{{
                    totalAmount
                  }}</span>
                </p>
              </div>
            </div>
            <SelectedSubProduct
              :selected="state.selectedSubList"
              :type2name="type2name" />
            <p
              class="
                flex
                shadow
                bg-gray-100
                items-center
                justify-center
                gap-x-1
                text-xs
                p-1
              "
              @click="state.show = false">
              <span>收合</span>
              <el-icon> <ArrowUp /></el-icon>
            </p>
          </div>
        </div>
        <div class="flex flex-col w-full relative bottom-0">
          <div class="flex justify-end p-2 border-t" v-show="showAction">
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
          <div class="flex justify-between p-2 border-t" v-show="!showAction">
            <el-tag
              size="small"
              effect="plain"
              round
              :type="formatType(order?.ttlamt, order?.payrcvday)">
              {{ formatTypeTitle(order?.ttlamt, order?.paystatus) }}
            </el-tag>
            <p
              class="text-xs min-w-fit flex items-center gap-x-1"
              :class="{
                'text-green-500': status == 'completed',
                'text-orange-500': status == 'cancelled',
              }"
              v-if="status != 'null'">
              <el-icon v-show="status == 'completed'"
                ><SuccessFilled
              /></el-icon>
              <el-icon v-show="status == 'cancelled'"
                ><CircleCloseFilled
              /></el-icon>
              <span class="text-gray-400">
                {{ order?.date_cancelled || order?.date_completed }}
              </span>
            </p>
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
  showAction: {
    type: Boolean,
    default: true,
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
const totalPV = computed(() => {
  return state.selectedSubList
    .reduce((acc, item) => Number(acc) + Number(item?.pv), 0)
    .toLocaleString()
})

const totalAmount = computed(() => {
  return state.selectedSubList
    .reduce((acc, item) => Number(acc) + Number(item?.amount), 0)
    .toLocaleString()
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