<template>
  <div
    class="flex flex-col border shadow-md rounded-md overflow-hidden mb-3"
    :class="
      actions.hasProduct(product?.type)
        ? 'bg-primary-50 bg-opacity-10'
        : 'bg-white'
    ">
    <div class="grid grid-cols-4">
      <div class="flex flex-col col-span-3">
        <div class="flex flex-col space-y-1 p-1 px-2 text-gray-600">
          <div class="flex flex-row items-center text-sm">
            <!-- <span class="mr-2">
              <el-icon>
                <Box />
              </el-icon>
            </span> -->
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
              <p class="text-center font-semibold text-primary-500">
                {{ product?.name }}
              </p>
            </div>
          </div>

          <div class="flex flex-row items-center text-sm">
            <!-- <span class="mr-2">
              <el-icon>
                <Box />
              </el-icon>
            </span> -->
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
              <p class="text-gray-400">{{ product?.packagesel }}</p>
            </div>
          </div>

          <div class="flex flex-row text-sm">
            <!-- <span class="mr-2">
              <el-icon><Coin /></el-icon>
            </span> -->
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
        </div>
        <!-- <div class="border-t w-full"></div> -->
        <div class="flex flex-col w-full relative bottom-0 p-1">
          <div class="flex justify-end items-center gap-x-3">
            <div
              class="
                flex
                items-center
                gap-x-1
                bg-primary-50 bg-opacity-10
                text-primary-500 text-xs
                p-1
                rounded-t
                cursor-pointer
              "
              :class="{ 'rounded-b': !product.showDetails }"
              @click.stop="product.showDetails = !product.showDetails">
              <p>套裝內容</p>
              <el-icon>
                <ArrowDown />
              </el-icon>
            </div>
          </div>
          <div
            class="flex flex-col text-xs bg-white mb-1 rounded-b round-l border"
            v-show="product?.showDetails">
            <div class="flex flex-col sm:flex-row">
              <div class="lg:w-1/2 border-r">
                <p class="bg-primary-50 text-white p-1">套裝內容</p>
                <div class="p-1">
                  <div
                    class="text-gray-400"
                    v-for="(packageItem, i) in Object.entries(
                      product?.packages
                    )"
                    :key="i">
                    {{ packageItem[0] }}：{{ packageItem[1] }}
                  </div>
                </div>
              </div>
              <div class="flex-1">
                <p class="bg-primary-50 text-white p-1">共同內容</p>
                <div class="grid grid-cols-1 p-1">
                  <div
                    class="text-gray-400"
                    v-for="(test, j) in Object.entries(product)"
                    :key="j">
                    <div
                      v-if="commonPd.includes(test[0])"
                      class="flex justify-start px-1 leading-5">
                      <p class="min-w-[70px]">{{ test[0] }}：</p>
                      <p>
                        {{ test[1] }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
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
                @click="product.showDetails = false">
                <span>收合</span>
                <el-icon> <ArrowUp /></el-icon>
              </p>
            </div>
          </div>
        </div>
      </div>

      <div
        class="
          flex
          sm:flex-col
          gap-y-2
          sm:border-b-0
          items-center
          p-2
          sm:px-4 sm:h-full sm:justify-center
          cursor-pointer
        "
        @click="
          actions.hasProduct(product?.type)
            ? actions.handleDeleteCart(product.type)
            : actions.handleAddCart(product)
        ">
        <div
          class="
            tracking-widest
            text-gray-700
            flex
            sm:flex-col
            text-xs
            items-center
            gap-1
            w-full
            justify-center
          ">
          <div>
            <el-icon
              v-show="actions.hasProduct(product?.type)"
              :size="32"
              color="#5c6ac4">
              <CircleCheckFilled />
            </el-icon>
            <el-icon
              v-show="!actions.hasProduct(product?.type)"
              :size="32"
              color="#ddd">
              <CircleCheck />
            </el-icon>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { getCurrentInstance } from 'vue'
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
  listChild: {
    type: Array,
    default: () => [],
  },
  visible: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['fetch-cart'])

const actions = {
  /**
   * @description  新增訂單內商品
   */
  handleAddCart: async product => {
    const params = {
      action: 'add_child',
      preorderid: props.preOrderId,
      orderdata: {
        type: product.type,
        pds: { [product.packagesel]: 1 },
        amount: product.amount,
      },
      iscfm: 1,
    }
    const { code, msg } = await PreOrderApiHandler(params)
    if (code === 1) {
      emit('fetch-cart')
    }
    proxy.$message({
      type: code > 0 ? 'success' : 'error',
      message: msg,
    })
  },
  /**
   * @description  刪除訂單內商品
   */
  handleDeleteCart: async type => {
    const product = props.listChild.find(item => item?.type === type)
    const params = {
      action: 'del_child',
      preorderid: props.preOrderId,
      child_id: product?.id,
    }
    const { code, msg } = await PreOrderApiHandler(params)
    if (code === 1) {
      emit('fetch-cart')
    }
    proxy.$message({
      type: code > 0 ? 'success' : 'error',
      message: msg,
    })
  },
  /**
   * @description  判斷訂單內有無商品
   */
  hasProduct: type => {
    const types = props.listChild.map(item => item?.type)
    return types.includes(type)
  },
}
</script>

