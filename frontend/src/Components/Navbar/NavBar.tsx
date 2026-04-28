"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function NavBar() {
  const [aberto, setAberto] = useState(false);

  const toggleMenu = () => setAberto(!aberto);

  const container = {
    hidden: { opacity: 0, x: -10 },
    show: {
      opacity: 1,
      x: 0,
      transition: {
        staggerChildren: 0.1,
      },
    },
    exit: { opacity: 0, x: -10 },
  };

  const item = {
    hidden: { opacity: 0, x: -10 },
    show: { opacity: 1, x: 0 },
  };

  return (
     <nav className="py-3 px-4">
      <ul className="flex gap-6 text-white">
        <li className="relative flex flex-row items-center ">
          <button onClick={toggleMenu} className=" bg-[#A636E9] px-3 py-1 rounded-lg hover:bg-[#430883] transition duration-300">
            Categorias
          </button>

          <AnimatePresence>
            {aberto && (
              <motion.ul
                className="absolute left-30 flex flex-row gap-10"
                variants={container}
                initial="hidden"
                animate="show"
                exit="exit"
              >
                <motion.li variants={item}>
                  <Link href="/hardware" className=" px-3 py-1 rounded-lg hover:bg-[#430883] transition duration-300">Hardware</Link>
                </motion.li>

                <motion.li variants={item}>
                  <Link href="/perifericos" className=" px-3 py-1 rounded-lg hover:bg-[#430883] transition duration-300">Periféricos</Link>
                </motion.li>

                <motion.li variants={item}>
                  <Link href="/jogos" className="px-3 py-1 rounded-lg hover:bg-[#430883] transition duration-300">Jogos</Link>
                </motion.li>
              </motion.ul>
            )}
          </AnimatePresence>

        </li>
      </ul>
    </nav>
  );
}
