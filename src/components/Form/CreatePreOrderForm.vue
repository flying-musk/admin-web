<template>
  <div>
    <el-form
      class="form p-2 mt-2"
      :model="state.model"
      :rules="state.rules"
      size="small"
      label-width="70"
      label-position="left"
      hide-required-asterisk
      scroll-to-error
      ref="refForm">
      <p class="p-1 mb-2 border-b text-gray-500 font-light">送單人資料</p>
      <el-form-item class="px-1" label="會員編號" prop="mbid">
        <el-input
          class="text"
          v-model.trim="state.model.mbid"
          prefix-icon="User"
          clearable
          placeholder="請輸入送單人的會員編號" />
      </el-form-item>
      <p class="p-1 mb-2 border-b text-gray-500 font-light">訂購人資料</p>
      <div class="px-1">
        <el-form-item label="會員編號" prop="order_mbid">
          <el-input
            class="text"
            v-model.trim="state.model.order_mbid"
            prefix-icon="User"
            clearable
            placeholder="請輸入訂購人會員編號" />
        </el-form-item>
        <div class="flex justify-end pb-3">
          <div
            class="
              inline-flex
              items-center
              gap-x-1
              cursor-pointer
              text-primary-500
              hover:opacity-70
            "
            @click="state.dialogVisible = true">
            <small> 訂購人非會員 </small>
            <el-icon :size="16"><QuestionFilled /></el-icon>
          </div>
        </div>
      </div>
      <el-button
        :loading="state.loading"
        size="default"
        type="primary"
        class="w-full"
        auto-insert-space
        @click="actions.handleSubmit">
        {{ btnText }}
      </el-button>
    </el-form>

    <el-dialog
      v-model="state.dialogVisible"
      :fullscreen="true"
      center
      class="previewDialog relative -z-20">
      <header class="bg-primary-500 pt-8 pb-4">
        <h2 class="text-xl text-white text-center tracking-widest">新增預收訂單</h2>
      </header>
      <div class="w-full h-32 bg-primary-500  fixed -z-10"></div>
      <div class="lg:max-w-[50%] mx-auto p-3">
        <el-form
          :model="state.model"
          label-width="100"
          label-position="left"
          class="form z-10 bg-white shadow-lg px-2 border py-4 rounded-xl"
          hide-required-asterisk
          scroll-to-error>
          <div class="space-y-3">
            <div
              id="booking_info">
              <div
                class="
                  border-l-4
                  pl-2
                  border-primary-500
                  text-gray-700 text-[14px]
                  tracking-wider
                  font-medium
                ">
                <p>送單人資料</p>
              </div>
              <!-- <SubTitle title="送單人資料" /> -->
              <el-divider style="margin: 12px 0"></el-divider>
              <el-form-item class="px-1" label="會員編號" prop="mbid">
                <el-input
                  class="text"
                  v-model.trim="state.model.mbid"
                  prefix-icon="User"
                  clearable
                  placeholder="請輸入送單人的會員編號" />
              </el-form-item>
            </div>
            <div
              id="order_info">
              <div
                class="
                  py-2
                  mb-4
                  border-b border-gray-200
                  text-gray-700 text-[14px]
                  tracking-wider
                  font-medium
                ">
                <p>訂購人資料 <small class="text-gray-500">(非必填)</small></p>
              </div>
              <el-form-item label="姓名" prop="name">
                <el-input
                  class="text"
                  v-model="state.model.name"
                  clearable
                  placeholder="請輸入訂購人姓名" />
              </el-form-item>

              <el-form-item label="性別" prop="sex">
                <el-radio-group v-model="state.model.sex">
                  <el-radio class="min-w-[100px]" border label="m">男</el-radio>
                  <el-radio class="min-w-[100px]" border label="f">女</el-radio>
                </el-radio-group>
              </el-form-item>

              <el-form-item label="所在國家" prop="ccode">
                <el-radio-group v-model="state.model.ccode">
                  <el-radio
                    class="min-w-[100px]"
                    v-for="(ccode, i) in Object.entries(variables.ccodename)"
                    :key="i"
                    :label="ccode[0]"
                    border
                    >{{ ccode[1] }}</el-radio
                  >
                </el-radio-group>
              </el-form-item>

              <el-form-item class="px-1" label="電話" prop="phone">
                <el-input
                  class="text"
                  v-model.trim="state.model.mbid"
                  prefix-icon="Phone"
                  clearable
                  placeholder="請輸入訂購人的電話" />
              </el-form-item>

              <el-form-item label="證照別" prop="idtype">
                <el-radio-group v-model="state.model.idtype">
                  <el-radio
                    class="min-w-[100px]"
                    v-for="(type, i) in Object.entries(variables.idtype)"
                    :key="i"
                    :label="type[0]"
                    border
                    >{{ type[1] }}</el-radio
                  >
                </el-radio-group>
              </el-form-item>

              <el-form-item label="證號" prop="idnumber">
                <el-input
                  class="text"
                  v-model="state.model.idnumber"
                  clearable
                  :disabled="!state.model.idtype"
                  placeholder="請輸入訂購人證號" />
              </el-form-item>
            </div>
          </div>
        </el-form>
      </div>

      <template #footer>
        <span
          class="
            dialog-footer
            flex
            justify-center
            fixed
            bottom-0
            right-0
            bg-white
            z-10
            w-full
            p-3
            border-t-2
            mt-3
          ">
          <div class="flex lg:w-[50%] justify-end px-3">
            <el-button @click="state.dialogVisible = false" bg text
              >下次再預訂</el-button
            >
            <el-button type="primary" @click="actions.handleSubmit(1)">
              確認預訂
            </el-button>
          </div>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script setup>
import SubTitle from '@/components/Title/SubTitle.vue'
import { PreOrderApiHandler } from '@/api/pre_order'
import { ref, reactive, computed, getCurrentInstance } from 'vue'
import { useVariables } from '@/hooks/useVariables'

const { proxy } = getCurrentInstance()
const { variables } = useVariables()
const refForm = ref(null)
const state = reactive({
  loading: false,
  dialogVisible: false,
  // idtypeOptions: [],
  idtypeOptions: variables.idtype || [],
  // ccodeOptions: variables.ccodename,
  model: {
    action: 'new',
    mbid: '',
    order_mbid: '',
  },
  rules: {
    mbid: [{ required: true, message: '', trigger: 'blur' }],
    // order_mbid: [{ required: true, message: '', trigger: 'blur' }],
  },
})

const btnText = computed(() => (state.loading ? '確認中...' : '確認'))

const actions = {
  /**
   * @description 新增預收訂單
   * @param {string}  action  new
   * @param {number}  mbid    送單人會員編號
   * @param {number}  order_mbid  訂購人會員編號
   */
  handleSubmit: () => {
    refForm.value.validate(async valid => {
      if (valid) {
        state.loading = true
        const { code, data, msg } = await PreOrderApiHandler(state.model)
        if (code > 0) {
          proxy.$message({
            dangerouslyUseHTMLString: true,
            type: 'success',
            message: msg,
          })
          refForm.value.resetFields()
          emit('on-refresh')
        } else {
          proxy.$message({
            type: 'error',
            message: msg,
          })
        }
        setTimeout(() => {
          state.loading = false
        }, 500)
      }
    })
  },
}
</script>

<style lang="scss">
.previewDialog.el-dialog {
  .el-dialog__header {
    display: none;
  }
  .el-dialog__body {
    padding: 12px 16px;
  }
  .dj-dialog-content {
    padding: 0;
    overflow: unset;
  }
}
</style>