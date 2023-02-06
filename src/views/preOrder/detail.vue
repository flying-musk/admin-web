<template>
  <div id="pre-order-detail">
    <div
      v-show="state.loading"
      class="flex min-w-screen min-h-screen justify-center items-center">
      <iframe src="https://embed.lottiefiles.com/animation/97930"></iframe>
    </div>
    <div class="rounded bg-white" v-show="!state.loading">
      <div class="space-y-1 detail-page">
        <!-- <StatusBarCard /> -->
        <div
        v-if="false"
          class="
            px-3
            py-2
            from-primary-50
            to-primary-400
            bg-gradient-to-tr
            flex
            items-center
            justify-between
            rounded-t
          "
          :class="{
            '   from-green-300 to-green-500':
              !!state.editProductModel?.date_completed,
            '  from-orange-300 to-orange-500':
              !!state.editProductModel?.date_cancelled,
          }">
          <small
            class="
              px-2
              text-primary-500
              bg-white
              border-primary-50 border
              shadow
              rounded-full
              tracking-widest
            "
            :class="{
              '  text-green-500  border-green-50 ':
                !!state.editProductModel?.date_completed,
              ' text-orange-500 border-orange-50':
                !!state.editProductModel?.date_cancelled,
            }">
            {{
              !!state.editProductModel?.date_completed
                ? '已完成'
                : !!state.editProductModel?.date_cancelled
                ? '已取消'
                : '處理中'
            }}
          </small>
          <div class="text-xs">
            <p class="flex items-center text-gray-50 gap-x-1">
              <el-icon
                v-show="
                  !!state.editProductModel?.date_cancelled ||
                  !!state.editProductModel?.date_completed
                ">
                <Timer />
              </el-icon>
              <span class="min-w-fit">{{
                !!state.editProductModel?.date_cancelled
                  ? state.editProductModel?.date_cancelled
                  : !!state.editProductModel?.date_completed
                  ? state.editProductModel?.date_completed
                  : state.editProductModel?.paystatus
              }}</span>
            </p>
          </div>
        </div>
        <el-page-header @back="actions.handleGoBack" class="p-1">
          <template #icon>
