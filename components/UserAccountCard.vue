<script lang="ts" setup>
import { LogOut } from 'lucide-vue-next';
const { userAccount, pending, logOut } = useAccount();
</script>

<template>
  <Card v-if="userAccount">
    <CardHeader>
      <CardTitle class="flex flex-row items-center gap-2">
        <div class="flex-grow">Аккаунт: <span class="font-mono">{{ userAccount.username || 'unknown' }}</span></div>
        <TooltipProvider :delay-duration="300" disableClosingTrigger>
          <Tooltip>
            <TooltipTrigger as-child>
              <Button variant="outline" size="icon" :disabled="pending" @click="logOut"><LogOut class="w-4 h-4" /></Button>
            </TooltipTrigger>
            <TooltipContent>Выход</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger as-child>
              <ButtonDialogClearSessions />
            </TooltipTrigger>
            <TooltipContent>Завершить все сессии</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </CardTitle>
    </CardHeader>
  </Card>
</template>

<style lang="scss" scoped></style>
