<template>
  <div id="pre-order" class="h-full">
    <div class="flex flex-col gap-y-3 md:bg-white md:h-full md:p-3 rounded-md">
      <!-- header -->
      <header class="flex items-center justify-between">
        <TitleWithCount title="預收訂單" :total="state.pagination.total">
          <div class="hidden md:block">
            <SelectDate
              v-model:selectedDate="state.selectedDate"
              @on-change="actions.handlePreOrderList" />
          </div>
        </TitleWithCount>

        <div>
          <!-- 新增預收單彈窗 -->
          <CreatePreOrderDialog />
        </div>
      </header>

      <div class="md:hidden">
        <SelectDate
          style="width: 100%"
          v-model:selectedDate="state.selectedDate"
          @on-change="actions.handlePreOrderList" />
      </div>
      <div class="hidden lg:flex justify-end">
        <el-button
          size="small"
          :type="state.listType == 'table' ? 'primary' : null"
          @click="state.listType = 'table'">
          <svg-icon name="list" class="w-4 h-4"></svg-icon>
        </el-button>
        <el-button
          size="small"
          :type="state.listType == 'grid' ? 'primary' : null"
          @click="state.listType = 'grid'">
          <svg-icon name="grid" class="w-4 h-4"></svg-icon>
        </el-button>
      </div>

      <!-- list -->
      <el-tabs
        v-model="state.selectedStatus"
        @tab-click="actions.handleTabClick">
        <el-tab-pane
          v-for="status in state.statusOptions"
          :key="status.label"
          :label="status.label"
          :name="status.value">
          <!-- list section [mobile] -->
          <PreOrderCard
            v-for="order in state.tableData"
            :key="order.id"
            :status="state.selectedStatus"
            :order="order"
            :type2name="state.type2name"
            @change-status="actions.handlePreOrderStatus"
            @go-detail="actions.handlePushDetail"
            @on-edit="actions.handlePreOrderManage"
            class="lg:hidden" />
          <div
            v-if="state?.tableData.length == 0 && !state.loading"
            class="flex justify-center items-center">
            <el-empty></el-empty>
          </div>
          <ScrollToTop
            @click.prevent="actions.handleScrollToTop"
            class="lg:hidden" />

          <!-- list section [PC] -->
          <div class="hidden lg:block">
            <BasicTable
              v-show="state.listType == 'table'"
              :table-data="formatPaginationTableData"
              :columns="state.columns"
              :loading="state.loading"
              :total="state.pagination.total"
              :take="state.pagination.take"
              v-model:page="state.pagination.page">
              <template #id="{ row }">
                <p class="tracking-wider">#{{ row.id }}</p>
              </template>
              <template #name="{ row }">
                <p class="tracking-wider">{{ row.name }} {{ row.phone }}</p>
              </template>
              <template #rcvname="{ row }">
                <p class="tracking-wider">
                  {{ row.rcvname }} {{ row.rcvphone }}
                </p>
              </template>
              <template #date_completed="{ row }">
                <p
                  class="flex items-center gap-x-1"
                  :class="{
                    ' text-green-500': state.selectedStatus == 'completed',
                    ' text-orange-500': state.selectedStatus == 'cancelled',
                  }">
                  <el-icon>
                    <SuccessFilled
                      v-show="state.selectedStatus == 'completed'" />
                    <CircleCloseFilled
                      v-show="state.selectedStatus == 'cancelled'" />
                  </el-icon>
                  <span class="text-gray-500">
                    {{ formatStatusDate(row) }}
                  </span>
                </p>
              </template>
              <template #ttlamt="{ row }">
                <p
                  class="text-right"
                  :class="{ 'text-primary-500': Number(row.ttlamt) > 0 }">
                  {{ Number(row.ttlamt).toLocaleString('zh-CN') }}
                </p>
              </template>
              <template #action="{ row }">
                <div
                  v-show="state.selectedStatus == 'null'"
                  class="
                    flex
                    items-center
                    gap-x-1
                    text-xs text-gray-300
                    cursor-default
                  ">
                  <button
                    class="cursor-pointer hover:opacity-70 text-primary-500"
                    @click="
                      actions.handlePreOrderStatus({
                        id: row.id,
                        type: 'completed',
                      })
                    ">
                    完成
                  </button>
                  /
                  <button
                    class="cursor-pointer hover:opacity-70 text-gray-500"
                    @click="
                      actions.handlePreOrderStatus({
                        id: row.id,
                        type: 'cancelled',
                      })
                    ">
                    取消
                  </button>
                  /
                  <button
                    class="cursor-pointer hover:opacity-70 text-gray-500"
                    @click="
                      actions.handlePreOrderManage({
                        visible: true,
                        id: row.id,
                      })
                    ">
                    修改
                  </button>
                  /
                  <button
                    class="cursor-pointer hover:opacity-70 text-gray-500"
                    @click="actions.handlePushDetail(row.id)">
                    詳情
                  </button>
                </div>
                <div
                  v-show="state.selectedStatus != 'null'"
                  class="
                    flex
                    items-center
                    gap-x-1
                    text-xs text-gray-300
                    cursor-default
                  ">
                  <el-popconfirm
                    title="確定要恢復此訂單嗎?"
                    width="200px"
                    @confirm="
                      actions.handlePreOrderStatus({
                        id: row.id,
                        type: state.selectedStatus,
                        action: 'reset_order',
                      })
                    ">
                    <template #reference>
                      <button
                        class="
                          cursor-pointer
                          hover:opacity-70
                          text-primary-500
                        ">
                        恢復
                      </button>
                    </template>
                  </el-popconfirm>
                  /
                  <button
                    class="cursor-pointer hover:opacity-70 text-gray-500"
                    @click="actions.handlePushDetail(row.id)">
                    詳情
                  </button>
                </div>
              </template>
            </BasicTable>

            <!-- grid table -->
            <div
              class="grid grid-cols-3 border-2"
              v-show="state.listType == 'grid'">
              <div class="border-r-2 p-1 relative">
                <div class="h-[60vh] overflow-y-auto" v-loading="state.loading" id="listContainer">
                  <PreOrderCard
                    id="listBox"
                    :show-action="false"
                    @click="actions.handleSelectPreOrder(order)"
                    class="cursor-pointer shadow"
                    v-for="order in state.tableData"
                    :key="order.id"
                    :status="state.selectedStatus"
                    :order="order"
                    :type2name="state.type2name" />

                  <button
                    @click.stop="actions.handleListScrollTop"
                    v-show="!state.loading"
                    class="
                      bg-primary-500 bg-opacity-70
                      z-[8]
                      rounded-full
                      w-[24px]
                      h-[24px]
                      sticky
                      bottom-[3%]
                      left-[3%]
                      shadow-2xl
                    ">
                    <div class="flex justify-center items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="#fff"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24">
                        <path
                          d="M0 16.67l2.829 2.83 9.175-9.339 9.167 9.339 2.829-2.83-11.996-12.17z" />
                      </svg>
                    </div>
                  </button>
                </div>
              </div>
              <div class="col-span-2 border">
                <div
                  class="
                    flex
                    h-[60vh]
                    justify-center
                    items-center
                    text-gray-500
                    tracking-500
                  "
                  v-show="!state.selectedPreOrder?.id">
                  <p>點選左側列單查看詳情</p>
                </div>
                <div
                  class="h-[60vh] w-full overflow-y-auto"
                  id="detailBox"
                  v-show="!!state.selectedPreOrder?.id">
                  <!-- 詳情 -->
                  <DetailCard
                    v-if="!!state.selectedPreOrder?.id"
                    :id="state.selectedPreOrder?.id" />
                </div>
              </div>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>

    <el-drawer
      v-model="state.dialogEditVisible"
      :show-close="false"
      :size="formatDrawerWidth">
      <template #header="{ titleId, titleClass }">
        <h4 :id="titleId" :class="titleClass" class="text-xs">
          修改預收訂單
          <span class="text-primary-500 text-md">
            #{{ state.editProductModel.id }}
          </span>
        </h4>
        <router-link :to="`preOrder/${state.editProductModel.id}`">
          <div
            class="
              flex
              items-center
              text-sm text-gray-500
              gap-x-1
              hover:opacity-70
            ">
            <p class="font-normal tracking-wider">查看詳情</p>
            <el-icon color="#6b7280"><ArrowRightBold /></el-icon>
          </div>
        </router-link>
      </template>
      <PreOrderForm v-model:editData="state.editProductModel" />
      <template #footer>
        <div class="flex justify-end">
          <el-button @click="state.dialogEditVisible = false">取消</el-button>
          <el-button type="primary" @click="actions.handlePreOrderEdit"
            >提交修改</el-button
          >
        </div>
      </template>
    </el-drawer>
  </div>
