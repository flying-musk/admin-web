<template>
  <div>
    <div
      v-show="selected?.length < 6"
      class="
        border
        flex
        justify-center
        items-center
        rounded
        hover:border-primary-300
        border-dashed
        cursor-pointer
        bg-gray-50
        min-h-[100px]
        h-full
      "
      @click="actions.handleDialog(true)">
      <el-icon :size="32"><Plus /></el-icon>
    </div>
    <el-dialog
      v-model="state.dialogVisible"
      align-center
      class="create-dialog"
      fullscreen
      :width="formatDialogWidth"
      :close-on-click-modal="false"
      @close="actions.handleDialog">
      <header
        class="
          pl-3
          pr-2
          py-2
          border-b
          flex
          justify-between
          items-center
          bg-primary-500
          text-gray-50
        ">
        <h5 class="text-sm tracking-widest font-base">
          預收單#{{ id }} 新增商品
        </h5>

        <el-button link circle @click="state.dialogVisible = false">
          <el-icon color="#fff"><CloseBold /></el-icon>
        </el-button>
      </header>
      <!-- 訂購商品 -->
      <div class="p-3">
        <div>
          <div
            class="
              flex
              items-center
              gap-x-2
              tracking-widest
              leading-10
              text-md
              px-1
              mb-3
              bg-primary-50 bg-opacity-10
              rounded
              text-gray-500
            ">
            <div class="flex justify-center items-center tracking-wider">
              <el-icon :size="20"><InfoFilled /></el-icon>
            </div>
            <p>請勾選要訂購商品</p>
          </div>
          <div class="grid grid-cols-1 gap-2">
            <PreOrderProductCard
              :visible="state.dialogVisible"
              v-for="product in state.productOptions"
              :key="product.name"
              :pre-order-id="props.id"
              :product="product"
              :common-pd="state.common_pd"
              :list-child="selected"
              @fetch-cart="emit('fetch-cart')" />
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
  
  <script setup>
import PreOrderProductCard from '@/components/Card/PreOrderProductCard.vue'
import { ReadJson } from '@/api/read_json'
import { PreOrderApiHandler } from '@/api/pre_order'
import { ref, reactive, computed, getCurrentInstance } from 'vue'
import { useStore } from 'vuex'
import { pickBy, isEmpty } from 'lodash-es'
import { useRouter } from 'vue-router'
const props = defineProps({
  id: {
    type: String,
    default: '',
  },
  selected: {
    type: Array,
    default: () => [],
  },
})
const emit = defineEmits(['fetch-cart'])

const router = useRouter()
const { proxy } = getCurrentInstance()
const store = useStore()
const paymentCard = ref(null)
const state = reactive({
  dialogVisible: false,
  productOptions: [],
  type2name: [],
  common_pd: [],
})
const formatDialogWidth = computed(() => {
  const width = window.innerWidth
    ? window.innerWidth
    : document.documentElement.clientWidth
    ? document.documentElement.clientWidth
    : screen.width
  return width < 768 ? '100%' : '600px'
})

const actions = {
  /**
   * @description  開啟/關閉 新增預收單彈窗
   */
  handleDialog: (dialogVisible = false) => {
    state.dialogVisible = dialogVisible
  },
  handleGetProducts: async () => {
    const { code, data } = await ReadJson('salepkg')
    if (code === 1) {
      const { type2name, price, packagesel, packages, BBTcommon } = data
      state.type2name = type2name
      state.common_pd = Object.keys(BBTcommon)
      const filterType = Object.keys(type2name)
        .filter(name => name != 'salesingle')
        .reduce((res, key) => ((res[key] = type2name[key]), res), {})
      const getKeys = Object.keys(filterType)
      const products = getKeys.map(key => {
        const item = {
          type: key,
          name: type2name[key],
          packages: packages[packagesel[key]],
          packagesel: packagesel[key][0],
          amount: price[key],
          ...packages[packagesel[key]],
          ...BBTcommon,
        }
        return item
      })
      state.productOptions = products
    }
  },
}
actions.handleGetProducts()
</script>
