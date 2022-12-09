<template>
  <div
    class="bg-white tracking-wider text-gray-500 text-xs rounded-md border-2"
    disabled>
    <header
      class="
        bg-gray-50
        text-gray-700
        py-2
        px-4
        text-center
        shadow
        tracking-widest
        flex
        items-center
        cursor-pointer
      "
      @click="state.isCollapse = !state.isCollapse">
      <h3 class="flex-1">查詢預收訂單</h3>
      <el-icon>
        <ArrowUp v-show="state.isCollapse" />
        <ArrowDown v-show="!state.isCollapse" />
      </el-icon>
    </header>
    <div v-show="state.isCollapse">
      <el-form
        class="form p-2 mt-2"
        :model="state.model"
        :rules="state.rules"
        size="small"
        label-position="top"
        hide-required-asterisk
        scroll-to-error
        ref="refForm">
        <el-form-item label="預收單號" prop="id">
          <el-input
            class="text"
            v-model="state.model.id"
            prefix-icon="User"
            clearable
            placeholder="請輸入預收單號" />
        </el-form-item>
        <el-button
          :loading="state.loading"
          size="small"
          type="primary"
          class="w-full"
          plain
          auto-insert-space
          @click="actions.handleSubmit">
          {{ btnText }}
        </el-button>
      </el-form>
    </div>
    <el-dialog v-model="state.dialogVisible" title="查詢預收訂單" center>
      <el-descriptions :column="2" size="small" border>
        <el-descriptions-item
          v-for="(item, i) in Object.entries(state.data)"
          :key="i">
          <template #label>
            <div class="cell-item">
              {{ item[0] }}
            </div>
          </template>
          {{ item[1] }}
        </el-descriptions-item>
      </el-descriptions>
      <!-- <CardTwoCol
        v-for="(item, i) in Object.entries(state.data)"
        :key="i"
        class="py-1 text-xs border-b"
        :item="{
          label: `${item[0]}`,
          value: `${item[1]}`,
        }" /> -->
      <template #footer>
        <el-button class="w-full" @click="state.dialogVisible = false"
          >關閉</el-button
        >
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed, getCurrentInstance } from 'vue'
import SubTitle from '@/components/Title/SubTitle.vue'
import { PreOrderApiHandler } from '@/api/pre_order'
import { ArrowDown } from '@element-plus/icons-vue'
import CardTwoCol from '@/components/Card/CardTwoCol.vue'

const { proxy } = getCurrentInstance()
const refForm = ref(null)
const emit = defineEmits(['on-refresh'])
const state = reactive({
  loading: false,
  isCollapse: true,
  dialogVisible: false,
  data: {},
  model: {
    action: 'listbyid',
    id: '',
  },
  rules: {
    id: [{ required: true, message: '', trigger: 'blur' }],
  },
})
const btnText = computed(() => (state.loading ? '查詢中...' : '查詢'))

const actions = {
  /**
   * @description 查詢預收訂單
   * @param {string}  action  listbyid
   * @param {number}  id    預收單號
   */
  handleSubmit: () => {
    refForm.value.validate(async valid => {
      if (valid) {
        state.loading = true
        const { code, data, msg } = await PreOrderApiHandler(state.model)
        if (code > 0) {
          state.data = data
          state.dialogVisible = true
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