<el-icon>            <el-icon :class="{ 'ml-3': !!props.id }">
              <Back v-show="!props.id" />
              <Refresh v-show="!!props.id" />
            </el-icon>
          </template>
          <template #title>
            <p v-show="!props.id" class="hidden sm:flex text-sm">返回</p>
          </template>
          <template #content>
            <div class="flex items-center text-primary-500 gap-x-2">
              <span class="hidden lg:flex">
                <el-icon size="20"><DocumentChecked /></el-icon>
              </span>
              <span class="text-sm text-gray-700 tracking-wider">預收單 </span>
              <p class="text-sm font-bold tracking-wide">
                #{{ route.params.id || id }}
              </p>
            </div>
          </template>
          <template #extra>
            <div class="pr-1 flex flex-col gap-x-3 gap-y-1 text-xs justify-end">
              <p class="flex items-center text-gray-500 gap-x-2">
                <el-icon><Calendar /></el-icon>
                <span class="min-w-fit">{{
                  state.editProductModel?.dateadd
                }}</span>
              </p>
            </div>
          </template>
        </el-page-header>

        <div class="bg-gray-100 space-y-1 p-1" v-if="false">
          <div class="flex items-center gap-x-1">
            <div
              class="
                w-5
                h-5
                text-xs
                rounded-full
                flex
                justify-center
                items-center
                border border-primary-500
                bg-white
                text-primary-500
              ">
              送
            </div>
            {{ state.editProductModel?.mbid }}
          </div>
        </div>
        <div class="bg-gray-100 space-y-1">
          <div class="bg-gray-100 border">
            <div
              class="
                flex
                items-center
                justify-between
                pr-2
                py-1
                shadow
                bg-white
              ">
              <SubTitle :title="`商品（${state.selectedSubList?.length}筆）`" />
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

            <el-empty
              class="flex items-center justify-center"
              v-show="state.selectedSubList?.length == 0 && state.isDisabled">
            </el-empty>
            <div
              class="grid grid-cols-1 sm:grid-cols-2 md:gird-cols-3 gap-y-1"
              :class="{
                'lg:gird-cols-4 xl:grid-cols-5 lg:bg-white': !props.id,
              }">
              <!-- 新增商品彈窗 -->
              <CreatePreOrderSubDialog
                v-if="state.selectedSubList?.length < 6 && !state.isDisabled"
                :id="route.params.id"
                :selected="state.selectedSubList"
                @fetch-cart="actions.handleGetSubProducts(route.params.id)" />
              <div
                class="lg:border bg-white rounded "
                v-for="product in state.selectedSubList"
                :key="product.id">
                <div class="grid grid-cols-1">
                  <div class="flex gap-y-2 border-b items-center pr-2 py-1">
                    <div
                      class="
                        tracking-widest
                        text-primary-700
                        flex
                        text-md
                        items-center
                        gap-x-1
                        w-full
                      ">
                      <small
                        class="
                          bg-primary-500
                          text-white
                          rounded-r-full
                          py-[0.5px]
                          px-2
                        "
                        >{{ state.type2name[product?.type] }}</small
                      >
                    </div>
                    <small class="min-w-fit text-gray-400">{{
                      product?.entry
                    }}</small>
                  </div>
                  <div class="flex flex-col col-span-3">
                    <div class="flex flex-col space-y-1 p-1 px-2 text-gray-600">
                      <div class="flex flex-row text-sm">
                        <p
                          class="
                            flex
                            items-center
                            justify-between
                            text-xs
                            flex-1
                            text-gray-500
                          ">
                          <span>商品品項</span>
                          <span class="text-gray-400">{{
                            product?.package
                          }}</span>
                        </p>
                      </div>

                      <div class="flex flex-row text-sm">
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
                          <span class="text-gray-400">{{
                            product?.shipdate
                          }}</span>
                        </p>
                      </div>
                      <div class="flex flex-row text-sm">
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
                              class="mr-2"
                              v-show="!!product?.express_co">
                              <p class="tracking-wides">
                                {{ product?.express_co }}
                              </p> </el-tag
                            >{{ product?.trackno }}</span
                          >
                        </p>
                      </div>

                      <div class="flex flex-row text-sm">
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
                          <span
                            :class="
                              Number(product?.pv) > 0
                                ? 'text-primary-500'
                                : 'text-gray-400'
                            "
                            >{{
                              Number(product?.pv || 0).toLocaleString('zh-CN')
                            }}</span
                          >
                        </p>
                      </div>
                      <div class="flex flex-row text-sm">
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
                              Number(product?.amount) > 0
                                ? 'text-primary-500'
                                : 'text-gray-400'
                            "
                            >{{
                              Number(product?.amount || 0).toLocaleString(
                                'zh-CN'
                              )
                            }}</span
                          >
                        </p>
                      </div>
                    </div>
                    <div
                      class="flex flex-col w-full relative bottom-0"
                      v-show="!state.isDisabled">
                      <div class="flex justify-end px-2 py-1 border-t">
                        <div>
                          <el-popover
                            width="300"
                            trigger="click"
                            :name="product?.id"
                            :popper-options="{
                              boundariesElement: 'viewport',
                              removeOnDestroy: true,
                            }"
                            :ref="actions.handleGetRefPopover">
                            <template #reference>
                              <el-button
                                size="small"
                                round
                                @click="
                                  () => {
                                    state.editShipModel = {
                                      trackno: product?.trackno,
                                      express_co: product?.express_co || 'UPS',
                                      shipdate: product?.shipdate,
                                    }
                                  }
                                ">
                                修改物流
                              </el-button>
                            </template>
                            <el-divider content-position="center">
                              <p>修改物流資料</p>
                            </el-divider>
                            <el-form
                              class="form"
                              label-position="top"
                              :model="state.editShipModel">
                              <el-form-item label="出貨日期" prop="shipdate">
                                <el-date-picker
                                  v-model="state.editShipModel.shipdate"
                                  type="date"
                                  :teleported="false"
                                  :editable="false"
                                  :clearable="
                                    !!state.editShipModel.shipdate
                                      ? false
                                      : true
                                  "
                                  placeholder="請選擇出貨日期"
                                  value-format="YYYY-MM-DD"
                                  style="width: 100%" />
                              </el-form-item>
                              <el-form-item label="快遞公司" prop="express_co">
                                <el-radio-group
                                  v-model="state.editShipModel.express_co"
                                  size="small">
                                  <el-radio label="UPS">UPS</el-radio>
                                  <el-radio label="FEDEX">FEDEX</el-radio>
                                  <el-radio label="POST">POST</el-radio>
                                </el-radio-group>
                              </el-form-item>
                              <el-form-item label="快遞單號" prop="trackno">
                                <el-input
                                  class="text"
                                  v-model="state.editShipModel.trackno"
                                  clearable
                                  placeholder="請輸入快遞單號" />
                              </el-form-item>
                              <el-button
                                type="primary"
                                class="w-full"
                                auto-insert-space
                                @click="
                                  actions.handleEditSubProduct(
                                    state.editProductModel.id,
                                    product?.id
                                  )
                                "
                                >修改物流</el-button
                              >
                            </el-form>
                          </el-popover>
                          <el-popconfirm
                            title="確定要移除此商品嗎?"
                            width="200px"
                            @confirm="
                              actions.handleDeleteSubProduct(
                                state.editProductModel?.id,
                                product?.id
                              )
                            ">
                            <template #reference>
                              <el-button size="small" round>移除</el-button>
                            </template>
                          </el-popconfirm>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 訂購人、收貨人資料 -->
          <div class="grid lg:grid-cols-2 gap-1">
            <BookingInfoCard :info="state.editProductModel" />
            <RcvInfoCard :info="state.editProductModel" />
          </div>

          <!-- 點位資料 -->
          <PosInfoCard :info="state.editProductModel" />

          <!-- 收款資料 -->
          <PayInfoCard :info="state.editProductModel" />

          <!-- 訂單備註 -->
          <div class="space-y-1 py-2 border-t border-b bg-white">
            <SubTitle title="訂單備註" />
            <p class="leading-4 py-1 px-3 break-all text-sm text-gray-500">
              {{ state.editProductModel.remark || '-' }}
            </p>
          </div>

          <!-- 附件 -->
          <div class="space-y-1 py-2 border-t border-b bg-white">
            <SubTitle :title="`附件（${state.editModelFiles?.length}筆）`" />
            <UploadFile
              class="p-2"
              v-model:list="state.editModelFiles"
              title="附件"
              :id="state.editProductModel.id"
              :disabled="state.isDisabled"
              @on-change="actions.handleFileUpdate" />
          </div>
        </div>
      </div>
    </div>
    <ScrollToTop @click.prevent="actions.handleScrollToTop" class="lg:hidden" />
  </div>
