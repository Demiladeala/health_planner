import React from 'react';
import { motion } from 'framer-motion';

const LogoutModal = ({ isOpen, onClose, onConfirm }) => {
  return (
    isOpen ? (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-500 bg-opacity-50">
        <motion.div
          className="bg-white p-6 rounded-lg shadow-lg w-80"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <h3 className="text-lg font-semibold mb-4">Confirm Logout</h3>
          <p className="mb-6">Are you sure you want to log out?</p>
          <div className="flex justify-end gap-4">
            <button
              onClick={onConfirm}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Logout
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </motion.div>
      </div>
    ) : null
  );
};

export default LogoutModal;