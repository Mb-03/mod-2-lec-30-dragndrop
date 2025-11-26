import { swiperImages } from "../index"
import BasicSwiper from "./BasicSwiper"

const SwiperPage = () => {
  return (
    <div className="min-h-screen bg-[#1a1a1e] text-[#9295a6]">
        <BasicSwiper images = {swiperImages} />
    </div>
  )
}

export default SwiperPage