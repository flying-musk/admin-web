<template>
  <div class="sm:bg-white shadow">
    <header>
      <StatusBar
        :data="{
          id: state.id,
          status: '處理中',
        }" />
      <PageHeader :data="{ mbid: state.editProductModel.mbid }" />
    </header>

    <main class="flex flex-col md:flex-row gap-2 sm:p-2">
      <div class="space-y-2 w-full sm:w-1/3">
        <OrderMemberCard />
        <PosMemberCard />
        <PaymentCard
            ref="paymentCard"
            :pre-order-id="state.id"
            :format-type="state.type2name"
            :list-child="state.listChild"
            @fetch-cart="actions.handleFetchCart" />
   
                  <!-- 附件 -->
                  <div class="bg-white">
              <SubTitle :title="`附件（${state.editModelFiles?.length}筆）`" />
              <UploadFile
                class="p-2"
                v-model:list="state.editModelFiles"
                title="附件"
                :id="state.editProductModel.id"
                :disabled="state.isDisabled" />
            </div>   </div>
      <div class="flex-grow">
          <SelectedSubProductCard :id="state.id" />
      </div>
    </main>
  </div>
</template>
<script setup>
import StatusBar from '@/components/Header/StatusBar.vue'
import PageHeader from '@/components/Header/PageHeader.vue'
import OrderMemberCard from '@/components/Card/OrderMemberCard.vue'
import PosMemberCard from '@/components/Card/PosMemberCard.vue'
import SelectedSubProductCard from '@/components/Card/SelectedSubProductCard.vue'
import CardTwoCol from '@/components/Card/CardTwoCol.vue'
import SelectedSubProduct from '@/components/Card/SelectedSubProduct.vue'
import PaymentCard from '@/components/Card/PaymentCard.vue'
import UploadFile from '@/components/Upload/UploadFile.vue'

import { PreOrderApiHandler } from '@/api/pre_order'
import { reactive, onMounted, getCurrentInstance } from 'vue'
import { isEmpty } from 'lodash-es'
import { useRoute, useRouter } from 'vue-router'

const { proxy } = getCurrentInstance()
const router = useRouter()
const route = useRoute()
const state = reactive({
  id: route.params.id,
  loading: false,
  editProductModel: {},
})
onMounted(() => {
  if (!state.id) {
    router.go(-1)
  } else {
    actions.handleFetchPreOrder()
  }
})
const actions = {
  /**
   * @description 取得子訂單內容
   */
  handleFetchPreOrder: async (showLoading = true) => {
    const params = {
      action: 'listbyid',
      id: state.id,
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
      // actions.handleGetFiles(id)
    } else {
      proxy.$message({
        type: 'error',
        message: msg,
      })
    }
  },
}
</script>