<script setup lang="ts">
import { type HTMLAttributes, computed } from 'vue'
import type { SliderRootEmits, SliderRootProps } from 'radix-vue'
import { SliderRange, SliderRoot, SliderThumb, SliderTrack, useForwardProps } from 'radix-vue'
import { cn } from '@/lib/utils'

type CustomSliderRootProps = Omit<SliderRootProps, 'defaultValue' | 'modelValue'> & {
  defaultValue?: number,
  modelValue?: number
}
type CustomSliderRootEmits = {
  'update:modelValue': [payload: number | undefined];
  'valueCommit': [payload: number];
};

const props = defineProps<CustomSliderRootProps & { class?: HTMLAttributes['class'] }>()
const emits = defineEmits<CustomSliderRootEmits>()

const delegatedProps = computed(() => {
  const { class: _, defaultValue: __, modelValue: ___, ...delegated } = props
  return delegated
})

const forwarded = useForwardProps(delegatedProps);
const computedDefaultValue = computed(() => props.defaultValue ? [props.defaultValue] : undefined);
const computedModelValue = computed(() => props.modelValue ? [props.modelValue] : undefined);
</script>

<template>
  <SliderRoot
    :class="cn(
      'relative flex w-full touch-none select-none items-center',
      props.class,
    )"
    :default-value="computedDefaultValue"
    :model-value="computedModelValue"
    v-bind="forwarded"

    @value-commit="v => emits('valueCommit', v[0])"
    @update:model-value="v => emits('update:modelValue', v?.[0])"
  >
    <SliderTrack class="relative h-1.5 w-full grow overflow-hidden rounded-full bg-primary/20">
      <SliderRange class="absolute h-full bg-primary" />
    </SliderTrack>
    <SliderThumb class="block h-4 w-4 rounded-full border border-primary/50 bg-background shadow transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50" />
  </SliderRoot>
</template>