</template>

<script setup>
import { PreOrderApiHandler } from '@/api/pre_order'
import { ReadJson } from '@/api/read_json'
import { useRouter } from 'vue-router'
import {
  ref,
  reactive,
  onMounted,
  getCurrentInstance,
  computed,
  nextTick,
} from 'vue'
import BasicTable from '@/components/Table/index.vue'
import TitleWithCount from '@/components/Text/TitleWithCount.vue'
import SelectDate from '@/components/Select/SelectDate.vue'
import ScrollToTop from '@/components/Button/ScrollToTop.vue'
import GetPreOrderCard from '@/components/Card/GetPreOrderCard.vue'
import PreOrderCard from '@/components/Card/PreOrderCard.vue'
import SetPreOrderCard from '@/components/Card/SetPreOrderCard.vue'
import CardTwoCol from '@/components/Card/CardTwoCol.vue'
import PreOrderForm from '@/components/Form/PreOrderForm.vue'
import UploadFile from '@/components/Upload/UploadFile.vue'
import CreatePreOrderDialog from '@/components/Dialog/CreatePreOrderDialog.vue'
import RcvInfoCard from '@/components/Card/RcvInfoCard.vue'
import BookingInfoCard from '@/components/Card/BookingInfoCard.vue'
import PayInfoCard from '@/components/Card/PayInfoCard.vue'
import DetailCard from '@/components/Card/DetailCard.vue'

