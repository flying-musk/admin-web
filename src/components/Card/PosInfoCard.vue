<template>
          <div class="space-y-1 py-2 border-t border-b bg-white">
            <SubTitle title="點位資料" />
            <div
              class="grid md:grid-cols-2 lg:grid-cols-3 text-xs text-gray-500">
              <CardTwoCol
                :item="{
                  label: '送單人編號',
                  value: info.mbid,
                }" />

              <CardTwoCol
                :item="{
                  label: '訂購人編號',
                  value: info.ordermbid,
                }" />
              <CardTwoCol
                :item="{
                  label: '線位',
                  value: ' ',
                }">
                <el-tag
                  :type="info.leg == 1 ? 'danger' : 'success'"
                  effect="plain"
                  round
                  size="small"
                  v-show="!!info.leg">
                  <p class="tracking-widest">
                    {{ info.leg == 1 ? '左線' : '右線' }}
                  </p>
                </el-tag>
              </CardTwoCol>
              <CardTwoCol
                :item="{
                  label: '推薦人編號',
                  value: info.rmbid,
                }" />
              <CardTwoCol
                :item="{
                  label: '安置人編號',
                  value: info.umbid,
                }" />
              <CardTwoCol
                :item="{
                  label: '培訓人編號',
                  value: info.smbid,
                }" />
            </div>
          </div>
</template>
<script setup>
import SubTitle from '@/components/Text/SubTitle.vue'
import CardTwoCol from '@/components/Card/CardTwoCol.vue'
const props = defineProps({
  info: {
    type: Object,
    default: () => {},
  },
})
</script>