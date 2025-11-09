import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import {
  User,
  Users,
  GraduationCap,
  School,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const roles = [
  { nombre: "Docente", icon: <User size={70} /> },
  { nombre: "Padre", icon: <Users size={70} /> },
  { nombre: "Estudiante", icon: <GraduationCap size={70} /> },
  { nombre: "Directivo", icon: <School size={70} /> },
];

export default function RoleSlider({ selected, setSelected }) {
  const [index, setIndex] = useState(
    roles.findIndex((r) => r.nombre === selected) || 0
  );
  const [direction, setDirection] = useState(1);

  const next = () => {
    setDirection(1);
    setIndex((i) => (i + 1) % roles.length);
  };

  const prev = () => {
    setDirection(-1);
    setIndex((i) => (i - 1 + roles.length) % roles.length);
  };

  const currentRole = roles[index];

  // Sincronizar rol seleccionado
  useEffect(() => {
    setSelected(currentRole.nombre);
  }, [currentRole.nombre, setSelected]);

  return (
    <div className="flex flex-col items-center gap-6 w-full">
      <h2 className="text-2xl font-semibold text-primary mb-2">
        Seleccioná tu rol
      </h2>

      <div
        className="relative flex items-center justify-center w-64 h-64 rounded-3xl 
        bg-white/10 backdrop-blur-md shadow-[0_0_25px_rgba(59,130,246,0.25)]
        border border-white/20"
      >
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={currentRole.nombre}
            custom={direction}
            initial={{ opacity: 0, scale: 0.9, x: direction * 120 }}
            animate={{
              opacity: 1,
              scale: 1,
              x: 0,
              transition: { duration: 0.35, ease: "easeOut" },
            }}
            exit={{
              opacity: 0,
              scale: 0.9,
              x: direction * -120,
              transition: { duration: 0.35, ease: "easeIn" },
            }}
            className="absolute flex flex-col items-center justify-center gap-4"
          >
            {/* Círculo con ícono */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              animate={{
                scale: [1, 1.03, 1],
                boxShadow: [
                  "0 0 0px #fff",
                  "0 0 15px #3b82f6",
                  "0 0 0px #fff",
                ],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="flex items-center justify-center w-28 h-28 rounded-full bg-primary text-white shadow-md"
            >
              {currentRole.icon}
            </motion.div>

            <p className="text-base-content font-bold tracking-wide select-none">
              {currentRole.nombre}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex gap-8 items-center">
        <button
          onClick={prev}
          className="btn btn-outline btn-circle hover:btn-primary transition-all duration-300"
        >
          <ChevronLeft size={24} />
        </button>

        <button
          onClick={next}
          className="btn btn-outline btn-circle hover:btn-primary transition-all duration-300"
        >
          <ChevronRight size={24} />
        </button>
      </div>
    </div>
  );
}
