<script setup lang="ts">
import type { VariantProps } from 'class-variance-authority'
import { Primitive } from 'radix-vue'
import { buttonVariants } from '.'
import { cn } from '@/lib/utils'

interface ButtonVariantProps extends VariantProps<typeof buttonVariants> {}

interface Props {
  variant?: ButtonVariantProps['variant']
  size?: ButtonVariantProps['size']
  asChild?: boolean
  as?: string
}

withDefaults(defineProps<Props>(), {
  variant: 'default',
  size: 'default',
  as: 'button',
})
</script>

<template>
  <Primitive
    :as="as"
    :as-child="asChild"
    :class="cn(buttonVariants({ variant, size }), $attrs.class ?? '')"
  >
    <slot />
  </Primitive>
</template>
