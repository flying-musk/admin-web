<template>
  <div id="pre-order" class="specialSetting h-full reactive">
    <el-row :gutter="8" class="h-full">
      <el-col :span="24" class="table-animation">
        <div class="md:hidden pb-8 w-full space-y-3">
          <!-- 新增預收訂單 -->
          <SetPreOrderCard @on-refresh="actions.handlePreOrderList(true)" />
        </div>
        <!-- 預收訂單 -->
        <div
          class="flex flex-col gap-y-3 md:bg-white md:h-full md:p-3 rounded-md">
          <header class="flex items-center justify-between">
            <div class="flex items-center gap-x-1">
              <SubTitle title="預收訂單" class="min-w-fit" />
              <h3 class="text-gray-700 font-light text-sm tracking-widest">
                <span class="text-gray-300">｜</span>
                共
                <span class="text-primary-500 font-medium">{{
                  state.pagination.total
                }}</span>
                筆
              </h3>
              <el-select
                v-model="state.selectedDate"
                value-key="value"
                placeholder="天數"
                size="small"
                class="max-w-[130px] select-date px-3"
                @change="actions.handlePreOrderList">
                <template #prefix>最近</template>
                <el-option
                  v-for="i in 31"
                  :key="i"
                  :label="`${i} 天`"
                  :value="i" />
              </el-select>
            </div>

            <div class="hidden md:block">
              <router-link to="preOrder/create">
                <el-button type="primary"> 新增預收訂單 </el-button>
              </router-link>
            </div>
          </header>

          <!-- 預收訂單 filter -->
          <div class="flex flex-col md:flex-row md:justify-between gap-y-3">
            <div class="flex flex-col md:flex-row gap-3 items-center">
              <el-select
                v-if="false"
                v-model="state.search"
                value-key="value"
                placeholder="會員編號"
                clearable
                filterable
                class="w-full md:w-fit">
                <el-option
                  v-for="item in state.searchOptions"
                  :key="item.member_id"
                  :label="item.member_id"
                  :value="item.member_id">
                  <div class="flex justify-between">
                    <span>{{ item.member_id }}</span>
                    <span>{{ item.name }}</span>
                  </div>
                </el-option>
              </el-select>
            </div>
          </div>
          <el-tabs
            v-model="state.selectedStatus"
            @tab-click="actions.handleTabClick">
            <el-tab-pane
              v-for="status in state.statusOptions"
              :key="status.label"
              :label="status.label"
              :name="status.value">
              <!-- table  -->
              <el-table
                :data="formatPaginationTableData"
                v-loading="state.loading"
                stripe
                ref="refTable"
                size="small"
                row-key="id"
                :expand-row-keys="state.expands"
                @expand-change="actions.expandChange">
                <el-table-column
                  type="index"
                  align="center"
                  width="35"
                  fixed="left"
                  :index="actions.handleIndex" />
                <el-table-column type="expand">
                  <template #default="props">
                    <el-tabs tab-position="left" class="sub-tabs">
                      <el-tab-pane label="訂單產品">
                        <div
                          class="pt-2 pb-4"
                          v-show="state.selectedStatus == 'null'">
                          <el-table
                            size="small"
                            stripe
                            :data="state.productOptions">
                            <el-table-column label="購買類型" fixed="left">
                              <el-table-column
                                label="類型"
                                prop="name"
                                width="120">
                                <template #default="{ row }">
                                  <div
                                    class="flex items-center justify-between">
                                    <p class="text-primary-500">
                                      {{ row.name }}
                                    </p>
                                    <el-icon
                                      v-show="row.isSelected"
                                      color="#5971f7"
                                      size="large"
                                      ><SuccessFilled
                                    /></el-icon>
                                  </div>
                                </template>
                              </el-table-column>
                              <el-table-column
                                label="價格"
                                prop="amount"
                                width="60"
                                align="right">
                                <template #default="{ row }">
                                  <p>
                                    {{ Number(row.amount).toLocaleString() }}
                                  </p>
                                </template>
                              </el-table-column>
                              <el-table-column
                                label="套裝名稱"
                                prop="packagesel"
                                width="100" />
                            </el-table-column>
                            <el-table-column label="送貨資訊">
                              <el-table-column
                                label="出貨日期"
                                prop="shipdate"
                                width="100" />
                              <el-table-column
                                label="快遞公司"
                                prop="express_co"
                                width="100" />
                              <el-table-column
                                label="快遞單號"
                                prop="trackno"
                                width="200" />
                            </el-table-column>
                            <el-table-column label="套裝組合" v-if="false">
                              <el-table-column label="套裝內容">
                                <el-table-column
                                  v-for="packageItem in Object.keys(
                                    state.productOptions[0].packages
                                  )"
                                  :key="packageItem"
                                  :label="packageItem"
                                  :prop="packageItem"
                                  align="right"
                                  width="70">
                                </el-table-column>
                              </el-table-column>
                              <el-table-column label="共同內容">
                                <el-table-column
                                  v-for="(common_pd, i) in state.common_pd"
                                  :key="i"
                                  align="right"
                                  width="70"
                                  :label="common_pd"
                                  :prop="common_pd" />
                              </el-table-column>
                            </el-table-column>
                            <el-table-column
                              label="操作"
                              align="center"
                              width="100"
                              fixed="right">
                              <template #default="{ row }">
                                <button
                                  v-show="!row.isSelected"
                                  class="
                                    cursor-pointer
                                    hover:opacity-70
                                    text-primary-500
                                  "
                                  @click="
                                    actions.handleAddSubProduct(
                                      props.row.id,
                                      props.row.mbid,
                                      row
                                    )
                                  ">
                                  加入訂單
                                </button>

                                <div v-show="row.isSelected">
                                  <el-popover
                                    placement="right"
                                    width="300"
                                    trigger="click">
                                    <template #reference>
                                      <button
                                        class="
                                          cursor-pointer
                                          hover:opacity-70
                                          text-gray-500
                                        "
                                        @click="
                                          state.editModel = {
                                            trackno: row.trackno,
                                            express_co: row.express_co || 'UPS',
                                            shipdate: row.shipdate,
                                          }
                                        ">
                                        修改
                                      </button>
                                    </template>
                                    <el-divider content-position="center">
                                      <p>修改物流資料</p>
                                    </el-divider>
                                    <el-form
                                      class="form"
                                      label-position="top"
                                      :model="state.editModel">
                                      <el-form-item
                                        label="出貨日期"
                                        prop="shipdate">
                                        <el-date-picker
                                          v-model="state.editModel.shipdate"
                                          type="date"
                                          :teleported="false"
                                          :clearable="
                                            !!state.editModel.shipdate
                                              ? false
                                              : true
                                          "
                                          placeholder="請選擇出貨日期"
                                          value-format="YYYY-MM-DD"
                                          style="width: 100%" />
                                      </el-form-item>
                                      <el-form-item
                                        label="快遞公司"
                                        prop="express_co">
                                        <el-radio-group
                                          v-model="state.editModel.express_co"
                                          size="small">
                                          <el-radio label="UPS">UPS</el-radio>
                                          <el-radio label="FEDEX"
                                            >FEDEX</el-radio
                                          >
                                          <el-radio label="POST">POST</el-radio>
                                        </el-radio-group>
                                      </el-form-item>
                                      <el-form-item
                                        label="快遞單號"
                                        prop="trackno">
                                        <el-input
                                          class="text"
                                          v-model="state.editModel.trackno"
                                          clearable
                                          placeholder="請輸入 trackno" />
                                      </el-form-item>
                                      <el-button
                                        type="primary"
                                        class="w-full"
                                        auto-insert-space
                                        @click="
                                          actions.handleEditSubProduct(
                                            props.row.id,
                                            row.sub_id
                                          )
                                        "
                                        >修改</el-button
                                      >
                                    </el-form>
                                  </el-popover>
                                  /
                                  <button
                                    class="
                                      cursor-pointer
                                      hover:opacity-70
                                      text-gray-500
                                    "
                                    @click="
                                      actions.handleDeleteSubProduct(
                                        props.row.id,
                                        row.sub_id
                                      )
                                    ">
                                    取消
                                  </button>
                                </div>
                              </template>
                            </el-table-column>
                          </el-table>
                        </div>
                        <div
                          class="pt-2 pb-4"
                          v-show="state.selectedStatus != 'null'">
                          <el-table
                            size="small"
                            stripe
                            :data="state.selectedSubList">
                            <el-table-column label="購買類型" fixed="left">
                              <el-table-column
                                label="類型"
                                prop="name"
                                width="80">
                                <template #default="{ row }">
                                  <p class="text-primary-500">
                                    {{ state.type2name[row.type] }}
                                  </p>
                                </template>
                              </el-table-column>
                              <el-table-column
                                label="價格"
                                prop="amount"
                                width="80"
                                align="right">
                                <template #default="{ row }">
                                  <p>
                                    {{ Number(row.amount).toLocaleString() }}
                                  </p>
                                </template>
                              </el-table-column>
                              <el-table-column
                                label="PV"
                                prop="pv"
                                width="80"
                                align="right">
                                <template #default="{ row }">
                                  <p>
                                    {{ Number(row.pv).toLocaleString() }}
                                  </p>
                                </template>
                              </el-table-column>
                              <el-table-column
                                label="套裝名稱"
                                prop="package"
                                width="100" />
                            </el-table-column>
                            <el-table-column label="送貨資訊">
                              <el-table-column
                                label="出貨日期"
                                prop="shipdate"
                                width="100" />
                              <el-table-column
                                label="快遞公司"
                                prop="express_co"
                                width="100" />
                              <el-table-column
                                label="快遞單號"
                                prop="trackno"
                                width="200" />
                            </el-table-column>
                          </el-table></div
                      ></el-tab-pane>
                      <el-tab-pane label="訂購資料">
                        <div class="grid grid-cols-2 gap-x-3 font-light py-2">
                          <div>
                            <h3 class="pb-1 border-b text-gray-700">訂購人資料</h3>
                            <CardTwoCol
                              :item="{
                                label: '姓名',
                                value: props.row.name,
                              }" />

                            <CardTwoCol
                              :item="{
                                label: '手機',
                                value: props.row.phone,
                              }" />

                            <CardTwoCol
                              :item="{
                                label: '信箱',
                                value: props.row.email,
                              }" />
                            <CardTwoCol
                              :item="{
                                label: '生日',
                                value: props.row.birth,
                              }" />
                            <CardTwoCol
                              :item="{
                                label: '地址',
                                value: `${props.row.add1}${props.row.add2}`,
                              }" />
                          </div>
                          <div>
                            <h3 class="pb-1 border-b text-gray-700">收貨人資料</h3>
                            <CardTwoCol
                              :item="{
                                label: '姓名',
                                value: props.row.rcvname,
                              }" />

                            <CardTwoCol
                              :item="{
                                label: '手機',
                                value: props.row.rcvphone,
                              }" />

                            <CardTwoCol
                              :item="{
                                label: '信箱',
                                value: props.row.rcvemail,
                              }" />
                            <CardTwoCol
                              :item="{
                                label: '地址',
                                value: `${props.row.shipadd1}${props.row.shipadd2}`,
                              }" />
                          </div>
                          <div></div>
                        </div>
                      </el-tab-pane>
                      <el-tab-pane label="付款資料">
                        <div class="grid grid-cols-2 font-light py-2">
                          <CardTwoCol
                            :item="{
                              label: '付款狀態',
                              value: props.row.paystatus,
                            }" />

                          <CardTwoCol
                            :item="{
                              label: '付款日期',
                              value: props.row.payrcvday,
                            }" />

                          <CardTwoCol
                            :item="{
                              label: '付款詳情',
                              value: props.row.paydetail,
                            }" />
                          <CardTwoCol
                            :item="{
                              label: '備註',
                              value: props.row.remark,
                            }" />
                        </div>
                      </el-tab-pane>
                      <el-tab-pane label="點位資料">
                        <div class="grid grid-cols-2 font-light py-2">
                          <CardTwoCol
                            :item="{
                              label: '訂購人編號',
                              value: props.row.order_mbid,
                            }" />
                          <CardTwoCol
                            :item="{
                              label: '推薦人編號',
                              value: props.row.rmbid,
                            }" />
                          <CardTwoCol
                            :item="{
                              label: '安置人編號',
                              value: props.row.umbid,
                            }" />
                          <CardTwoCol
                            :item="{
                              label: '培訓人編號',
                              value: props.row.smbid,
                            }" />
                          <CardTwoCol
                            :item="{
                              label: '線位',
                              value: ' ',
                            }">
                            <el-tag
                              :type="props.row.leg == 1 ? 'danger' : 'success'"
                              effect="plain"
                              round
                              size="small"
                              v-show="!!props.row.leg">
                              <p class="tracking-widest">
                                {{ props.row.leg == 1 ? '左線' : '右線' }}
                              </p>
                            </el-tag>
                          </CardTwoCol>
                        </div>
                      </el-tab-pane>
                      <el-tab-pane label="附件">
                        <div class="py-2">
                          <UploadFile
                            v-model:list="state.editSubFiles"
                            title="附件"
                            :id="props.row.id"
                            @on-change="actions.handleSubFileUpdate" />
                        </div>
                      </el-tab-pane>
                    </el-tabs>
                    <div
                      v-if="false"
                      class="
                        flex flex-col
                        gap-y-2
                        w-full
                        justify-between
                        rounded
                        bg-[#f3f7fe]
                        p-2
                      ">
                      <div class="flex gap-x-3"></div>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column prop="mbid" label="送單人會員編號">
                  <template #default="{ row }">
                    <p
                      class="text-primary-500 cursor-pointer"
                      @click="actions.handlePushDetail(row.id)">
                      {{ row.mbid }}
                    </p>
                  </template>
                </el-table-column>
                <el-table-column label="訂購人資料">
                  <el-table-column prop="name" label="姓名" />
                  <el-table-column prop="phone" label="電話" />
                </el-table-column>
                <el-table-column label="收貨人資料">
                  <el-table-column prop="rcvname" label="姓名" />
                  <el-table-column prop="rcvphone" label="電話" />
                </el-table-column>
                <el-table-column label="處理日期">
                  <el-table-column
                    prop="dateadd"
                    label="入單日期"
                    width="100" />
                  <el-table-column
                    v-if="state.selectedStatus == 'cancelled'"
                    prop="date_cancelled"
                    label="取消日期"
                    width="130" />
                  <el-table-column
                    v-if="state.selectedStatus == 'completed'"
                    prop="date_completed"
                    label="完成日期"
                    width="130" />
                </el-table-column>
                <el-table-column
                  prop="ttlamt"
                  label="金額"
                  align="right"
                  width="80">
                  <template #default="{ row }">
                    <p :class="{ 'text-green-500': Number(row.ttlamt > 0) }">
                      {{ Number(row.ttlamt).toLocaleString() }}
                    </p>
                  </template>
                </el-table-column>
                <el-table-column
                  label="操作"
                  align="center"
                  fixed="right"
                  :width="state.selectedStatus == 'null' ? '120' : '80'">
                  <template #default="{ row }">
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
                          actions.handlePreOrderStatus(row.id, 'completed')
                        ">
                        完成
                      </button>
                      /
                      <button
                        class="cursor-pointer hover:opacity-70 text-gray-500"
                        @click="
                          actions.handlePreOrderStatus(row.id, 'cancelled')
                        ">
                        取消
                      </button>
                      /
                      <button
                        class="cursor-pointer hover:opacity-70 text-gray-500"
                        @click="actions.handlePreOrderManage(true, row.id)">
                        修改
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
                          actions.handlePreOrderStatus(
                            row.id,
                            state.selectedStatus,
                            'reset_order'
                          )
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
                        查看
                      </button>
                    </div>
                  </template>
                </el-table-column>
              </el-table>
              <section
                class="flex justify-end pt-3"
                v-if="state.pagination.total > 0">
                <el-pagination
                  v-model:current-page="state.pagination.page"
                  background
                  small
                  @current-change="actions.handleCurrentChange"
                  layout="prev, pager, next"
                  :page-size="state.pagination.take"
                  :total="state.pagination.total" />
              </section>
            </el-tab-pane>
          </el-tabs>
        </div>
      </el-col>
    </el-row>
    <ScrollToTop @click.prevent="actions.handleScrollToTop" />

    <el-drawer
      v-model="state.dialogEditVisible"
      :show-close="false"
      :size="formatDrawerWidth">
      <template #header="{ titleId, titleClass }">
        <h4 :id="titleId" :class="titleClass" class="text-sm">
          #{{ state.editProductModel.id }} 修改預收訂單
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
    <el-dialog
      v-model="state.dialogVisible"
      :title="`修改 #${state.previewMbid} 子訂單內容`"
      center
      class="adjustDialog max-w-[500px]">
      <el-descriptions :column="1" size="small" border v-if="state.previewData">
        <el-descriptions-item
          width="150px"
          v-for="(item, i) in Object.entries(state.previewData)"
          :label="state.titleMap[item[0]]"
          :key="i">
          <div v-if="item[0] == 'pds'">
            <div
              v-for="(pdItem, pdIndex) in Object.entries(state.previewData.pds)"
              :key="pdIndex"
              class="flex justify-between"
              :class="{ 'bg-gray-50': pdIndex % 2 != 0 }">
              <small class="min-w-fit text-center">
                {{ pdItem[0] }}
              </small>
              <small>
                {{ pdItem[1] }}
              </small>
            </div>
          </div>
          <div v-else class="text-right">
            <p v-if="item[0] == 'type'">
              {{ state.type2name[item[1]] }}
            </p>
            <p v-else>
              {{ Number(item[1]).toLocaleString() }}
            </p>
          </div>
        </el-descriptions-item>
      </el-descriptions>
      <template #footer>
        <el-button
          bg
          text
          @click="state.dialogVisible = false"
          auto-insert-space
          >取消</el-button
        >
        <el-button
          type="primary"
          auto-insert-space
          @click="
            actions.handleAddSubProduct(
              state.confirmData.id,
              state.confirmData.mbid,
              state.confirmData.product,
              state.confirmData.iscfm
            )
          "
          >加入訂單</el-button
        >
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { PreOrderApiHandler } from '@/api/pre_order'
import { ReadJson } from '@/api/read_json'
import { useRouter } from 'vue-router'
import { ref, reactive, onMounted, getCurrentInstance, computed } from 'vue'
import BasicTable from '@/components/Table/index.vue'
import SubTitle from '@/components/Title/SubTitle.vue'
import ScrollToTop from '@/components/Button/ScrollToTop.vue'
import GetPreOrderCard from '@/components/Card/GetPreOrderCard.vue'
import SetPreOrderCard from '@/components/Card/SetPreOrderCard.vue'
import CardTwoCol from '@/components/Card/CardTwoCol.vue'
import PreOrderForm from '@/components/Form/PreOrderForm.vue'
import UploadFile from '@/components/Upload/UploadFile.vue'

import { uniqWith, isEqual, pickBy, isEmpty, add } from 'lodash-es'
import dayjs from 'dayjs'
const { proxy } = getCurrentInstance()
const router = useRouter()
const refTable = ref(null)
const state = reactive({
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
      state.expands = []
      if (state.tableData && state.tableData.length > 0) {
        state.expands = [data[0].id]
        actions.handleGetSubProducts(data[0].id)
        actions.handleGetSubFiles(data[0].id)
      }
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
  handlePreOrderStatus: async (id, type, action = 'set_order') => {
    state.loading = true
    const params = {
      action: action,
      type: type,
      id: id,
    }
    const { code, data, msg } = await PreOrderApiHandler(params)
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
      order_mbid,
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
      data: {
        name: has_name ? format_name : null,
        rcvname: has_rcvname ? format_rcvname : null,
        add: has_add ? format_add : null,
        shipadd: has_shipadd ? format_shipAdd : null,
        rmbid: posType == 'phone' ? (has_rmbid ? format_rmbid : null) : rmbid,
        umbid: posType == 'phone' ? (has_umbid ? format_umbid : null) : umbid,
        smbid: posType == 'phone' ? (has_smbid ? format_smbid : null) : smbid,
        ...rest,
      },
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
  expandChange: row => {
    if (row.id == state.expands[0]) {
      state.expands = []
    } else {
      state.expands = [row.id]
      actions.handleGetSubProducts(row.id, Number(row.ttlamt) > 0)
    }
  },

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
  handlePreOrderManage: async (visible, id) => {
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
}
</script>

<style lang="scss" scoped>
.select-option :deep(.el-input__inner) {
  color: $mainColor;
}
.table-animation {
  transition: all 0.5s ease-in;
  transition-delay: 0.5s;
}
// slide-fade
.slide-fade-enter-active {
  animation: slide-in 0.5s ease-in forwards;
  -webkit-animation: slide-in 0.5s ease-in forwards;
}

.slide-fade-leave-active {
  animation: slide-out 1s ease-out forwards;
  opacity: 0;
  transition: opacity 1s;
  -webkit-animation: slide-out 1s ease-out forwards;
}

@keyframes slide-in {
  from {
    transition: opacity 1.5s;
    transform: translateX(30px);
    -webkit-transform: translateX(30px);
    -moz-transform: translateX(30px);
    -ms-transform: translateX(30px);
    -o-transform: translateX(30px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    -webkit-transform: translateX(0);
    -moz-transform: translateX(0);
    -ms-transform: translateX(0);
    -o-transform: translateX(0);
    opacity: 1;
  }
}

@keyframes slide-out {
  from {
    transform: translateX(0);
    -webkit-transform: translateX(0);
    -moz-transform: translateX(0);
    -ms-transform: translateX(0);
    -o-transform: translateX(0);
  }
  to {
    transform: translateX(30px);
    -webkit-transform: translateX(30px);
    -moz-transform: translateX(30px);
    -ms-transform: translateX(30px);
    -o-transform: translateX(30px);
  }
}
.sub-tabs :deep(.el-tabs__item) {
  font-size: var(--el-font-size-extra-small) !important;
  height: 36px;
}
</style>