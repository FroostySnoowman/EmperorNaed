import { BOOT_AVATAR, BOOT_MONOGRAM } from '../../content/bootBrand'
import { BrandMark } from './BrandMark'

export function BootScreen() {
  return (
    <div className="fixed inset-0 grid place-items-center bg-ink-950">
      <div className="flex flex-col items-center gap-5">
        <BrandMark avatar={BOOT_AVATAR} monogram={BOOT_MONOGRAM} alt="Emperor Naed" className="h-12 w-12" />
        <p className="text-sm text-white/40">Loading</p>
      </div>
    </div>
  )
}
