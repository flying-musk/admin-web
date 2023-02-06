<template>
  <div class="space-y-2">
    <div class="flex justify-end text-sm tracking-wider divide-x-2">
          <p class="px-2">
            總PV：<span class="text-primary-500 font-bold">{{ totalPV }}</span>
          </p>
          <p class="px-2">
            總金額：<span class="text-primary-500 font-bold">{{
              totalAmount
            }}</span>
          </p>
        </div>  <div class="shadow md:border rounded bg-white">
    
    <header
      class="
        flex
        items-center
        justify-between
        space-x-3
        shadow
        border
        md:border-0
        p-1
      ">
      <div class="flex items-center justify-between text-sm">
        <p class=" tracking-wider">
          商品（{{ state?.selectedSubList.length }}筆）
        </p>

      </div>
      <!-- 新增商品彈窗 -->
      <CreatePreOrderSubDialog
        :id="id"
        :selected="state.selectedSubList"
        @fetch-cart="actions.handleGetSubProducts(id)" />
    </header>
    <div class="md:p-2 space-y-2 bg-gray-100">
      <SelectedSubProduct
        :selected="state.selectedSubList"
        :type2name="state.type2name" />
    </div>
  </div>
  </div>

</template>

<script setup>
import SubTitle from '@/components/Text/SubTitle.vue'
import CreatePreOrderSubDialog from '@/components/Dialog/CreatePreOrderSubDialog.vue'
import SelectedSubProduct from '@/components/Card/SelectedSubProduct.vue'
import RcvInfoCard from '@/components/Card/RcvInfoCard.vue'
import ShipInfoCard from '@/components/Card/ShipInfoCard.vue'
import { ReadJson } from '@/api/read_json'
import { PreOrderApiHandler } from '@/api/pre_order'
import { reactive, onMounted, computed, getCurrentInstance } from 'vue'
const { proxy } = getCurrentInstance()
const props = defineProps({
  id: {
    type: [String, Number],
    default: '298',
  },
})
const state = reactive({
  editProductModel: {},
  selectedSubList: [],
  common_pd: [],
  type2name: {},
  productOptions: [],
})

onMounted(() => {
  const id = props.id
  actions.handleGetProducts()
  actions.handleGetSubProducts(id)
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
  /**
   * @description 取得子訂單商品
   */
  handleGetSubProducts: async (id, hasProduct = true) => {
    const params = {
      action: 'list_child',
      preorderid: id,
    }
    state.selectedSubList = []
    if (hasProduct) {
      const { code, data, msg } = await PreOrderApiHandler(params)
      state.selectedSubList = data || []
    }
    actions.handleFormatSubProductList()
  },
  /**
   * @description 取得所有商品
   */
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
  /**
   * @description 調整子訂單商品格式
   */
  handleFormatSubProductList: () => {
    const selectedTypes = state.selectedSubList.map(sub => sub.type)
    const data = state.productOptions.map(option => {
      const selected = state.selectedSubList.find(
        item => item.type == option.type
      )
      option.isSelected = selectedTypes.includes(option.type)
      option.sub_id = selected?.id
      option.express_co = selected?.express_co
      option.shipdate = selected?.shipdate
      option.trackno = selected?.trackno
      return option
    })
    state.productOptions = data
  },
}
</script>