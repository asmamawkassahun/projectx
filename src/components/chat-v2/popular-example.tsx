import { motion } from "framer-motion";

export const PopularExample = () => (
  <motion.div
    exit={{ opacity: 0, y: -50 }}
    transition={{ duration: 0.2, ease: "easeInOut" }}
    className="font-bold text-white"
  >
    <motion.p
      className="text-white/40 text-[15px]"
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: "easeInOut" }}
    >
      Popular
    </motion.p>
    <motion.h2
      className="text-[32px] leading-[110%]"
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: "easeInOut", delay: 0.1 }}
    >
      {" "}
      How often do you wear
      <br /> sunglasses while
      <br /> <span className="text-[#7A7A7A]">outside during daylight?</span>
    </motion.h2>
  </motion.div>
);