import { uniqWith, isEqual, pickBy, isEmpty, add } from 'lodash-es'
import dayjs from 'dayjs'
const { proxy } = getCurrentInstance()
const router = useRouter()
const refTable = ref(null)
const state = reactive({
  selectedPreOrder: {},
  listType: 'grid',
  loading: false,
  showSetting: true,
  showSettingMobile: false,
  dialogVisible: false,
  dialogEditVisible: false,
  previewData: {},
  previewMbid: '',
  selectedStatus: 'null',
  selectedDate: 7,
  search: '',
  searchOptions: [],
  pagination: {
    show: true,
    total: 0,
    page: 1,
    take: 20,
  },
  statusOptions: [
    {
      label: '處理中',
      value: 'null',
    },
    {
      label: '已取消',
      value: 'cancelled',
    },
    {
      label: '已完成',
      value: 'completed',
    },
  ],
  productOptions: [],
  tableData: [],
  common_pd: [],
  type2name: {},
  titleMap: {
    type: '類型',
    amount: '價格',
    pv: 'PV',
    pds: '商品內容',
  },
  confirmData: {},
  expands: [],
  selectedSubList: [],
  editModel: {
    express_co: 'UPS',
    shipdate: null,
    trackno: null,
  },
  editProductModel: {},
  editModelFiles: [],
  editSubFiles: [],
  columns: [
    { label: '單號', prop: 'id', formatter: true, width: '60' },
    { label: '送單人', prop: 'mbid', width: '120' },
    { label: '訂購人', prop: 'name', formatter: true },
    { label: '收貨人', prop: 'rcvname', formatter: true },
    { label: '入單日期', prop: 'dateadd', width: '120' },
    { label: '收款日期', prop: 'payrcvday', width: '120' },
    {
      label: '處理日期',
      prop: 'date_completed',
      formatter: true,
      width: '200',
    },
    { label: '金額', prop: 'ttlamt', formatter: true, width: '120' },
    { label: '操作', prop: 'action', formatter: true, width: '200' },
  ],
})
const formatStatusDate = computed(() => row => {
  const status = state.selectedStatus
  const DateMap = {
    null: '-',
    completed: row.date_completed,
    cancelled: row.date_cancelled,
  }
  return DateMap[status]
})

const formatPaginationTableData = computed(() => {
  const { page, take } = state.pagination
  if (state.search) {
    const searchData = state.tableData.filter(
      el => el.member_id === state.search
    )
    const formatData = searchData.filter(
      (item, index) => index < page * take && index >= take * (page - 1)
    )
    state.pagination.total = searchData.length
    return formatData
  }

  state.pagination.total = state.tableData.length
  return state.tableData.filter(
    (item, index) => index < page * take && index >= take * (page - 1)
  )
})

const formatTableData = computed(() => {
  if (state.search) {
    const searchData = state.tableData.filter(
      el => el.member_id === state.search
    )
    return searchData
  }
  return state.tableData
})

