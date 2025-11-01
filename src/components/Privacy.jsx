import React from "react";
import { motion } from "framer-motion";
import { Shield, Info, Cookie, UserCheck } from "lucide-react";

export default function Privacy() {
  const sections = [
    {
      icon: <Info className="text-blue-500 w-7 h-7" />,
      title: "Information We Collect",
      text: "We gather only essential information such as browsing data and form inputs to improve your travel experience.",
    },
    {
      icon: <Shield className="text-green-500 w-7 h-7" />,
      title: "How We Use It",
      text: "Your data helps us personalize content, suggest destinations, and improve website performance.",
    },
    {
      icon: <Cookie className="text-yellow-500 w-7 h-7" />,
      title: "Cookies & Analytics",
      text: "We use cookies to track user preferences and Google Analytics for aggregated site statistics.",
    },
    {
      icon: <UserCheck className="text-orange-500 w-7 h-7" />,
      title: "User Rights & Data Deletion",
      text: "You can request data removal or opt out of cookies anytime via browser settings.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex flex-col items-center py-16 px-6">
      {/* Header */}
      <motion.h1
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-5xl font-extrabold text-blue-800 mb-4 text-center"
      >
        Privacy Policy
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="text-gray-700 text-center max-w-2xl mb-10"
      >
        We respect your privacy and are committed to protecting your personal data.
        Here’s how we ensure your trust and transparency in everything we do.
      </motion.p>

      {/* Cards */}
      <div className="grid sm:grid-cols-2 gap-6 max-w-4xl w-full">
        {sections.map((section, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.15 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl shadow-md hover:shadow-lg p-6 flex flex-col gap-3 border-l-4 border-blue-400 transition-transform hover:-translate-y-1"
          >
            <div className="flex items-center gap-3">
              {section.icon}
              <h2 className="text-xl font-semibold text-gray-800">
                {section.title}
              </h2>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed">
              {section.text}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Footer Note */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="mt-14 max-w-2xl bg-white/80 backdrop-blur-sm border border-gray-200 shadow-md rounded-xl p-6 text-center"
      >
        <p className="text-gray-700 text-sm">
          ✨ This privacy policy is for demonstration purposes only. No personal
          data is collected or stored beyond your local browser.
        </p>
      </motion.div>
    </div>
  );
}