</template>
<script setup>
import { useRoute, useRouter } from 'vue-router'
import { PreOrderApiHandler } from '@/api/pre_order'
import { ReadJson } from '@/api/read_json'
import {
  ref,
  reactive,
  watch,
  computed,
  onMounted,
  getCurrentInstance,
} from 'vue'
import { useVariables } from '@/hooks/useVariables'
import { pickBy, isEmpty } from 'lodash-es'
import { useStore } from 'vuex'
import SubTitle from '@/components/Text/SubTitle.vue'
import CardTwoCol from '@/components/Card/CardTwoCol.vue'
import UploadFile from '@/components/Upload/UploadFile.vue'
import ScrollToTop from '@/components/Button/ScrollToTop.vue'
import RcvInfoCard from '@/components/Card/RcvInfoCard.vue'
import BookingInfoCard from '@/components/Card/BookingInfoCard.vue'
import PosInfoCard from '@/components/Card/PosInfoCard.vue'
import PayInfoCard from '@/components/Card/PayInfoCard.vue'
import StatusBarCard from '@/components/Card/StatusBarCard.vue'
import CreatePreOrderSubDialog from '@/components/Dialog/CreatePreOrderSubDialog.vue'
const props = defineProps({
  id: {
    type: String,
    default: '',
  },
})
const { proxy } = getCurrentInstance()
const { variables } = useVariables()
const store = useStore()
const router = useRouter()
const route = useRoute()
const refForm = ref(null)
const state = reactive({
  loading: false,
  editProductModel: {},
  editModelFiles: [],
  isDisabled: false,
  sameAddr: false,
  zipCode: '',
  postcode: '',
  postcode2: '',
  zipCode2: '',
  productOptions: [],
  selectedSubList: [],
  common_pd: [],
  type2name: {},
  memberOptions: [],
  editShipModel: {
    express_co: 'UPS',
    shipdate: null,
    trackno: null,
  },
  previewData: {},
  previewMbid: '',
  confirmData: {},
  dialogVisible: false,
  titleMap: {
    type: '類型',
    amount: '價格',
    pv: 'PV',
    pds: '商品內容',
  },
  refPopover: {},
})
watch(
  () => props.id,
  (id, prevId) => {
    if (!!id && id != prevId) {
      actions.handleGetProducts()
      actions.handleFetchPreOrder()
    }
  }
)
watch(
  () => state.editProductModel.add1,
  (add1, prevAdd1) => {
    const zipCode = add1?.split(' ')[0]
    const postcode = add1?.split(zipCode)[1]
    if (!isEmpty(zipCode) && !isEmpty(postcode)) {
      state.zipCode = zipCode
      actions.handleZipCode()
      state.postcode = postcode
    }
  }
)
watch(
  () => state.editProductModel.shipadd1,
  (shipadd1, prevShipadd1) => {
    const zipCode2 = shipadd1?.split(' ')[0]
    const postcode2 = shipadd1?.split(zipCode2)[1]
    if (!isEmpty(zipCode2) && !isEmpty(postcode2)) {
      state.zipCode2 = zipCode2
      actions.handleZipCode2()
      state.postcode2 = postcode2
    }
  }
)
onMounted(() => {
  const id = route.params.id || props.id
  if (!id) {
    router.go(-1)
  } else {
    actions.handleGetProducts()
    actions.handleFetchPreOrder()
  }
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
const hasAddress = computed(() => store.getters.hasAddress)
const hasAddress2 = computed(() => store.getters.hasAddress2)
const postcodeOptions = computed(() => store.getters.postcodeOptions)
const postcodeRecOptions = computed(() => store.getters.postcodeRecOptions)
const sameAddrHandler = computed({
  get: () => state.sameAddr,
  set(v) {
    if (v) {
      state.editProductModel.first_rcvname = state.editProductModel.first_name
      state.editProductModel.last_rcvname = state.editProductModel.last_name
      state.editProductModel.rcvphone = state.editProductModel.phone
      state.editProductModel.rcvemail = state.editProductModel.email
      state.editProductModel.shipadd = state.editProductModel.add
      state.editProductModel.shipadd1 = state.editProductModel.add1
      state.editProductModel.shipadd2 = state.editProductModel.add2
      state.zipCode2 = state.editProductModel.zipCode
    }
    state.sameAddr = v
  },
})
const selectedPostcode = computed({
  get: () => state.postcode,
  set(v) {
    state.postcode = v
    state.editProductModel.add1 = `${state.zipCode} ${state.postcode}`
  },
})
const selectedPostcodeRec = computed({
  get: () => state.postcode2,
  set(v) {
    state.postcode2 = v
    state.editProductModel.shipadd1 = `${state.zipCode2} ${state.postcode2}`
  },
})
const actions = {
  /**
   * @description 取得子訂單內容
   */
  handleFetchPreOrder: async (showLoading = true) => {
    const id = route.params.id || props.id
    const params = {
      action: 'listbyid',
      id: id,
    }
    state.loading = showLoading
    const { code, data, msg } = await PreOrderApiHandler(params)
    setTimeout(() => {
      state.loading = false
    }, 500)
    if (code > 0) {
      const { name = '', rcvname, smbid, umbid, rmbid, ...rest } = data
      const first_name = name?.split(' ')[0] || ''
      const last_name = name?.split(' ')[1] || ''
      const first_rcvname = rcvname?.split(' ')[0] || ''
      const last_rcvname = rcvname?.split(' ')[1] || ''
      const smbid_name = smbid?.split(' ')[0] || ''
      const smbid_phone = smbid?.split(' ')[1] || ''
      const umbid_name = umbid?.split(' ')[0] || ''
      const umbid_phone = umbid?.split(' ')[1] || ''
      const rmbid_name = rmbid?.split(' ')[0] || ''
      const rmbid_phone = rmbid?.split(' ')[1] || ''
      const format_rmbid = `${rmbid_name} ${rmbid_phone}`
      const format_umbid = `${umbid_name} ${umbid_phone}`
      const format_smbid = `${smbid_name} ${smbid_phone}`
      const has_rmbid = !isEmpty(rmbid_name) && !isEmpty(rmbid_phone)
      const has_umbid = !isEmpty(umbid_name) && !isEmpty(umbid_phone)
      const has_smbid = !isEmpty(smbid_name) && !isEmpty(smbid_phone)
      const formatPostType = !isEmpty(rmbid_phone) ? 'phone' : 'mbid'

      state.editProductModel = {
        first_name,
        last_name,
        first_rcvname,
        last_rcvname,
        smbid: has_smbid ? format_smbid : smbid,
        smbid_name: smbid_phone ? smbid_name : null,
        smbid_phone,
        umbid: has_umbid ? format_umbid : umbid,
        umbid_name: umbid_phone ? umbid_name : null,
        umbid_phone,
        rmbid: has_rmbid ? format_rmbid : rmbid,
        rmbid_name: rmbid_phone ? rmbid_name : null,
        rmbid_phone,
        posType: formatPostType,
        ...rest,
      }
      const is_cancelled = !!state.editProductModel?.date_cancelled
      const is_completed = !!state.editProductModel?.date_completed
      state.isDisabled = is_cancelled || is_completed
      actions.handleGetSubProducts(id)
      actions.handleGetFiles(id)
    } else {
      proxy.$message({
        type: 'error',
        message: msg,
      })
    }
  },
  /**
   * @description 單選/取消選中
   */
  handleRadioClick: (label, val) => {
    if (state.isDisabled) return
    val === state.editProductModel[label]
      ? (state.editProductModel[label] = '')
      : (state.editProductModel[label] = val)
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
  /**
   * @description 取得訂單附件
   */
  handleGetFiles: async id => {
    const params = {
      action: 'list_up_files',
      preorderid: id,
    }
    const { code, data } = await PreOrderApiHandler(params)
    if (code === 1) {
      const files = data.files
      state.editModelFiles = files.map(file => {
        const type = file[1].split('.')[1]
        const prefix = `${file[1].split('_')[0]}_${file[1].split('_')[1]}_`
        const original_name = file[1].split(prefix)[1]
        return {
          type: type,
          path: file[0],
          name: file[1],
          original_name: original_name,
        }
      })
      console.log(state.editModelFiles)
    }
  },
  /**
   * @description 上傳圖片
   */
  handleFileUpdate: list => {
    state.editModelFiles = list
  },
  /**
   * @description 編輯主訂單
   */
  handlePreOrderEdit: async () => {
    const {
      id,
      ordermbid,
      dateadd,
      ttlamt,
      name,
      first_name,
      last_name,
      rcvname,
      first_rcvname,
      last_rcvname,
      add,
      add1,
      add2,
      shipadd,
      shipadd1,
      shipadd2,
      rmbid,
      rmbid_name,
      rmbid_phone,
      umbid,
      umbid_name,
      umbid_phone,
      smbid,
      smbid_name,
      smbid_phone,
      posType,
      ...rest
    } = state.editProductModel
    const format_add = [add1, add2]
    const format_shipAdd = [shipadd1, shipadd2]
    const format_rmbid = `${rmbid_name} ${rmbid_phone}`
    const format_umbid = `${umbid_name} ${umbid_phone}`
    const format_smbid = `${smbid_name} ${smbid_phone}`
    const format_name = `${first_name} ${last_name}`
    const format_rcvname = `${first_rcvname} ${last_rcvname}`
    const has_name = !isEmpty(first_name) && !isEmpty(last_name)
    const has_rcvname = !isEmpty(first_rcvname) && !isEmpty(last_rcvname)
    const has_add = !isEmpty(add1) && !isEmpty(add2)
    const has_shipadd = !isEmpty(shipadd1) && !isEmpty(shipadd2)
    const has_rmbid = !isEmpty(rmbid_name) && !isEmpty(rmbid_phone)
    const has_umbid = !isEmpty(umbid_name) && !isEmpty(umbid_phone)
    const has_smbid = !isEmpty(smbid_name) && !isEmpty(smbid_phone)
    const params = {
      action: 'edit',
      preorderid: id,
      data: pickBy({
        name: has_name ? format_name : null,
        rcvname: has_rcvname ? format_rcvname : null,
        add: has_add ? format_add : null,
        shipadd: has_shipadd ? format_shipAdd : null,
        rmbid: has_rmbid ? format_rmbid : rmbid,
        umbid: has_umbid ? format_umbid : umbid,
        smbid: has_smbid ? format_smbid : smbid,
        ...rest,
      }),
    }
    const { code, data, msg } = await PreOrderApiHandler(params)
    if (code > 0) {
      state.editProductModel = {}
      actions.handleFetchPreOrder(false)
    }
    proxy.$message({
      type: code > 0 ? 'success' : 'error',
      message: msg,
    })
  },
  /**
   * @description 加入子訂單商品
   */
  handleAddSubProduct: async (id, mbid, product, iscfm = 0) => {
    console.log(product)
    const params = {
      action: 'add_child',
      preorderid: id,
      orderdata: {
        type: product.type,
        pds: { [product.packagesel]: 1 },
        amount: product.amount,
      },
      iscfm: iscfm,
    }
    const { code, data, msg } = await PreOrderApiHandler(params)
    if (code === 2) {
      if (params.iscfm == 0) {
        state.previewMbid = mbid
        state.previewData = data
        state.dialogVisible = true
        state.confirmData = { id, mbid, product, iscfm: 1 }
        return
      }
    }
    if (code === 1) {
      if (params.iscfm == 1) {
        state.dialogVisible = false
        state.previewMbid = null
        state.previewData = null
        state.confirmData = {}
      }
      actions.handleFetchPreOrder(false)
    }
    proxy.$message({
      type: code > 0 ? 'success' : 'error',
      message: msg,
    })
  },
  /**
   * @description 編輯子訂單商品
   */
  handleEditSubProduct: async (id, sub_id) => {
    console.log(state.refPopover)
    const params = {
      action: 'edit_child',
      preorderid: id,
      child_id: sub_id,
      shipdate: state.editShipModel.shipdate,
      express: [state.editShipModel.express_co, state.editShipModel.trackno],
    }
    const { code, data, msg } = await PreOrderApiHandler(params)
    if (code === 1) {
      state.editShipModel = {
        express_co: 'UPS',
        shipdate: null,
        trackno: null,
      }
      actions.handleFetchPreOrder(false)
    }
    proxy.$message({
      type: code > 0 ? 'success' : 'error',
      message: msg,
    })
  },
  /**
   * @description 刪除子訂單商品
   */
  handleDeleteSubProduct: async (id, sub_id) => {
    const params = {
      action: 'del_child',
      preorderid: id,
      child_id: sub_id,
    }
    const { code, data, msg } = await PreOrderApiHandler(params)
    if (code === 1) {
      actions.handleFetchPreOrder(false)
    }
    proxy.$message({
      type: code > 0 ? 'success' : 'error',
      message: msg,
    })
  },
  handleZipCode: val => {
    if (val && val.toUpperCase() !== val) {
      state.zipCode = val.toUpperCase()
    } else {
      if (state.zipCode && state.zipCode.length >= 5) {
        store.dispatch('getFormattedAddress', state.zipCode)
      }
    }
  },
  handleZipCode2: val => {
    if (val && val.toUpperCase() !== val) {
      state.zipCode2 = val.toUpperCase()
    } else {
      if (state.zipCode2 && state.zipCode2.length >= 5) {
        store.dispatch('getFormattedAddress2', state.zipCode2)
      }
    }
  },
  handleGoBack: () => {
    if (!!props.id) {
      actions.handleGetProducts()
      actions.handleFetchPreOrder()
      return
    }
    if (window.history.state.back) {
      router.back()
    } else {
      router.replace({ path: '/preOrder' })
    }
  },
  handleGetRefPopover: el => {
    if ((el && el.$attrs['name'] >= 0) || (el && el.$attrs['name'])) {
      state.refPopover[el.$attrs['name']] = el
    }
  },
  handleScrollToTop: () => {
    const anchor = document.querySelector('#pre-order-detail')
    if (!anchor) return
    anchor.scrollIntoView({ behavior: 'smooth' })
  },
}
</script>

<style lang="scss">
.detail-page {
  .el-form {
    --el-disabled-text-color: #252525;
    .el-input.is-disabled .el-input__inner {
      cursor: default;
    }
  }
}
</style>