"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";

const AboutUs = () => {
  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.3,
        duration: 0.6,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
      },
    },
  };
  const gradientCard = 'bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-gray-800 via-gray-950 to-gray-950'
  return (
    <div className="bg-[#cbd3cb] text-gray-800 pt-32">
      <div className="container mx-auto px-6 sm:px-8 md:px-12 lg:px-16">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="text-center mb-12"
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4">
            About Us
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl">
            Learn more about our mission, vision, and team!
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 text-center">
            Our Mission
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-center max-w-3xl mx-auto">
            Our mission is to provide high-quality Courses tailored to meet
            the unique needs of our market. We aim to deliver excellence
            through our innovative designs, exceptional craftsmanship, and
            dedicated customer service.
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
            Our Team
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((item, index) => (
              <motion.div
                key={index}
                initial="hidden"
                animate="visible"
                variants={itemVariants}
                className={`${gradientCard} text-white p-6 rounded-lg shadow-md`}
              >
                <Image
                  src={`https://flowbite.com/docs/images/carousel/carousel-1.svg`}
                  alt={`Team Member ${item}`}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                  width={150}
                  height={150}
                />
                <h3 className="text-xl font-bold mb-2">Member Name {item}</h3>
                <p className="text-gray-400">Position {item}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="text-center"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
            Our Vision
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-center max-w-3xl mx-auto">
            Our vision is to be a leader in the garments industry, known for our
            commitment to quality, innovation, and customer satisfaction. We
            strive to continuously improve and evolve to meet the changing needs
            of our customers and the market.
          </p>
        </motion.div>
      </div>
     
    </div>
  );
};

export default AboutUs;
