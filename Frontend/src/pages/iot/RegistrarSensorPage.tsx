import React from "react";
import DefaultLayout from "@/layouts/default";
import RegistrarSensor from "@/components/Iot/RegistrarSensor";

const RegistrarSensorPage: React.FC = () => {
  return (
    <DefaultLayout>
      <div className="flex justify-center items-center min-h-screen p-6 bg-gray-100">
        <RegistrarSensor />
      </div>
    </DefaultLayout>
  );
};

export default RegistrarSensorPage;