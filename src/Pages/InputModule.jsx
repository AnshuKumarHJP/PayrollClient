import { useState, useEffect } from "react";
import { Link } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "../Lib/card";
import { Button } from "../Lib/button";
import { templateService } from "../../api/services/templateService";
import Loading from '../Component/Loading'

// 🟢 Framer Motion
import { motion } from "framer-motion";
import useCrypto from "../Security/useCrypto";
import AppIcon from "../Component/AppIcon";

const InputModule = () => {
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const { encrypt } = useCrypto();

  // ----------------------------------------------------
  // LOAD MODULES
  // ----------------------------------------------------
  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);

        const activeTemplates = await templateService.getByStatus("active");

        // Map templates to UI model
        const mapped = activeTemplates.map((template) => {
          const encryptedId = encrypt(template.id.toString()); // 🔥 encrypt ID
          return {
            title: template.name,
            description: template.description || `Manage ${template.module} related data.`,
            path: `/inputs/${encryptedId}`, // 🔥 send encrypted ID
            icon: template?.Icon,
          };
        });


        setModules(mapped);

      } catch (err) {
        console.error("Failed to load templates:", err);
        setModules([]);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  if (loading) {
    return <Loading />
  }

  // ----------------------------------------------------
  // FRAMER MOTION VARIANTS
  // ----------------------------------------------------
  const containerAnim = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.12 },
    },
  };

  const cardAnim = {
    hidden: { opacity: 0, y: 15 },
    show: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 120, damping: 14 },
    },
  };

  return (
    <div className="p-6">

      {/* HEADER */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          Payroll Input Module
        </h1>
        <p className="text-gray-600 mt-1">
          Centralized platform for payroll inputs, onboarding data & workflows
        </p>
      </div>

      {/* MODULE CARDS WRAPPER */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6"
        variants={containerAnim}
        initial="hidden"
        animate="show"
      >
        {modules.map((m, index) => (
          <motion.div
            key={index}
            variants={cardAnim}
            whileHover={{
              y: -5,
              scale: 1.02,
              transition: { type: "spring", stiffness: 200, damping: 14 },
            }}
          >
            <Card
              className="
                group
                relative
                rounded-2xl
                backdrop-blur-xl
                bg-white/60
                border border-emerald-200/50
                shadow-[0_4px_20px_rgba(0,0,0,0.05)]
                transition-all duration-300
                overflow-hidden
              "
            >
              {/* SOFT TOP GREEN STRIP */}
              <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-emerald-300 via-emerald-200 to-teal-200 opacity-70" />

              <CardHeader className="text-center pb-4 mt-6">

                {/* Animated Icon Badge */}
                <motion.div
                  className="flex justify-center mb-4"
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 180 }}
                >
                  <div
                    className="
                      h-14 w-14 rounded-2xl
                      bg-emerald-100/60 
                      backdrop-blur-xl
                      border border-emerald-200
                      flex items-center justify-center
                      text-emerald-700
                      transition-all duration-300
                      group-hover:bg-emerald-600 group-hover:text-white
                      group-hover:border-emerald-600
                    "
                  >
                   <AppIcon name= {m.icon}/>
                  </div>
                </motion.div>

                <CardTitle className="text-lg font-semibold text-gray-900">
                  {m.title}
                </CardTitle>
              </CardHeader>

              <CardContent className="text-center pb-6 px-6">
                <p className="text-sm text-gray-700 mb-5 leading-relaxed">
                  {m.description}
                </p>

                <Link to={m.path}>
                  <motion.div whileTap={{ scale: 0.95 }}>
                    <Button
                      className="
                        w-full 
                        py-2.5
                        text-sm 
                        rounded-xl 
                        bg-emerald-600 text-white 
                        hover:bg-emerald-700
                        transition-all
                      "
                    >
                      Open {m.title}
                    </Button>
                  </motion.div>
                </Link>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default InputModule;
