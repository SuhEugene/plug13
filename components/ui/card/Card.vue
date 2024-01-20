<script setup lang="ts">
import { cn } from '@/lib/utils'

const props = defineProps({
  class: {
    type: String,
    default: 'max-w-sm',
  },
})
</script>

<template>
  <div
    :class="
      cn(
        'rounded-lg border bg-card text-card-foreground shadow',
        props.class,
      )
    "
  >
    <slot />
  </div>
</template>
