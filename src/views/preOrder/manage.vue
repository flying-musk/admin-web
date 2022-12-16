<template>
  <div class="pb-[50px]">
    <PreOrderForm ref="refForm" v-model:editData="state.editProductModel" />
    <footer
      class="
        fixed
        bottom-0
        left-0
        fixed-bottom
        w-full
        border-t
        bg-white
        py-2
        px-4
      ">
      <div class="flex items-center justify-end">
        <el-button @click="router.replace({ path: '/preOrder' })" bg text
          >下次再預訂</el-button
        >
        <el-button
          type="primary"
          v-loading="state.loading"
          @click="actions.handleSubmit">
          <div class="flex items-center gap-x-1">
            <p class="tracking-widest">新增預收訂單</p>
            <el-icon>
              <ArrowRightBold />
            </el-icon>
          </div>
        </el-button>
      </div>
    </footer>
  </div>
</template>
<script setup>
import { PreOrderApiHandler } from '@/api/pre_order'
import { ref, reactive, onMounted, getCurrentInstance, computed } from 'vue'
import PreOrderForm from '@/components/Form/PreOrderForm.vue'
import { useRouter } from 'vue-router'
import { isEmpty } from 'lodash-es'
const { proxy } = getCurrentInstance()
const router = useRouter()
const refForm = ref(null)
const state = reactive({
  loading: false,
  editProductModel: {
    posType: 'mbid',
  },
  memberOptions: [],
})

const actions = {
  /**
   * @description 新增預收訂單
   * @param {string}  action  new
   * @param {number}  mbid    送單人會員編號
   * @param {number}  order_mbid  訂購人會員編號
   */
  handleSubmit: async () => {
    const isValid = await refForm.value?.handleValidForm()
    if (!isValid) return
    const {
      mbid,
      order_mbid,
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
    const params = {
      action: 'new',
      mbid,
      order_mbid,
      data: {
        name: has_name ? format_name : null,
        rcvname: has_rcvname ? format_rcvname : null,
        add: has_add ? format_add : null,
        shipadd: has_shipadd ? format_shipAdd : null,
        rmbid: posType == 'mbid' ? rmbid : format_rmbid,
        umbid: posType == 'mbid' ? umbid : format_umbid,
        smbid: posType == 'mbid' ? smbid : format_smbid,
        ...rest,
      },
    }
    state.loading = true
    const { code, data, msg } = await PreOrderApiHandler(params)
    state.loading = false
    if (code > 0) {
      proxy.$message({
        type: 'success',
        message: msg,
      })
      const pre_order_id = data.pre_order_id
      setTimeout(() => {
        router.replace({ path: `/preOrder/${pre_order_id}` })
      }, 100)
    } else {
      proxy.$message({
        type: 'error',
        message: msg,
      })
    }
  },
}
</script>