<template>
  <div>
    <div
      v-for="subAgent in changeRoleInfoList"
      :key="subAgent.mbid"
      @click="mbid = subAgent.mbid"
      class="
        p-3
        border
        last:border-b-0
        hover:bg-gray-50
        min-w-fit
        shadow-md
        rounded-md
        cursor-pointer
      ">
      <div class="flex justify-between items-center">
        <div class="flex items-center gap-x-3 w-full lg:min-w-[240px]">
          <div
            class="
              w-8
              h-8
              flex
              bg-primary-50
              rounded-full
              justify-center
              items-center
              text-white text-center
              lg:text-lg
            ">
            <p>
              {{ subAgent.mbname.substring(0, 1) }}
            </p>
          </div>
          <div class="flex flex-col">
            <p class="text-md">
              {{ subAgent.mbname }}
            </p>
            <p class="text-gray-500">
              {{ subAgent.agname }} <span class="text-gray-300">｜</span>
              {{ subAgent.agid }}
            </p>
          </div>
        </div>
        <RadioItem :selected="subAgent.mbid == mbid" />
      </div>
    </div>
  </div>
</template>

<script setup>
import RadioItem from '@/components/Radio/RadioItem.vue'
import { reactive, computed } from 'vue'
import { useStore } from 'vuex'
const store = useStore()
const props = defineProps({
  mbid: {
    type: [String, Number],
    default: '',
  },
})
const changeRoleInfoList = computed(
  () => store.state.changeRoleInfo.changeRoleInfoList
)
</script>