const formatDrawerWidth = computed(() => {
  const width = window.innerWidth
    ? window.innerWidth
    : document.documentElement.clientWidth
    ? document.documentElement.clientWidth
    : screen.width
  return width < 768 ? '100%' : '500px'
})

onMounted(() => {
  actions.handleGetProducts()
  actions.handlePreOrderList()
})

const actions = {
  /**
   * @description GetPreOrder 取得預收訂單
   * @param {string}  action  listbydate
   * @param {date}  begin    開始日期
   * @param {date}  end    結束日期
   * @param {string}  cond    狀態
   */
  handlePreOrderList: async reset => {
    if (reset) {
      state.selectedStatus = 'null'
      state.pagination.page = 1
    }
    state.loading = true
    const params = {
      action: 'listbydate',
      begin: dayjs().subtract(state.selectedDate, 'day').format('YYYY-MM-DD'),
      end: dayjs().format('YYYY-MM-DD'),
      status: state.selectedStatus == 'null' ? null : state.selectedStatus,
    }
    const { code, data, count = 0, msg } = await PreOrderApiHandler(params)
    if (code === 1) {
      state.tableData = data
      state.pagination.total = Number(count)
      const options = data.map(item => {
        return { member_id: item.member_id, name: item.name }
      })
      state.searchOptions = uniqWith(options, isEqual)
      // state.expands = []
      // if (state.tableData && state.tableData.length > 0) {
      //   state.expands = [data[0].id]
      //   actions.handleGetSubProducts(data[0].id)
      //   actions.handleGetSubFiles(data[0].id)
      // }
    } else {
      proxy.$message({
        type: 'error',
        message: msg,
      })
    }
    setTimeout(() => {
      state.loading = false
    }, 300)
  },

  /**
   * @description GetPreOrder 取得預收訂單
   * @param {string}  action  set_order
   * @param {string}  id    狀態
   * @param {string}  type    狀態
   */
  handlePreOrderStatus: async params => {
    const { id, type, action = 'set_order' } = params
    state.loading = true
    const { code, data, msg } = await PreOrderApiHandler({ id, type, action })
    if (code === 1) {
      actions.handlePreOrderList()
    }
    proxy.$message({
      type: code > 0 ? 'success' : 'error',
      message: msg,
    })
    state.loading = false
  },

  handlePreOrderEdit: async () => {
    const {
      id,
      ordermbid,
      dateadd,
      ttlamt,
      date_cancelled,
      date_completed,
      paydetail,
      payrcvday,
      paystatus,
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
    // const formatPostType = !isEmpty(rmbid_phone) ? 'phone' : 'mbid'
    console.log(posType)
    const params = {
      action: 'edit',
      preorderid: id,
      data: pickBy({
        name: has_name ? format_name : null,
        rcvname: has_rcvname ? format_rcvname : null,
        add: has_add ? format_add : null,
        shipadd: has_shipadd ? format_shipAdd : null,
        rmbid: posType == 'phone' ? (has_rmbid ? format_rmbid : null) : rmbid,
        umbid: posType == 'phone' ? (has_umbid ? format_umbid : null) : umbid,
        smbid: posType == 'phone' ? (has_smbid ? format_smbid : null) : smbid,
        ...rest,
      }),
    }
    if (!!rmbid) {
      proxy.$message({
        type: 'error',
        message: '請選擇線位',
      })
      return
    }
    const { code, data, msg } = await PreOrderApiHandler(params)
    if (code > 0) {
      state.editProductModel = {}
      state.dialogEditVisible = false
      actions.handlePreOrderList()
    }
    proxy.$message({
      type: code > 0 ? 'success' : 'error',
      message: msg,
    })
  },

  handleRest: () => {
    state.search = ''
    state.selectedStatus = ''
    actions.handlePreOrderList()
  },

  handleScrollToTop: () => {
    const anchor = document.querySelector('#pre-order')
    if (!anchor) return
    anchor.scrollIntoView({ behavior: 'smooth' })
  },

  handleTabClick: tab => {
    state.selectedStatus = tab.props.name
    state.selectedPreOrder = null
    actions.handlePreOrderList()
  },
  handleCurrentChange: val => {
    refTable.value.setScrollTop(0)
    state.pagination.page = val
  },
  handleIndex: index => {
    const take = state.pagination.take
    return (state.pagination.page - 1) * take + index + 1
  },
  // expandChange: row => {
  //   if (row.id == state.expands[0]) {
  //     state.expands = []
  //   } else {
  //     state.expands = [row.id]
  //     actions.handleGetSubProducts(row.id, Number(row.ttlamt) > 0)
  //   }
  // },

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
        state.previewMbid = null
        state.previewData = null
        state.dialogVisible = false
        state.confirmData = {}
      }
      actions.handlePreOrderList()
    }
    proxy.$message({
      type: code > 0 ? 'success' : 'error',
      message: msg,
    })
  },

  handleEditSubProduct: async (id, sub_id) => {
    const params = {
      action: 'edit_child',
      preorderid: id,
      child_id: sub_id,
      shipdate: state.editModel.shipdate,
      express: [state.editModel.express_co, state.editModel.trackno],
    }
    const { code, data, msg } = await PreOrderApiHandler(params)
    if (code === 1) {
      state.editModel = {
        express_co: 'UPS',
        shipdate: null,
        trackno: null,
      }
      actions.handlePreOrderList()
    }
    proxy.$message({
      type: code > 0 ? 'success' : 'error',
      message: msg,
    })
  },

  handleDeleteSubProduct: async (id, sub_id) => {
    const params = {
      action: 'del_child',
      preorderid: id,
      child_id: sub_id,
    }
    const { code, data, msg } = await PreOrderApiHandler(params)
    if (code === 1) {
      actions.handlePreOrderList()
    }
    proxy.$message({
      type: code > 0 ? 'success' : 'error',
      message: msg,
    })
  },
  handlePreOrderManage: async ({ visible = false, id }) => {
    state.dialogEditVisible = visible
    if (visible) {
      const params = {
        action: 'listbyid',
        id: id,
      }
      const { code, data, msg } = await PreOrderApiHandler(params)
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
        console.log(formatPostType)
        console.log(rmbid)
        state.editProductModel = {
          first_name,
          last_name,
          first_rcvname,
          last_rcvname,
          smbid: formatPostType == 'mbid' ? smbid : null,
          smbid_name:
            formatPostType == 'phone'
              ? smbid_phone
                ? smbid_name
                : null
              : null,
          smbid_phone: formatPostType == 'phone' ? smbid_phone : null,
          umbid: formatPostType == 'mbid' ? umbid : null,
          umbid_name:
            formatPostType == 'phone'
              ? umbid_phone
                ? umbid_name
                : null
              : null,
          umbid_phone: formatPostType == 'phone' ? umbid_phone : null,
          rmbid: formatPostType == 'mbid' ? rmbid : null,
          rmbid_name:
            formatPostType == 'phone'
              ? rmbid_phone
                ? rmbid_name
                : null
              : null,
          rmbid_phone: formatPostType == 'phone' ? rmbid_phone : null,
          posType: formatPostType,
          ...rest,
        }
      } else {
        proxy.$message({
          type: 'error',
          message: msg,
        })
      }
    }
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
  handleGetSubFiles: async id => {
    const params = {
      action: 'list_up_files',
      preorderid: id,
    }
    const { code, data } = await PreOrderApiHandler(params)
    if (code === 1) {
      const files = data.files
      state.editSubFiles = files.map(file => {
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
      console.log(state.editSubFiles)
    }
  },
  handlePushDetail: id => {
    router.push({ path: `/preOrder/${id}` })
  },
  /**
   * @description 上傳圖片
   */
  handleSubFileUpdate: list => {
    state.editSubFiles = list
  },
  /**
   * @description 列表 selected
   */
  handleSelectPreOrder: product => {
    state.selectedPreOrder = product
    actions.handleDetailScrollTop()
  },

  /**
   * @description 列表 scroll
   */
  handleListScrollTop: () => {
    nextTick(() => {
      const listContainer = document.getElementById('listContainer')
      const listBox = document.getElementById('listBox')
      if (!listBox) return
      listContainer.scrollIntoView(true)
      listBox.scrollIntoView(true)
    })
  },
  /**
   * @description 詳情 scroll
   */
  handleDetailScrollTop: () => {
    nextTick(() => {
      const detail = document.getElementById('detailBox')
      if (!detail) return
      const detailPage = document.getElementById('pre-order-detail')
      detail.scrollIntoView(true)
      detailPage.scrollIntoView(true)
    })
  },
}
</script>
